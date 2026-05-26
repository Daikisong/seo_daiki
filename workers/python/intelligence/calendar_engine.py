from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from workers.python.common import DATA, read_json, write_json

MARKETS_PATH = DATA / "config" / "markets.json"
TREND_CLUSTERS_PATH = DATA / "exports" / "trend_clusters.json"
TREND_KEYWORDS_PATH = DATA / "exports" / "trend_keywords.json"
CONTENT_STRATEGIES_PATH = DATA / "exports" / "content_strategies.json"
TEST_ARTICLES_PATH = DATA / "exports" / "test_articles.json"
CALENDAR_PATH = DATA / "exports" / "market_editorial_calendars.json"


def build_market_calendar(market: str | None = None) -> str:
    markets = read_json(MARKETS_PATH, [])
    clusters = read_json(TREND_CLUSTERS_PATH, {"clusters": []}).get("clusters", [])
    keywords = read_json(TREND_KEYWORDS_PATH, {"keywords": []}).get("keywords", [])
    strategies = read_json(CONTENT_STRATEGIES_PATH, {"strategies": []}).get("strategies", [])
    articles = read_json(TEST_ARTICLES_PATH, {"articles": []}).get("articles", [])

    calendars = []
    for market_config in markets:
        if not isinstance(market_config, dict) or not market_config.get("enabled"):
            continue
        if market and market_config.get("market") != market:
            continue
        calendars.append(calendar_for_market(market_config, clusters, keywords, strategies, articles))
    return str(write_json(CALENDAR_PATH, {"calendars": calendars}))


def build_all_market_calendars() -> str:
    return build_market_calendar(None)


def explain_market_calendar(market: str | None = None) -> str:
    payload = read_json(CALENDAR_PATH, {"calendars": []})
    calendars = [
        item for item in payload.get("calendars", []) if isinstance(item, dict) and (not market or item.get("market") == market)
    ]
    explanations = []
    for calendar in calendars:
        explanations.append(
            {
                "market": calendar.get("market"),
                "language": calendar.get("language"),
                "reason": "Queue is market-local. It ranks this market's own trend keywords and does not import unrelated trends from other countries.",
                "topicalBalance": calendar.get("summaryJson", {}).get("topicalBalance", {}),
            }
        )
    return str(write_json(DATA / "exports" / "market_calendar_report.json", {"calendars": calendars, "explanations": explanations}))


def export_market_calendars() -> str:
    return str(write_json(DATA / "exports" / "market_calendar_export.json", read_json(CALENDAR_PATH, {"calendars": []})))


def calendar_for_market(
    market_config: dict[str, Any],
    clusters: list[dict[str, Any]],
    keywords: list[dict[str, Any]],
    strategies: list[dict[str, Any]],
    articles: list[dict[str, Any]],
) -> dict[str, Any]:
    market = market_config["market"]
    language = market_config["language"]
    market_clusters = [item for item in clusters if isinstance(item, dict) and item.get("market") == market and item.get("language") == language]
    market_keywords = [item for item in keywords if isinstance(item, dict) and item.get("market") == market and item.get("language") == language]
    strategies_by_keyword = {item.get("keywordId"): item for item in strategies if isinstance(item, dict)}
    articles_by_strategy = {item.get("strategyId"): item for item in articles if isinstance(item, dict)}
    week_start = datetime.now(timezone.utc).date()
    slots = []
    for index, keyword in enumerate(sorted(market_keywords, key=lambda item: float(item.get("priorityScore") or 0), reverse=True)[:5]):
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
    categories = {}
    for cluster in market_clusters:
        categories[str(cluster.get("category"))] = categories.get(str(cluster.get("category")), 0) + 1
    return {
        "id": f"market-calendar-{market}-{language}-{week_start.isoformat()}",
        "market": market,
        "language": language,
        "weekStart": week_start.isoformat(),
        "status": "draft",
        "summaryJson": {
            "clusterCount": len(market_clusters),
            "keywordCount": len(market_keywords),
            "slotCount": len(slots),
            "topicalBalance": {
                "categories": categories,
                "maxUnrelatedTrendPostsPerWeek": 2,
                "maxHealthSensitivePostsPerWeek": 1,
                "maxDealPostsPerWeek": 0,
                "minimumEvergreenSupportingPostsPerTrendCluster": 1,
            },
        },
        "slots": slots,
    }
