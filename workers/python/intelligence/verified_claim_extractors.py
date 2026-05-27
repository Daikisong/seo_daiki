from __future__ import annotations

import re


def extract_watts(value: str) -> int | None:
    match = re.search(r"(\d{2,3})\s*w", value.lower())
    return int(match.group(1)) if match else None


def extract_mah(value: str) -> int | None:
    match = re.search(r"(\d{4,6})\s*mah", value.lower())
    return int(match.group(1)) if match else None


def extract_torque(value: str) -> float | None:
    match = re.search(r"(\d+(?:\.\d+)?)\s*nm", value.lower())
    return float(match.group(1)) if match else None
