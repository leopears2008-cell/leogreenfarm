"""Security headers and a small in-memory fixed-window rate limiter."""
from __future__ import annotations

import threading
import time
from typing import Callable, Dict, Tuple


class RateLimiter:
    """Fixed-window limiter keyed by client id. Use a shared store (e.g. Redis) if you run many instances."""

    def __init__(self, window_s: int, max_requests: int, clock: Callable[[], float] = time.time):
        self.window_s = window_s
        self.max = max_requests
        self._clock = clock
        self._buckets: Dict[str, Tuple[int, float]] = {}
        self._lock = threading.Lock()

    def hit(self, key: str) -> Tuple[bool, int, int]:
        """Returns (allowed, remaining, retry_after_seconds)."""
        now = self._clock()
        with self._lock:
            if len(self._buckets) > 10_000:  # bound memory
                self._buckets = {k: v for k, v in self._buckets.items() if v[1] > now}
            count, reset_at = self._buckets.get(key, (0, now + self.window_s))
            if reset_at <= now:
                count, reset_at = 0, now + self.window_s
            count += 1
            self._buckets[key] = (count, reset_at)
            remaining = max(0, self.max - count)
            if count > self.max:
                return False, 0, max(1, int(reset_at - now))
            return True, remaining, 0


def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(self), microphone=(self), geolocation=()"
    return response
