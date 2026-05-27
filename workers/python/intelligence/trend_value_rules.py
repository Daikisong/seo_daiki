from __future__ import annotations

from statistics import mean
from typing import Any


def avg(rows: list[dict[str, Any]], key: str) -> float:
    values = [float(row.get(key) or 0) for row in rows]
    return round(mean(values), 2) if values else 0


def score(value: Any) -> float:
    try:
        return max(0, min(100, float(value or 0)))
    except (TypeError, ValueError):
        return 0


def integer(value: Any, fallback: int) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return fallback


def bucket(value: float) -> str:
    if value >= 80:
        return "high"
    if value >= 50:
        return "medium"
    if value > 0:
        return "low"
    return "unknown"
