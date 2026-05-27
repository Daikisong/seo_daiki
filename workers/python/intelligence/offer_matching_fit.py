from __future__ import annotations

from typing import Any

from workers.python.intelligence.offer_matching_values import words


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


def category_allowed_for_aliexpress(category: str) -> bool:
    return any(
        token in category
        for token in ["gadget", "import", "charger", "cable", "power", "tool", "sensor", "desk", "usb-c"]
    )
