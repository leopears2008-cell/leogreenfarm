"""Live weather + agronomic advisory for Tamil Nadu districts (Open-Meteo)."""
from __future__ import annotations

import threading
import time
from datetime import datetime, timedelta, timezone
from typing import Callable, Dict, Optional, Tuple

import requests

from .weather_math import (
    day_of_year,
    hargreaves_et0,
    pick_hourly_value,
    soil_moisture_percent,
    wind_direction_text,
)

IST = timezone(timedelta(hours=5, minutes=30))
CACHE_TTL_S = 180
_CACHE_MAX = 200

OPEN_METEO = (
    "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
    "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,"
    "weather_code,wind_speed_10m,wind_direction_10m,surface_pressure"
    "&hourly=soil_moisture_0_to_1cm,uv_index"
    "&daily=et0_fao_evapotranspiration,weather_code,temperature_2m_max,temperature_2m_min,"
    "precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=Asia%2FKolkata"
)


def interpret_wmo(code: int) -> Dict[str, str]:
    table = [
        (lambda c: c == 0, "Clear Sky", "தெளிவான வானம்", "sun"),
        (lambda c: c == 1, "Mainly Clear", "பெரும்பாலும் தெளிவான வானம்", "sun"),
        (lambda c: c == 2, "Partly Cloudy", "பகுதி மேகமூட்டம்", "cloud-sun"),
        (lambda c: c == 3, "Overcast", "முழு மேகமூட்டம்", "cloud-sun"),
        (lambda c: 45 <= c <= 48, "Fog & Mist", "பனிமூட்டம்", "cloud-sun"),
        (lambda c: 51 <= c <= 57, "Light Drizzle", "லேசான தூறல்", "cloud-drizzle"),
        (lambda c: 61 <= c <= 67, "Rain Showers", "மழைப் பொழிவு", "cloud-rain"),
        (lambda c: 71 <= c <= 77, "Cool Precipitation", "குளிர்ந்த மழை", "cloud-rain"),
        (lambda c: 80 <= c <= 82, "Scattered Rain", "சிதறிய மழை", "cloud-rain"),
        (lambda c: c >= 95, "Thunderstorm", "இடியுடன் கூடிய மழை", "cloud-rain"),
    ]
    for test, en, ta, icon in table:
        if test(code):
            return {"condition": en, "conditionTa": ta, "icon": icon}
    return {"condition": "Mild Weather", "conditionTa": "மிதமான வானிலை", "icon": "cloud-sun"}


def agro_advisory(temp, humidity, wind, rain_chance, district: str, crops) -> Dict[str, str]:
    crop_str = ", ".join(crops[:3])
    if rain_chance >= 60:
        return {
            "en": f"High probability of rain ({rain_chance}%) in {district}. Hold drip fertigation and foliar pesticide sprays to prevent chemical wash-off. Ensure adequate drainage bunds across {crop_str} fields to prevent waterlogging.",
            "ta": f"{district} பகுதியில் கனமழை வாய்ப்பு ({rain_chance}%). உரமிடுதல் மற்றும் பூச்சிக்கொல்லி தெளிப்பதை ஒத்திவைக்கவும். {crop_str} பயிர்களில் நீர் தேங்குவதைத் தடுக்க வடிகால் வசதியை சரிபார்க்கவும்.",
        }
    if temp >= 36:
        return {
            "en": f"High daytime heat ({temp}°C) in {district}. Water stress alert for {crop_str}. Schedule drip cycles between 4:30 PM - 7:00 PM to minimize evapotranspiration losses. Mulch tree basins to preserve soil moisture.",
            "ta": f"{district} பகுதியில் அதிக வெப்பம் ({temp}°C). {crop_str} பயிர்களுக்கு மாலை 4:30 - 7:00 மணிக்குள் சொட்டு நீர் பாசனம் செய்யவும். மண் ஈரப்பதத்தை பாதுகாக்க மூடாக்கு இடவும்.",
        }
    if humidity >= 78:
        return {
            "en": f"Elevated relative humidity ({humidity}%) in {district}. Favorable conditions for fungal pathogens (Blast / Sheath Rot in {crop_str}). Inspect field early morning and spray 5% Neem Seed Kernel Extract (NSKE) or Pseudomonas fluorescens as bio-preventative.",
            "ta": f"{district} பகுதியில் காற்றில் அதிக ஈரப்பதம் ({humidity}%). {crop_str} பயிர்களில் பூஞ்சான நோய்களைக் கண்காணிக்கவும். வேப்பங்கொட்டை சாறு அல்லது சூடோமோனாஸ் தெளிக்கவும்.",
        }
    if wind >= 20:
        return {
            "en": f"Gusty winds detected ({wind} km/h) in {district}. Provide mechanical propping/supports for Banana and Sugarcane canes. Postpone drone or high-pressure boom spraying.",
            "ta": f"{district} பகுதியில் பலத்த காற்று ({wind} கி.மீ/மணி). வாழை மற்றும் கரும்பு பயிர்களுக்கு முட்டுக்கொடுத்து பாதுகாக்கவும்.",
        }
    return {
        "en": f"Favorable microclimate in {district} ({temp}°C, {humidity}% RH). Ideal window for vegetative growth in {crop_str}. Optimal conditions for organic bio-stimulant (Panchagavya 3%) foliar spray before 10:00 AM.",
        "ta": f"{district} பகுதியில் மிதமான சாதகமான வானிலை ({temp}°C, {humidity}% RH). {crop_str} வளர்ச்சிக்கு சிறந்தது. காலை 10:00 மணிக்குள் 3% பஞ்சகாவ்யா தெளிக்க உகந்த நேரம்.",
    }


def _fmt_date(now: datetime) -> str:
    return now.strftime("%A, %d %b %Y")


def _fmt_time(now: datetime) -> str:
    return now.strftime("%I:%M %p") + " IST"


def _base(district: Dict, now: datetime) -> Dict:
    return {
        "district": district["name"],
        "districtId": district["id"],
        "districtTa": district["nameTa"],
        "zone": district["zone"],
        "zoneTa": district["zoneTa"],
        "coordinates": {"lat": district["lat"], "lon": district["lon"]},
        "liveDate": _fmt_date(now),
        "liveTime": _fmt_time(now),
        "timestamp": now.astimezone(timezone.utc).isoformat(),
        "primaryCrops": district["primaryCrops"],
        "soilType": district["soilType"],
    }


def _num(v, default):
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) else default


def build_live_payload(district: Dict, meteo: Dict, now: datetime) -> Dict:
    cur = meteo.get("current") or {}
    daily = meteo.get("daily") or {}
    hourly = meteo.get("hourly") or {}

    temp = round(_num(cur.get("temperature_2m"), 31))
    humidity = round(_num(cur.get("relative_humidity_2m"), 65))
    feels = round(_num(cur.get("apparent_temperature"), temp))
    wind = round(_num(cur.get("wind_speed_10m"), 12))
    wind_deg = _num(cur.get("wind_direction_10m"), 120)
    pop = (daily.get("precipitation_probability_max") or [None])[0]
    rain_chance = round(_num(pop, 80 if _num(cur.get("rain"), 0) > 0 else 15))
    precip = round(float(_num(cur.get("precipitation"), 0)), 1)
    wmo = interpret_wmo(int(_num(cur.get("weather_code"), 1)))

    api_et0 = (daily.get("et0_fao_evapotranspiration") or [None])[0]
    t_max = (daily.get("temperature_2m_max") or [None])[0]
    t_min = (daily.get("temperature_2m_min") or [None])[0]
    if isinstance(api_et0, (int, float)):
        et0: Optional[float] = round(api_et0, 1)
    elif isinstance(t_max, (int, float)) and isinstance(t_min, (int, float)):
        et0 = hargreaves_et0(t_max, t_min, district["lat"], day_of_year(now.date()))
    else:
        et0 = None

    soil_pct = soil_moisture_percent(
        pick_hourly_value(hourly.get("time"), hourly.get("soil_moisture_0_to_1cm"), cur.get("time"))
    )
    if soil_pct is None:
        soil_label = "Unavailable"
    elif soil_pct >= 35:
        soil_label = f"Optimal ({soil_pct}%)"
    elif soil_pct >= 20:
        soil_label = f"Moderate ({soil_pct}%)"
    else:
        soil_label = f"Dry ({soil_pct}%)"

    uv = round(_num((daily.get("uv_index_max") or [None])[0], 8))
    pressure = round(_num(cur.get("surface_pressure"), 1010))
    dew = round(temp - (100 - humidity) / 5)

    forecast = []
    for idx, iso in enumerate((daily.get("time") or [])[:7]):
        d = datetime.fromisoformat(iso)
        info = interpret_wmo(int(_num((daily.get("weather_code") or [])[idx] if idx < len(daily.get("weather_code") or []) else None, 1)))
        highs, lows, pops = daily.get("temperature_2m_max") or [], daily.get("temperature_2m_min") or [], daily.get("precipitation_probability_max") or []
        forecast.append({
            "day": d.strftime("%a"),
            "dateFormatted": f"{d.day} {d.strftime('%b')}",
            "isoDate": iso,
            "high": round(_num(highs[idx] if idx < len(highs) else None, temp + 1)),
            "low": round(_num(lows[idx] if idx < len(lows) else None, temp - 7)),
            "condition": info["condition"],
            "conditionTa": info["conditionTa"],
            "rain": round(_num(pops[idx] if idx < len(pops) else None, 10)),
            "icon": info["icon"],
        })

    def clock(key):
        v = (daily.get(key) or [None])[0]
        try:
            return datetime.fromisoformat(v).strftime("%I:%M %p") if v else None
        except ValueError:
            return None

    adv = agro_advisory(temp, humidity, wind, rain_chance, district["name"], district["primaryCrops"])
    payload = _base(district, now)
    payload.update({
        "live": True, "offline": False,
        "temperature": temp, "feelsLike": feels,
        **wmo,
        "humidity": humidity, "windSpeed": wind,
        "windDirection": wind_direction_text(wind_deg), "windDegrees": wind_deg,
        "rainfallChance": rain_chance, "precipitation": precip,
        "soilMoisture": soil_label, "soilMoistureNumeric": soil_pct,
        "evapotranspiration": et0,
        "uvIndex": uv, "dewPoint": dew, "surfacePressure": pressure,
        "sunrise": clock("sunrise") or "06:05 AM", "sunset": clock("sunset") or "06:12 PM",
        "advisory": adv["en"], "advisoryTa": adv["ta"],
        "forecast": forecast or [{
            "day": "Today", "dateFormatted": _fmt_date(now), "high": temp, "low": temp - 7,
            "condition": wmo["condition"], "rain": rain_chance, "icon": wmo["icon"],
        }],
    })
    return payload


def build_offline_payload(district: Dict, now: datetime) -> Dict:
    """Regional estimate used when Open-Meteo is unreachable. Always flagged offline, with no fake forecast."""
    zone = district["zone"]
    base_temp = 19 if "Hilly" in zone else 29 if "Western" in zone else 33
    base_hum = 72 if "Delta" in zone else 62
    adv = agro_advisory(base_temp, base_hum, 14, 20, district["name"], district["primaryCrops"])
    payload = _base(district, now)
    payload.update({
        "live": False, "offline": True,
        "note": "Live weather is temporarily unavailable. Values shown are regional estimates, not a forecast.",
        "temperature": base_temp, "feelsLike": base_temp + 2,
        "condition": "Estimate unavailable", "conditionTa": "மதிப்பீடு கிடைக்கவில்லை", "icon": "cloud-sun",
        "humidity": base_hum, "windSpeed": 14, "windDirection": "SE", "windDegrees": 135,
        "rainfallChance": 20, "precipitation": 0,
        "soilMoisture": "Unavailable", "soilMoistureNumeric": None,
        "evapotranspiration": None,
        "uvIndex": 8, "dewPoint": 22, "surfacePressure": 1012,
        "sunrise": "06:05 AM", "sunset": "06:12 PM",
        "advisory": adv["en"], "advisoryTa": adv["ta"],
        "forecast": [],
    })
    return payload


class WeatherService:
    def __init__(self, http_get: Callable = requests.get, clock: Callable[[], float] = time.time):
        self._get = http_get
        self._clock = clock
        self._cache: Dict[str, Tuple[Dict, float]] = {}
        self._lock = threading.Lock()

    def get(self, district: Dict) -> Dict:
        key = district["id"]
        now_ts = self._clock()
        with self._lock:
            hit = self._cache.get(key)
            if hit and now_ts < hit[1]:
                return hit[0]
        now = datetime.fromtimestamp(now_ts, tz=IST)
        try:
            resp = self._get(OPEN_METEO.format(lat=district["lat"], lon=district["lon"]), timeout=4)
            if resp.status_code != 200:
                raise RuntimeError(f"open-meteo status {resp.status_code}")
            payload = build_live_payload(district, resp.json(), now)
        except Exception:  # network, JSON or shape errors: degrade honestly, never crash
            return build_offline_payload(district, now)
        with self._lock:
            if len(self._cache) >= _CACHE_MAX:
                self._cache.clear()
            self._cache[key] = (payload, now_ts + CACHE_TTL_S)
        return payload
