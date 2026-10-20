"""Minimal Gemini client over the public REST API (generateContent). No SDK needed."""
from __future__ import annotations

import os
from typing import Optional

import requests

API_ROOT = "https://generativelanguage.googleapis.com/v1beta/models"


class GeminiError(Exception):
    """Raised for any upstream/AI failure. Never include secrets in the message."""


def get_api_key() -> Optional[str]:
    key = (os.environ.get("GEMINI_API_KEY") or "").strip()
    return key or None


def get_model() -> str:
    return (os.environ.get("GEMINI_MODEL") or "").strip() or "gemini-2.5-flash"


def generate(
    system_instruction: str,
    user_text: str,
    image: Optional[tuple] = None,
    *,
    api_key: str,
    model: Optional[str] = None,
    timeout: float = 30,
    post=requests.post,
) -> str:
    """Call Gemini. `image` is (base64_data, mime_type). System text stays separate from user content."""
    parts = [{"text": user_text}]
    if image:
        parts.append({"inlineData": {"mimeType": image[1], "data": image[0]}})
    body = {
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "contents": [{"role": "user", "parts": parts}],
    }
    url = f"{API_ROOT}/{model or get_model()}:generateContent"
    try:
        resp = post(url, json=body, headers={"x-goog-api-key": api_key}, timeout=timeout)
    except requests.RequestException as exc:
        raise GeminiError(f"network error: {type(exc).__name__}") from exc
    if resp.status_code != 200:
        raise GeminiError(f"upstream status {resp.status_code}")
    try:
        data = resp.json()
        text = "".join(p.get("text", "") for p in data["candidates"][0]["content"]["parts"])
    except (ValueError, KeyError, IndexError, TypeError) as exc:
        raise GeminiError("unexpected response shape") from exc
    if not text.strip():
        raise GeminiError("empty response")
    return text
