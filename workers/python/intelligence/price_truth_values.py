from __future__ import annotations

from typing import Any


def number_value(value: Any) -> float:
    try:
        return round(float(value), 2)
    except (TypeError, ValueError):
        return 0.0


def string_value(value: Any) -> str:
    return str(value).strip() if value is not None else ""
