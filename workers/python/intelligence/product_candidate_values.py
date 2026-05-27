from __future__ import annotations

from typing import Any

from workers.python.common import slugify


def tokens(value: str) -> list[str]:
    return [token for token in slugify(value).split("-") if len(token) > 3]


def score(value: Any, fallback: float) -> float:
    try:
        return max(0, min(100, float(value)))
    except (TypeError, ValueError):
        return fallback


def clean(value: Any) -> str:
    return str(value or "").strip()
