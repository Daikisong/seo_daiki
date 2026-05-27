from __future__ import annotations


def infer_category(value: str) -> str:
    text = value.lower()
    if any(term in text for term in ["magnesium", "gut", "probiotic", "sleep", "wellness"]):
        return "wellness"
    if any(term in text for term in ["beauty", "ingredient", "skin"]):
        return "beauty"
    if any(term in text for term in ["charger", "power bank", "adapter", "gadget", "smartwatch"]):
        return "consumer-tech"
    return "general"


def infer_intent(keyword: str, category: str) -> str:
    text = f"{keyword} {category}".lower()
    if any(term in text for term in ["best", "vs", "compare", "alternative"]):
        return "comparison"
    if any(term in text for term in ["price", "budget", "deal"]):
        return "commercial"
    if any(term in text for term in ["magnesium", "gut", "health", "sleep"]):
        return "informational_health"
    return "informational"
