from __future__ import annotations

from typing import Any


def affiliate_match_score(topic: dict[str, Any], merchant: str) -> float:
    base = float(topic.get("score", 0))
    if merchant == "iherb" and topic.get("healthSensitive"):
        return round(min(100, base + 10), 2)
    if merchant == "aliexpress" and topic["intent"] in {"commercial", "comparison", "deal", "problem"}:
        return round(min(100, base + 8), 2)
    return round(base * 0.8, 2)


def match_reason(topic: dict[str, Any], merchant: str) -> str:
    if merchant == "iherb":
        return "Health-sensitive topic; route through iHerb offers only after HealthClaimGuard and manual approval."
    return "Commerce-oriented topic with marketplace offer fit; avoid thin affiliate content by requiring evidence."
