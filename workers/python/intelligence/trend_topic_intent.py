from __future__ import annotations

HEALTH_TOKENS = ("iherb", "supplement", "vitamin", "probiotic", "magnesium", "sleep", "gut health")


def looks_health_related(text: str) -> bool:
    return any(token in text.lower() for token in HEALTH_TOKENS)


def infer_intent(text: str) -> str:
    normalized = text.lower()
    if looks_health_related(normalized):
        return "health"
    if any(token in normalized for token in [" vs ", "compare", "comparison", "alternative"]):
        return "comparison"
    if any(token in normalized for token in ["deal", "coupon", "discount", "price drop"]):
        return "deal"
    if any(token in normalized for token in ["fake", "risk", "avoid", "safe", "problem"]):
        return "problem"
    if any(token in normalized for token in ["best", "buy", "review"]):
        return "commercial"
    return "informational"


def article_type_for_intent(intent: str) -> str:
    return {
        "comparison": "compare",
        "deal": "deal_watch",
        "health": "ingredient_guide",
        "problem": "guide",
        "commercial": "buyer_guide",
    }.get(intent, "trend")
