FROM node:22-alpine AS web
WORKDIR /web
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
ENV PORT=3000 PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py ./
COPY backend ./backend
COPY --from=web /web/dist ./dist
RUN useradd -m app && chown -R app /app
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD python -c "import urllib.request,os;urllib.request.urlopen('http://localhost:'+os.environ.get('PORT','3000')+'/healthz')" || exit 1
CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT} --workers 2 --timeout 60"]
