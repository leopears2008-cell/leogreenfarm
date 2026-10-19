# Leo Green Farm

Agricultural decision-support web app for farmers in Tamil Nadu: live weather, reported mandi prices, an editable crop planner, an irrigation calculator, a crop-photo check and an AI assistant (English, Tamil, Hindi).

> **Status:** this code has been changed but **not yet built, type-checked or tested** (see [Verification status](#verification-status)). Run the checks below before deploying.

## Features and data sources

| Feature | Source | Notes |
| --- | --- | --- |
| Weather & rain | [Open-Meteo](https://open-meteo.com) via `GET /api/weather` | Model forecast for the district centre, cached 10 min. No key needed. Shows an error state if unavailable; never falls back to sample data. |
| Mandi prices | Agmarknet via [data.gov.in](https://data.gov.in) (`GET /api/market-prices`) | Needs `DATA_GOV_IN_API_KEY`. Without it the tab says prices are not configured. Dates are the market's reported arrival dates. |
| Crop photo check | Gemini, server-side (`POST /api/analyze-crop`) | Preliminary AI opinion only, with a KVK referral. Needs `GEMINI_API_KEY`. |
| AI assistant | Gemini, server-side (`POST /api/chat`) | Needs `GEMINI_API_KEY`. Does not give chemical product names or doses. |
| Crop planner | Generic indicative templates | Editable; stored in browser `localStorage` only. |
| Farm profile | Entered by the user | Stored in browser `localStorage` only. |
| Irrigation calculator, growth-stage guide | In-app | Reference/calculation tools. |

There are no live notifications yet; the drawer says so.

## Tech stack

React 18, TypeScript, Vite 6, Tailwind CSS 4, Express 4, `@google/genai`.

## Getting started

Prerequisites: Node.js 20+ (Bun also works; `bun.lock` is committed).

```bash
npm install
cp .env.example .env   # then fill in the keys you have
npm run dev            # http://localhost:3000
```

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | no | Server port (default 3000) |
| `NODE_ENV` | no | Set to `production` by `npm start` deployments |
| `TRUST_PROXY` | no | `true` only behind a reverse proxy, so rate limits see real client IPs |
| `GEMINI_API_KEY` | for AI features | Server-side only; never exposed to the browser |
| `GEMINI_MODEL` | no | Defaults to `gemini-2.5-flash` |
| `DATA_GOV_IN_API_KEY` | for mandi prices | data.gov.in API key |

### Production

```bash
npm run build
NODE_ENV=production npm start
```

## API

All endpoints return JSON; errors are `{ "error": string }`.

- `GET /api/health` → `{ status, geminiConfigured, mandiConfigured }`
- `GET /api/weather?district=Thanjavur|Coimbatore|Madurai|Tiruchirappalli`
- `GET /api/market-prices[?district=&commodity=]` → `503` with `configured:false` if no key
- `POST /api/chat` `{ message, language: "English"|"Tamil"|"Hindi", farmContext? }` → `{ reply, source }`
- `POST /api/analyze-crop` `{ image: dataURI (jpeg/png/webp, ≤ 5 MB), cropType?, language }` → `{ result, source }`

## Security measures

- Secrets only in server environment variables; `.env` is git-ignored.
- Input validation on every route; image type, magic bytes and size checks.
- Per-IP rate limits (120/min API, 10/min AI routes), request timeouts, body-size limits.
- Provider errors are logged by name only and never returned to clients.
- Basic security headers.

Known gaps: the rate limiter is in-memory (per process); there is no authentication, so the AI endpoints are open to anyone who can reach the site (cost exposure); no Content-Security-Policy is set.

## Verification status

The following have **not** been run for the latest changes: `npm install`, `vite build`, the server bundle build, any type-check (the repo has no `tsconfig.json`), tests (none exist yet), browser/mobile checks, and a live call to Open-Meteo, data.gov.in or Gemini. The data.gov.in resource ID and filter syntax in `server.ts` are from documentation and must be confirmed with a real key.

## License

See [LICENSE](LICENSE).
