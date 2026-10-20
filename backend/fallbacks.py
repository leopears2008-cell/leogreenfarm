"""Offline farming advice used only when no AI key is configured or the AI is unreachable.
General best-practice tips only; callers flag the response as offline."""
import json
from pathlib import Path

_TEXTS = json.loads((Path(__file__).parent / "data" / "chat_fallback.json").read_text(encoding="utf-8"))
_TA_CROP_WORDS = ("பயிர்", "நெல்", "நோய்", "blast", "இலை")


def chat_fallback(message: str, language: str) -> str:
    if language == "Tamil":
        q = message.lower()
        return _TEXTS["ta_crop"] if any(w in q for w in _TA_CROP_WORDS) else _TEXTS["ta_general"]
    if language == "Hindi":
        return _TEXTS["hi"]
    return _TEXTS["en"]
