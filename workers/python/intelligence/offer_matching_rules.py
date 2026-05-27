from __future__ import annotations

from typing import Any

from workers.python.common import slugify

PLACEMENT_LIMITS = {
    "trend": 2,
    "buyer_guide": 4,
    "deal_watch": 6,
    "ingredient_guide": 3,
    "review": 4,
}

MERCHANT_TRUST = {
    "aliexpress": 72,
    "iherb": 82,
}

EVIDENCE_LEVEL_SCORE = {
    "verified_product": 90,
    "label_source": 78,
    "merchant_claim": 55,
}


def offer_from_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": clean(row.get("offer_id")) or f"offer-{slugify(clean(row.get('title')))}",
        "merchantSlug": clean(row.get("merchant_slug")),
        "title": clean(row.get("title")),
        "description": clean(row.get("description")),
        "url": clean(row.get("url")),
        "affiliateUrl": clean(row.get("affiliate_url")),
        "locale": clean(row.get("locale")) or None,
        "country": clean(row.get("country")) or None,
        "category": clean(row.get("category")) or "general",
        "evidenceLevel": clean(row.get("evidence_level")) or "merchant_claim",
        "healthSensitive": clean(row.get("health_sensitive")).lower() == "true",
        "lastCheckedAt": clean(row.get("last_checked_at")),
        "status": clean(row.get("status")) or "active",
        "price": numeric(row.get("price"), 0),
        "currency": clean(row.get("currency")) or None,
    }


def score_offer(topic: dict[str, Any], brief: dict[str, Any], offer: dict[str, Any]) -> dict[str, Any]:
    breakdown = {
        "topicalFit": topical_fit(topic, brief, offer),
        "localeFit": locale_fit(brief, offer),
        "merchantTrust": MERCHANT_TRUST.get(str(offer["merchantSlug"]), 50),
        "evidenceLevel": EVIDENCE_LEVEL_SCORE.get(str(offer["evidenceLevel"]), 45),
        "priceFreshness": price_freshness(offer),
        "conversionFit": conversion_fit(topic, brief, offer),
        "complianceFit": compliance_fit(topic, brief, offer),
    }
    score = round(
        breakdown["topicalFit"] * 0.25
        + breakdown["localeFit"] * 0.15
        + breakdown["merchantTrust"] * 0.15
        + breakdown["evidenceLevel"] * 0.15
        + breakdown["priceFreshness"] * 0.10
        + breakdown["conversionFit"] * 0.10
        + breakdown["complianceFit"] * 0.10,
        2,
    )
    return {
        "offer": offer,
        "offerScore": score,
        "scoreBreakdown": breakdown,
        "reason": match_reason(topic, brief, offer),
    }


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


def topical_fit(topic: dict[str, Any], brief: dict[str, Any], offer: dict[str, Any]) -> float:
    text = " ".join(
        [
            str(topic.get("canonicalTopic", "")),
            str(topic.get("intent", "")),
            str(brief.get("titleCandidate", "")),
            str(brief.get("searchIntent", "")),
        ]
    ).lower()
    offer_text = " ".join([str(offer.get("title", "")), str(offer.get("description", "")), str(offer.get("category", ""))]).lower()
    shared = set(words(text)) & set(words(offer_text))
    if shared:
        return min(100, 65 + len(shared) * 8)
    if str(offer.get("category")) in {"usb-c-chargers", "supplements"}:
        return 62
    return 35


def locale_fit(brief: dict[str, Any], offer: dict[str, Any]) -> float:
    if offer.get("locale") == brief.get("locale"):
        return 100
    if not offer.get("locale"):
        return 70
    return 45


def price_freshness(offer: dict[str, Any]) -> float:
    checked = str(offer.get("lastCheckedAt") or "")
    if checked.startswith("2026-05"):
        return 90
    return 45 if checked else 20


def conversion_fit(topic: dict[str, Any], brief: dict[str, Any], offer: dict[str, Any]) -> float:
    intent = str(topic.get("intent") or brief.get("searchIntent"))
    if intent in {"commercial", "comparison", "deal"}:
        return 85
    if intent == "health" and offer.get("merchantSlug") == "iherb":
        return 75
    return 55


def compliance_fit(topic: dict[str, Any], brief: dict[str, Any], offer: dict[str, Any]) -> float:
    if bool(topic.get("healthSensitive")) or brief.get("healthSensitivity") in {"medium", "high"}:
        return 90 if offer.get("merchantSlug") == "iherb" and offer.get("healthSensitive") else 0
    return 85 if not offer.get("healthSensitive") else 40


def placement_type_for(article_type: str, rank: int) -> str:
    if article_type == "deal_watch":
        return "comparison_table" if rank > 1 else "cta"
    if article_type == "ingredient_guide":
        return "ingredient_card"
    if article_type == "trend":
        return "inline" if rank > 1 else "card"
    return "cta" if rank == 1 else "card"


def synthetic_brief_for_topic(topic: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": f"brief-{topic['slug']}-{topic.get('primaryLocale', 'en')}",
        "topicId": topic["id"],
        "locale": topic.get("primaryLocale", "en"),
        "articleType": "ingredient_guide" if topic.get("healthSensitive") else "trend",
        "titleCandidate": topic.get("canonicalTopic", topic["slug"]),
        "searchIntent": topic.get("intent", "informational"),
        "healthSensitivity": "medium" if topic.get("healthSensitive") else "none",
        "merchantFitJson": {"requiresHealthClaimGuard": bool(topic.get("healthSensitive"))},
        "requiredEvidence": ["health disclaimer"] if topic.get("healthSensitive") else ["search intent source"],
    }


def category_allowed_for_aliexpress(category: str) -> bool:
    return any(
        token in category
        for token in ["gadget", "import", "charger", "cable", "power", "tool", "sensor", "desk", "usb-c"]
    )


def match_reason(topic: dict[str, Any], brief: dict[str, Any], offer: dict[str, Any]) -> str:
    if offer.get("merchantSlug") == "iherb":
        return "Health-sensitive topic matched to iHerb only because the brief requires HealthClaimGuard and disclaimer evidence."
    return "Commerce topic matched to AliExpress with evidence fit; placement remains draft until human approval."


def words(value: str) -> list[str]:
    return [word for word in value.lower().replace("-", " ").split() if len(word) > 3]


def numeric(value: Any, fallback: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback


def clean(value: Any) -> str:
    return str(value or "").strip()
