from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Any

from workers.python.intelligence.calendar_engine_balance import category_counts, topical_balance_summary
from workers.python.intelligence.calendar_engine_filters import enabled_market_configs, market_items, records_by_key
from workers.python.intelligence.calendar_engine_slots import (
    EDITORIAL_SLOT_REASON,
    MAX_EDITORIAL_SLOTS_PER_WEEK,
    editorial_slot_record,
    editorial_slots,
    sorted_keywords_by_priority,
)


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
    strategies_by_keyword = records_by_key(strategies, "keywordId")
    articles_by_strategy = records_by_key(articles, "strategyId")
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
