"""Input validation helpers. Everything the client sends is treated as untrusted."""
from __future__ import annotations

import base64
import binascii
import re
from typing import Optional, Tuple

MAX_MESSAGE_CHARS = 2000
MAX_IMAGE_BYTES = 4 * 1024 * 1024  # decoded size

_DATA_URI = re.compile(r"^data:image/[a-zA-Z+.-]+;base64,")
_ALLOWED_CONTEXT_KEYS = ("state", "zone", "primaryCrop", "soil")


def normalize_language(value) -> str:
    if not isinstance(value, str):
        return "English"
    v = value.strip().lower()
    if v in ("tamil", "ta"):
        return "Tamil"
    if v in ("hindi", "hi"):
        return "Hindi"
    return "English"


def validate_chat_message(value) -> Tuple[Optional[str], Optional[str]]:
    """Returns (message, error). Exactly one is not None."""
    if not isinstance(value, str) or not value.strip():
        return None, "Please type a question."
    text = value.strip()
    if len(text) > MAX_MESSAGE_CHARS:
        return None, f"Message is too long (max {MAX_MESSAGE_CHARS} characters)."
    return text, None


def sanitize_farm_context(value) -> dict:
    """Keep only known short string fields so the client cannot smuggle instructions."""
    out = {}
    if isinstance(value, dict):
        for key in _ALLOWED_CONTEXT_KEYS:
            v = value.get(key)
            if isinstance(v, str):
                out[key] = re.sub(r"[\r\n]+", " ", v)[:60]
    return out


def clean_crop_type(value) -> str:
    return re.sub(r"[\r\n]+", " ", value)[:60] if isinstance(value, str) else ""


def _detect_mime(data: bytes) -> Optional[str]:
    if data[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


def validate_image(value) -> Tuple[Optional[Tuple[str, str]], Optional[str]]:
    """Returns ((base64, mime), error). The mime type is detected from file contents."""
    if not isinstance(value, str) or not value:
        return None, "No image provided. Please upload a clear photo of the crop."
    b64 = _DATA_URI.sub("", value).strip()
    try:
        raw = base64.b64decode(b64, validate=True)
    except (binascii.Error, ValueError):
        return None, "Invalid image data."
    if not raw:
        return None, "Invalid image data."
    if len(raw) > MAX_IMAGE_BYTES:
        return None, "Image is too large (max 4 MB)."
    mime = _detect_mime(raw)
    if mime is None:
        return None, "Unsupported image type. Use JPEG, PNG or WebP."
    return (b64, mime), None
