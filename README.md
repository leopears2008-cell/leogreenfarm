# Leo Green Farm

AI-powered farming assistant for Indian farmers (English, Tamil, Hindi replies).

## Current status
- Working code: chat assistant UI + `/api/chat` serverless proxy to the Gemini API (not yet verified against a live key).
- Planned (not built): weather, crop disease detection, irrigation, market prices, accounts, voice, PWA. See `docs/PROJECT_AUDIT.md`.

## Setup
1. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` (get one from Google AI Studio). Never commit it.
2. Deploy to Vercel (or similar) and set `GEMINI_API_KEY` in the project's environment variables.
3. Local run: `npx vercel dev` (serves `index.html` and `api/chat.js`).

## Security notes
- The API key is read only on the server (`api/chat.js`).
- Do not put keys in `script.js` or any file served to the browser.

## License
MIT
