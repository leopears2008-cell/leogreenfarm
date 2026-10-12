// Serverless proxy for the Gemini API (Vercel-style handler).
// The API key stays on the server; the browser never sees it.

const MAX_MESSAGES = 12;
const MAX_CHARS = 2000;
const TIMEOUT_MS = 20000;
const LANGS = { en: 'English', ta: 'Tamil', hi: 'Hindi' };

// Best-effort in-memory rate limit (resets on cold start; not a substitute for a shared store).
const hits = new Map();
const WINDOW_MS = 60000;
const MAX_PER_WINDOW = 15;

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function systemPrompt(lang) {
  return [
    'You are Leo Green Farm assistant, helping Indian farmers, including those in Tamil Nadu.',
    `Reply in ${LANGS[lang]}. Keep answers short, practical, and easy to read on a phone.`,
    'Do not invent government schemes, subsidies, citations, prices, or pesticide/fertilizer dosages.',
    'For disease, pesticide, or fertilizer questions, ask for crop, growth stage, and location if missing, and recommend confirming with a local Krishi Vigyan Kendra, agricultural university, or agriculture officer.',
    'If you are unsure, say so plainly.'
  ].join(' ');
}

function validate(body) {
  if (!body || typeof body !== 'object') return null;
  const lang = LANGS[body.lang] ? body.lang : 'en';
  if (!Array.isArray(body.messages) || body.messages.length === 0) return null;
  const msgs = body.messages.slice(-MAX_MESSAGES);
  const contents = [];
  for (const m of msgs) {
    if (!m || (m.role !== 'user' && m.role !== 'model') || typeof m.text !== 'string') return null;
    const text = m.text.trim().slice(0, MAX_CHARS);
    if (!text) return null;
    contents.push({ role: m.role, parts: [{ text }] });
  }
  if (contents[0].role !== 'user' || contents[contents.length - 1].role !== 'user') return null;
  return { lang, contents };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'The AI assistant is not configured yet.' });
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  }

  const input = validate(req.body);
  if (!input) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  const model = /^[a-zA-Z0-9._-]+$/.test(process.env.GEMINI_MODEL || '') ? process.env.GEMINI_MODEL : 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt(input.lang) }] },
        contents: input.contents,
        generationConfig: { maxOutputTokens: 800, temperature: 0.4 }
      }),
      signal: controller.signal
    });

    if (!upstream.ok) {
      console.error('Gemini upstream error status:', upstream.status);
      return res.status(502).json({ error: 'The AI service is unavailable right now. Please try again later.' });
    }

    const data = await upstream.json();
    const reply = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim();
    if (!reply) {
      return res.status(502).json({ error: 'No answer was returned. Please rephrase your question.' });
    }
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Gemini request failed:', err.name);
    const timedOut = err.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({ error: timedOut ? 'The AI service timed out.' : 'The AI service is unavailable right now.' });
  } finally {
    clearTimeout(timer);
  }
};
