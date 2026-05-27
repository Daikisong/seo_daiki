from __future__ import annotations

import re
from typing import Any


def tokenize(value: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", value.lower().replace("usb c", "usb-c"))


def is_spec_token(token: str) -> bool:
    return bool(re.fullmatch(r"\d+(w|mah|wh|nm|m|a)?", token)) or token in {"pd", "pps", "zigbee", "gan"}


def is_model_token(token: str) -> bool:
    return bool(re.search(r"[a-z]", token) and re.search(r"\d", token))


def jaccard(left: set[str], right: set[str]) -> float:
    if not left and not right:
        return 0.0
    return len(left & right) / len(left | right)


def set_value(value: Any) -> set[str]:
    return {str(item) for item in value} if isinstance(value, list) else set()


def list_value(value: Any) -> list[str]:
    return [str(item) for item in value] if isinstance(value, list) else []


def string_value(value: Any) -> str:
    return str(value).strip() if value is not None else ""


def number_value(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0
