from __future__ import annotations

from typing import Any

def topic_key(strategy: dict[str, Any]) -> str:
    text = " ".join(
        [
            str(strategy.get("slug") or ""),
            str(strategy.get("titleStrategy") or ""),
            str(strategy.get("recommendedAngle") or ""),
        ]
    ).lower()
    if "samsung-s90f" in text or "samsung s90f" in text:
        return "samsung_s90f"
    if "renta-2025" in text or "renta 2025" in text:
        return "renta_2025"
    if "iphone-16" in text or "iphone 16" in text:
        return "iphone_16_br"
    if "iphone-18" in text or "iphone 18" in text:
        return "iphone_18_jp"
    if "runway" in text or "aleph" in text:
        return "runway_aleph_jp"
    if ("kbo" in text and ("올스타" in text or "all-star" in text)) or "올스타-팬투표" in text:
        return "kr_kbo_all_star_vote"
    if "gaming-monitor" in text or "gaming monitor" in text or "게이밍" in text or "모니터" in text:
        return "kr_gaming_monitor"
    return "generic"
