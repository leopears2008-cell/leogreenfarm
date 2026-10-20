"""Entry point: `python app.py` (dev) or `gunicorn app:app` (production)."""
import logging
import os

from backend.app import create_app

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "3000")), debug=os.environ.get("FLASK_DEBUG") == "1")
