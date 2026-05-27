from __future__ import annotations

from typing import Any

from workers.python.intelligence.offer_matching_fit import category_allowed_for_aliexpress


def offer_is_eligible(topic: dict[str, Any], brief: dict[str, Any], offer: dict[str, Any]) -> bool:
    if offer.get("status") != "active":
        return False

    health_sensitive = bool(topic.get("healthSensitive")) or brief.get("healthSensitivity") in {"medium", "high"}
    merchant = str(offer.get("merchantSlug"))

    if health_sensitive:
        if merchant != "iherb":
            return False
        merchant_fit = brief.get("merchantFitJson", {})
        if not isinstance(merchant_fit, dict) or not merchant_fit.get("requiresHealthClaimGuard"):
            return False
        required = " ".join(str(item).lower() for item in brief.get("requiredEvidence", []))
        if "health disclaimer" not in required:
            return False
    elif merchant == "iherb":
        return False

    if merchant == "aliexpress" and not category_allowed_for_aliexpress(str(offer.get("category"))):
        return False

    return True


def placement_type_for(article_type: str, rank: int) -> str:
    if article_type == "deal_watch":
        return "comparison_table" if rank > 1 else "cta"
    if article_type == "ingredient_guide":
        return "ingredient_card"
    if article_type == "trend":
        return "inline" if rank > 1 else "card"
    return "cta" if rank == 1 else "card"


def match_reason(topic: dict[str, Any], brief: dict[str, Any], offer: dict[str, Any]) -> str:
    if offer.get("merchantSlug") == "iherb":
        return "Health-sensitive topic matched to iHerb only because the brief requires HealthClaimGuard and disclaimer evidence."
    return "Commerce topic matched to AliExpress with evidence fit; placement remains draft until human approval."
