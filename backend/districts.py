import json
from pathlib import Path
from typing import Dict, List

_DATA = Path(__file__).parent / "data" / "tn_districts.json"
TN_ALL_DISTRICTS: List[Dict] = json.loads(_DATA.read_text(encoding="utf-8"))
_DEFAULT_ID = "thanjavur"


def _default() -> Dict:
    return next(d for d in TN_ALL_DISTRICTS if d["id"] == _DEFAULT_ID)


def find_district(query) -> Dict:
    """Look up a district by id, English/Tamil name or headquarters (case-insensitive). Falls back to Thanjavur."""
    if not isinstance(query, str) or not query.strip():
        return _default()
    q = query.strip().lower()
    for d in TN_ALL_DISTRICTS:
        if q in (d["id"], d["name"].lower(), d["nameTa"].lower(), d["headquarters"].lower()):
            return d
    return _default()
