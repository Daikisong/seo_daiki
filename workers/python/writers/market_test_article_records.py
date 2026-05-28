from __future__ import annotations

from collections.abc import Callable
from typing import Any

from workers.python.common import slugify
from workers.python.writers.content_strategy_rules import article_sections, markdown_article


def strategy_matches_filter(strategy: dict[str, Any], strategy_id: str | None = None) -> bool:
    return not strategy_id or strategy.get("id") == strategy_id


def test_article_record(strategy: dict[str, Any], now_factory: Callable[[], str]) -> dict[str, Any]:
    slug = str(strategy.get("slug") or slugify(str(strategy.get("titleStrategy"))))
    article_id = f"test-article-{slugify(str(strategy.get('id')))}"
    sections = article_sections(strategy)
    title = str(strategy.get("titleStrategy") or "Market test post")
    timestamp = now_factory()
    return {
        "id": article_id,
        "strategyId": strategy.get("id"),
        "articleId": article_id,
        "market": strategy.get("market"),
        "language": strategy.get("language"),
        "slug": slug,
        "title": title,
        "h1": title,
        "metaDescription": f"Market-specific test post for {title}. No affiliate links are inserted.",
        "summary": str(strategy.get("recommendedAngle") or ""),
        "contentMdx": markdown_article(title, sections),
        "sections": sections,
        "affiliateLinks": [],
        "monetizationDeferred": True,
        "productCandidateState": "pending",
        "noindexReason": "Initial test article; index candidate requires human/editorial approval.",
        "status": "test_pending",
        "indexStatus": "noindex",
        "publishStatus": "pending",
        "createdAt": timestamp,
        "updatedAt": timestamp,
    }


def test_article_records_for_strategies(
    strategies: list[Any],
    strategy_id: str | None,
    now_factory: Callable[[], str],
) -> list[dict[str, Any]]:
    return [
        test_article_record(strategy, now_factory)
        for strategy in strategies
        if isinstance(strategy, dict) and strategy_matches_filter(strategy, strategy_id)
    ]
