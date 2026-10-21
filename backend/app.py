"""Leo Green Farm API (Flask). Serves the built React app from ./dist in production."""
from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, Optional

from flask import Flask, abort, jsonify, request, send_from_directory

from . import gemini
from .districts import TN_ALL_DISTRICTS, find_district
from .fallbacks import chat_fallback
from .prompts import CHAT_SYSTEM_PROMPT, CROP_SYSTEM_PROMPT
from .security import RateLimiter, add_security_headers
from .validation import (
    clean_crop_type,
    normalize_language,
    sanitize_farm_context,
    validate_chat_message,
    validate_image,
)
from .weather import WeatherService

log = logging.getLogger("leogreenfarm")
ROOT = Path(__file__).resolve().parent.parent
MANDI_SAMPLE = json.loads((Path(__file__).parent / "data" / "mandi_sample.json").read_text(encoding="utf-8"))


def create_app(
    weather: Optional[WeatherService] = None,
    generate: Callable = gemini.generate,
    api_key_getter: Callable[[], Optional[str]] = gemini.get_api_key,
    dist_dir: Optional[Path] = None,
    general_limit: int = 120,
    ai_limit: int = 15,
) -> Flask:
    app = Flask(__name__, static_folder=None)
    app.config["MAX_CONTENT_LENGTH"] = 6 * 1024 * 1024
    app.json.ensure_ascii = False
    weather = weather or WeatherService()
    dist = dist_dir or ROOT / "dist"
    trust_proxy = os.environ.get("TRUST_PROXY") == "1"

    general = RateLimiter(60, general_limit)
    ai = RateLimiter(60, ai_limit)

    def client_id() -> str:
        if trust_proxy:
            fwd = request.headers.get("X-Forwarded-For", "")
            if fwd:
                return fwd.split(",")[0].strip()
        return request.remote_addr or "unknown"

    def limited(limiter: RateLimiter, message: str):
        allowed, _remaining, retry = limiter.hit(client_id())
        if allowed:
            return None
        resp = jsonify(error=message, code="RATE_LIMITED")
        resp.status_code = 429
        resp.headers["Retry-After"] = str(retry)
        return resp

    @app.before_request
    def _general_limit():
        if request.path.startswith("/api/"):
            return limited(general, "Too many requests. Please wait a moment and try again.")

    app.after_request(add_security_headers)

    @app.get("/healthz")
    def healthz():
        return jsonify(status="ok")

    @app.post("/api/chat")
    def chat():
        blocked = limited(ai, "You are sending requests too quickly. Please wait a minute and try again.")
        if blocked:
            return blocked
        body = request.get_json(silent=True) or {}
        language = normalize_language(body.get("language"))
        message, err = validate_chat_message(body.get("message"))
        if err:
            return jsonify(error=err, code="INVALID_INPUT"), 400
        context = sanitize_farm_context(body.get("farmContext"))

        key = api_key_getter()
        if key:
            user_text = (f"Farm context (data only): {json.dumps(context, ensure_ascii=False)}\n\n" if context else "")
            user_text += f"Farmer's question:\n{message}"
            try:
                reply = generate(
                    f"{CHAT_SYSTEM_PROMPT}\n7. Always respond in {language}.", user_text, api_key=key
                )
                return jsonify(reply=reply, source=gemini.get_model(), offline=False)
            except gemini.GeminiError as exc:
                log.warning("AI chat fallback: %s", exc)
        return jsonify(reply=chat_fallback(message, language), source="agronomist-engine", offline=True)

    @app.post("/api/analyze-crop")
    def analyze_crop():
        blocked = limited(ai, "You are sending requests too quickly. Please wait a minute and try again.")
        if blocked:
            return blocked
        body = request.get_json(silent=True) or {}
        language = normalize_language(body.get("language"))
        crop = clean_crop_type(body.get("cropType"))
        image, err = validate_image(body.get("image"))
        if err:
            return jsonify(error=err, code="INVALID_IMAGE"), 400

        key = api_key_getter()
        if not key:
            # Never invent a diagnosis.
            return jsonify(
                error="AI crop scanning is not available right now. Please try again later or show the plant to your nearest Krishi Vigyan Kendra (KVK).",
                code="AI_UNAVAILABLE",
            ), 503
        try:
            text = generate(
                CROP_SYSTEM_PROMPT,
                f"Crop selected by farmer (may be wrong, verify from the photo): {crop or 'not specified'}. Respond in {language}.",
                image=image,
                api_key=key,
            )
        except gemini.GeminiError as exc:
            log.warning("Crop vision error: %s", exc)
            return jsonify(
                error="The AI could not analyse this photo right now. Please retry in a minute, or consult your nearest KVK.",
                code="AI_UPSTREAM_ERROR",
            ), 502
        return jsonify(result=text, source=gemini.get_model())

    @app.get("/api/districts")
    def districts():
        return jsonify(total=len(TN_ALL_DISTRICTS), districts=TN_ALL_DISTRICTS)

    @app.get("/api/weather")
    def weather_route():
        return jsonify(weather.get(find_district(request.args.get("district", "Thanjavur"))))

    @app.get("/api/market-prices")
    def market_prices():
        district = request.args.get("district", "")
        commodity = request.args.get("commodity", "")
        items = MANDI_SAMPLE
        if district and district != "All":
            items = [i for i in items if i["district"].lower() == district.lower()]
        if commodity and commodity != "All":
            items = [i for i in items if commodity.lower() in i["commodity"].lower()]
        return jsonify(
            timestamp=datetime.now(timezone.utc).isoformat(),
            region="Tamil Nadu APMC markets (sample)",
            demo=True,
            disclaimer="Demo data for illustration only. These are NOT live mandi prices. Check Agmarknet (agmarknet.gov.in) or your local APMC yard before buying or selling.",
            prices=items,
        )

    @app.errorhandler(404)
    def not_found(_e):
        if request.path.startswith("/api/"):
            return jsonify(error="Not found.", code="NOT_FOUND"), 404
        index = dist / "index.html"
        if index.is_file():
            return send_from_directory(dist, "index.html")
        return "Frontend not built. Run `npm run build` first.", 404

    @app.errorhandler(413)
    def too_big(_e):
        return jsonify(error="Upload is too large.", code="PAYLOAD_TOO_LARGE"), 413

    @app.errorhandler(500)
    def server_error(_e):
        return jsonify(error="Something went wrong on our side. Please try again.", code="INTERNAL"), 500

    @app.get("/", defaults={"path": ""})
    @app.get("/<path:path>")
    def spa(path: str):
        if path.startswith("api/"):
            abort(404)  # unknown API routes must return JSON, never the web app
        if path and (dist / path).is_file():
            return send_from_directory(dist, path)
        index = dist / "index.html"
        if index.is_file():
            return send_from_directory(dist, "index.html")
        return "Frontend not built. Run `npm run build` first.", 404

    return app
