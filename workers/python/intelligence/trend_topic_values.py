from __future__ import annotations

from typing import Any


def clean(value: Any) -> str:
    return str(value or "").strip()


def score(value: Any) -> float:
    try:
        return max(0.0, min(100.0, float(value)))
    except (TypeError, ValueError):
        return 0.0
