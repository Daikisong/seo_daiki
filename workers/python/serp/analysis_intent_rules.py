from __future__ import annotations

from typing import Any


def infer_intent(title: str, snippet: str) -> str:
    text = f"{title} {snippet}".lower()
    if any(term in text for term in ["best", "vs", "compare"]):
        return "comparison"
    if any(term in text for term in ["price", "buy", "deal"]):
        return "commercial"
    return "informational"


def monetization_pattern(result: dict[str, Any]) -> str:
    if result.get("isEcommerce"):
        return "ecommerce_result"
    if result.get("isAffiliateLikely"):
        return "affiliate_editorial"
    return "editorial_or_publisher"
