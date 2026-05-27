from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from typing import Any


def enabled_market_configs(markets: list[dict[str, Any]], market: str | None = None) -> list[dict[str, Any]]:
    return [
        market_config
        for market_config in markets
        if market_config.get("enabled") and (not market or market_config.get("market") == market)
    ]


def calendar_for_market(
    market_config: dict[str, Any],
    clusters: list[dict[str, Any]],
    keywords: list[dict[str, Any]],
    strategies: list[dict[str, Any]],
    articles: list[dict[str, Any]],
    week_start: date | None = None,
) -> dict[str, Any]:
    market = market_config["market"]
    language = market_config["language"]
    market_clusters = market_items(clusters, market, language)
    market_keywords = market_items(keywords, market, language)
    strategies_by_keyword = {item.get("keywordId"): item for item in strategies}
    articles_by_strategy = {item.get("strategyId"): item for item in articles}
    start = week_start or datetime.now(timezone.utc).date()
    slots = editorial_slots(market, language, market_keywords, strategies_by_keyword, articles_by_strategy, start)

    return {
        "id": f"market-calendar-{market}-{language}-{start.isoformat()}",
        "market": market,
        "language": language,
        "weekStart": start.isoformat(),
        "status": "draft",
        "summaryJson": {
            "clusterCount": len(market_clusters),
            "keywordCount": len(market_keywords),
            "slotCount": len(slots),
            "topicalBalance": topical_balance_summary(market_clusters),
        },
        "slots": slots,
    }


def market_items(items: list[dict[str, Any]], market: str, language: str) -> list[dict[str, Any]]:
    return [item for item in items if item.get("market") == market and item.get("language") == language]


def editorial_slots(
    market: str,
    language: str,
    keywords: list[dict[str, Any]],
    strategies_by_keyword: dict[object, dict[str, Any]],
    articles_by_strategy: dict[object, dict[str, Any]],
    week_start: date,
) -> list[dict[str, Any]]:
    slots = []
    for index, keyword in enumerate(sorted(keywords, key=lambda item: float(item.get("priorityScore") or 0), reverse=True)[:5]):
        strategy = strategies_by_keyword.get(keyword.get("id"), {})
        article = articles_by_strategy.get(strategy.get("id"), {})
        slots.append(
            {
                "id": f"editorial-slot-{market}-{language}-{index + 1}",
                "date": (week_start + timedelta(days=index)).isoformat(),
                "priority": index + 1,
                "clusterId": keyword.get("clusterId"),
                "keywordId": keyword.get("id"),
                "strategyId": strategy.get("id"),
                "articleId": article.get("id"),
                "status": "candidate",
                "reason": "Selected from this market's trend and SERP opportunity queue.",
            }
        )
    return slots


def topical_balance_summary(clusters: list[dict[str, Any]]) -> dict[str, Any]:
    categories: dict[str, int] = {}
    for cluster in clusters:
        categories[str(cluster.get("category"))] = categories.get(str(cluster.get("category")), 0) + 1
    return {
        "categories": categories,
        "maxUnrelatedTrendPostsPerWeek": 2,
        "maxHealthSensitivePostsPerWeek": 1,
        "maxDealPostsPerWeek": 0,
        "minimumEvergreenSupportingPostsPerTrendCluster": 1,
    }
