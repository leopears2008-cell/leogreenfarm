"""Agronomic weather maths (FAO-56 / Hargreaves-Samani)."""
from __future__ import annotations

import math
from datetime import date
from typing import List, Optional, Sequence


def extraterrestrial_radiation_mm(lat_deg: float, day_of_year: int) -> float:
    """FAO-56 eq. 21, returned as equivalent evaporation in mm/day."""
    phi = math.radians(lat_deg)
    dr = 1 + 0.033 * math.cos(2 * math.pi * day_of_year / 365)
    delta = 0.409 * math.sin(2 * math.pi * day_of_year / 365 - 1.39)
    ws = math.acos(max(-1.0, min(1.0, -math.tan(phi) * math.tan(delta))))
    gsc = 0.082  # MJ m-2 min-1
    ra_mj = (24 * 60 / math.pi) * gsc * dr * (
        ws * math.sin(phi) * math.sin(delta) + math.cos(phi) * math.cos(delta) * math.sin(ws)
    )
    return ra_mj * 0.408


def hargreaves_et0(t_max: float, t_min: float, lat_deg: float, day_of_year: int) -> float:
    """ET0 = 0.0023 * Ra * (Tmean + 17.8) * sqrt(Tmax - Tmin), mm/day."""
    rng = max(0.0, t_max - t_min)
    t_mean = (t_max + t_min) / 2
    et0 = 0.0023 * extraterrestrial_radiation_mm(lat_deg, day_of_year) * (t_mean + 17.8) * math.sqrt(rng)
    return round(max(0.0, et0), 1)


def day_of_year(d: date) -> int:
    return d.timetuple().tm_yday


def pick_hourly_value(
    times: Optional[Sequence[str]], values: Optional[Sequence[Optional[float]]], current_time: Optional[str]
) -> Optional[float]:
    """Value for the hour matching Open-Meteo's `current.time` (already in the requested timezone). 0 is valid."""
    if not times or not values or not current_time:
        return None
    key = current_time[:13] + ":00"
    try:
        idx = list(times).index(key)
    except ValueError:
        return None
    if idx >= len(values):
        return None
    v = values[idx]
    return float(v) if isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v) else None


def soil_moisture_percent(volumetric: Optional[float]) -> Optional[int]:
    if volumetric is None:
        return None
    return max(0, min(100, int(round(volumetric * 100))))


def wind_direction_text(deg: float) -> str:
    dirs: List[str] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    return dirs[int(round((deg % 360) / 45)) % 8]
