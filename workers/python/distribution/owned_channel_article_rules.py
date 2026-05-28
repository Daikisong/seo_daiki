from __future__ import annotations

from typing import Any

PREFERRED_DISTRIBUTION_TYPES = {"data", "lab", "methodology", "guide", "compare", "hub"}
AFFILIATE_HEAVY_TYPES = {"review", "deal_watch", "buyer_guide"}


def normalize_article(article: dict[str, Any]) -> dict[str, Any]:
    article_type = article.get("type", "guide")
    return {
        "id": article.get("id"),
        "locale": article.get("locale", "en"),
        "type": article_type,
        "slug": article.get("slug", article.get("id", "")),
        "title": article.get("title", article.get("id", "")),
        "summary": article.get("summary", ""),
        "path": f"/{article.get('locale', 'en')}/{article.get('slug', article.get('id', 'draft'))}/",
        "hasAffiliate": bool(article.get("affiliatePlacementCandidates")) or article_type in AFFILIATE_HEAVY_TYPES,
    }


def dedupe_articles(articles: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_id = {}
    for article in sorted(articles, key=distribution_priority):
        key = str(article.get("path") or article.get("id"))
        if key and key not in by_id:
            by_id[key] = article
    return list(by_id.values())


def distribution_priority(article: dict[str, Any]) -> tuple[int, str]:
    article_type = str(article.get("type", ""))
    if article_type in {"data", "lab", "methodology"}:
        group = 0
    elif article_type in {"guide", "compare", "hub"}:
        group = 1
    elif article.get("hasAffiliate"):
        group = 3
    else:
        group = 2
    return (group, str(article.get("id") or article.get("path")))
