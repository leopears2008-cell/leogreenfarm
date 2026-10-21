# 🌱 Leo Green Farm

AI-powered farming assistant for Indian farmers, tuned for Tamil Nadu. Available in English, Tamil and Hindi.

## Features
- **AI farming assistant** (Gemini) with voice input
- **Crop disease scanner** from a leaf photo (Gemini Vision)
- **Live weather** for all 38 Tamil Nadu districts (Open-Meteo) with agro advisories, ET₀ and soil moisture
- **Irrigation calculator** and **crop planner**
- **Mandi price view** (currently demo data, clearly labelled)

## Honest limitations
- Mandi prices are **sample data**, not live. A real feed (e.g. the government Agmarknet dataset) is not connected yet.
- AI results are estimates, not a laboratory diagnosis. Always confirm with your nearest Krishi Vigyan Kendra (KVK).
- If AI or weather services are down, the app says so instead of showing made-up results.

## Tech stack
- **Backend:** Python 3.12 · Flask · requests · gunicorn (Gemini via the public REST API, weather from Open-Meteo)
- **Frontend:** React 18 · Vite 6 · Tailwind 4 · Recharts · Motion

## Run locally
```bash
# 1. API (terminal 1)
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY=your_key      # optional: without it AI chat is offline-only and scanning is disabled
python app.py                       # http://localhost:3000

# 2. Web app (terminal 2)
npm install
npm run dev                         # http://localhost:5173 (proxies /api to :3000)
```
Production: `npm run build` then `npm start` (gunicorn serves the API and the built app on one port).

## Tests
```bash
python -m unittest discover -s tests -t . -v   # 42 backend tests (validation, weather maths, API routes, rate limit)
npm run test:web                               # English/Tamil/Hindi key parity
```

## API
| Route | Purpose |
|---|---|
| `GET /healthz` | Liveness |
| `POST /api/chat` | `{message, language, farmContext}` → AI advice (`offline:true` when AI is unavailable) |
| `POST /api/analyze-crop` | `{image, cropType, language}` → diagnosis; `503/502` with an honest error, never a fake result |
| `GET /api/weather?district=` | Live weather, ET₀, soil moisture, 7-day forecast (`offline:true` if the feed is down) |
| `GET /api/districts` | All 38 Tamil Nadu districts |
| `GET /api/market-prices` | **Demo** mandi prices (`demo:true`) |

## Environment variables
| Name | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | For AI features | Server-side Gemini key |
| `GEMINI_MODEL` | No | Override model (default `gemini-2.5-flash`) |
| `PORT` | No | Server port (default 3000) |
| `TRUST_PROXY` | No | `1` behind a trusted reverse proxy |

## Security notes
Input validation on every AI route, per-IP rate limiting (in-memory; use a shared store for multiple instances), security headers, image type detected from file bytes, a 4 MB image cap, and the AI persona kept in a separate system instruction from user text.

## Docker
```bash
docker build -t leogreenfarm . && docker run -p 3000:3000 -e GEMINI_API_KEY=your_key leogreenfarm
```

## License
MIT. Author: Leo pears
