from __future__ import annotations

from typing import Any


def dict_value(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def dict_list(value: Any) -> list[dict[str, Any]]:
    return [item for item in list_value(value) if isinstance(item, dict)]


def list_value(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []


def string_value(value: Any) -> str:
    return str(value).strip() if value is not None else ""
