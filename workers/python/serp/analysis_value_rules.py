from __future__ import annotations

from typing import Any
from urllib.parse import urlparse


def domain_for(value: str) -> str:
    try:
        return urlparse(value).hostname or ""
    except Exception:
        return ""


def split_list(value: Any) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in str(value).replace("|", ";").split(";") if part.strip()]


def clean(value: Any) -> str:
    return str(value or "").strip()


def integer(value: Any, fallback: int) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return fallback


def truthy(value: Any) -> bool:
    return str(value or "").strip().lower() in {"1", "true", "yes", "y"}
