from __future__ import annotations

from collections.abc import Callable
from typing import Any

from workers.python.common import slugify

REQUIRED_LOCAL_SIGNALS = [
    "localized title/h1/meta",
    "local search intent",
    "local risk or market notes",
    "local offer availability or explicit no-offer note",
    "non-boilerplate localized examples",
]


def create_group_record(
    article_id: str,
    topic_id: str | None = None,
    source_locale: str = "en",
    now_factory: Callable[[], str] | None = None,
) -> dict[str, Any]:
    current_time = now_factory() if now_factory else ""
    return {
        "id": f"tg-{slugify(article_id)}",
        "canonicalTopicId": topic_id,
        "sourceArticleId": article_id,
        "createdAt": current_time,
        "updatedAt": current_time,
        "variants": [source_variant(article_id, source_locale)],
    }


def source_variant(article_id: str, source_locale: str = "en") -> dict[str, Any]:
    return {
        "id": f"tv-{slugify(article_id)}-{source_locale}",
        "articleId": article_id,
        "locale": source_locale,
        "sourceLocale": None,
        "localizationDepthScore": 100,
        "status": "published",
        "indexStatus": "index",
    }


def localized_variant(article_id: str, locale: str, source_locale: str = "en") -> dict[str, Any]:
    localized_article_id = f"{article_id}-{locale}"
    return {
        "id": f"tv-{slugify(localized_article_id)}",
        "articleId": localized_article_id,
        "locale": locale,
        "sourceLocale": source_locale,
        "localizationDepthScore": 0,
        "status": "draft",
        "indexStatus": "noindex",
        "translationOnly": True,
        "requiredLocalSignals": REQUIRED_LOCAL_SIGNALS,
    }


def replace_group(groups: list[dict[str, Any]], group: dict[str, Any]) -> list[dict[str, Any]]:
    return [existing for existing in groups if existing["id"] != group["id"]] + [group]


def upsert_localized_variant(
    group: dict[str, Any],
    article_id: str,
    locale: str,
    source_locale: str,
    now_factory: Callable[[], str],
) -> dict[str, Any]:
    localized_article_id = f"{article_id}-{locale}"
    group["variants"] = [
        variant
        for variant in group["variants"]
        if not (variant["articleId"] == localized_article_id or variant["locale"] == locale)
    ]
    group["variants"].append(localized_variant(article_id, locale, source_locale))
    group["updatedAt"] = now_factory()
    return group
