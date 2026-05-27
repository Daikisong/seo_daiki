from __future__ import annotations

from typing import Any

from workers.python.common import slugify
from workers.python.intelligence.offer_matching_values import clean, numeric


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
