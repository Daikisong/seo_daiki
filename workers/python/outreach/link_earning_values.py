from __future__ import annotations

from typing import Any


def words(value: str) -> list[str]:
    return [part for part in value.lower().replace("-", " ").split() if len(part) > 3]


def numeric(value: Any, fallback: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback


def clean(value: Any) -> str:
    return str(value or "").strip()
