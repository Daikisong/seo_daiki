from __future__ import annotations

from datetime import date, timedelta
from typing import Any

MAX_EDITORIAL_SLOTS_PER_WEEK = 5
EDITORIAL_SLOT_REASON = "Selected from this market's trend and SERP opportunity queue."


def sorted_keywords_by_priority(keywords: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(keywords, key=lambda item: float(item.get("priorityScore") or 0), reverse=True)


def editorial_slot_record(
    market: str,
    language: str,
    keyword: dict[str, Any],
    strategy: dict[str, Any],
    article: dict[str, Any],
    week_start: date,
    index: int,
) -> dict[str, Any]:
    return {
        "id": f"editorial-slot-{market}-{language}-{index + 1}",
        "date": (week_start + timedelta(days=index)).isoformat(),
        "priority": index + 1,
        "clusterId": keyword.get("clusterId"),
        "keywordId": keyword.get("id"),
        "strategyId": strategy.get("id"),
        "articleId": article.get("id"),
        "status": "candidate",
        "reason": EDITORIAL_SLOT_REASON,
    }


def editorial_slots(
    market: str,
    language: str,
    keywords: list[dict[str, Any]],
    strategies_by_keyword: dict[object, dict[str, Any]],
    articles_by_strategy: dict[object, dict[str, Any]],
    week_start: date,
) -> list[dict[str, Any]]:
    slots = []
    for index, keyword in enumerate(sorted_keywords_by_priority(keywords)[:MAX_EDITORIAL_SLOTS_PER_WEEK]):
        strategy = strategies_by_keyword.get(keyword.get("id"), {})
        article = articles_by_strategy.get(strategy.get("id"), {})
        slots.append(editorial_slot_record(market, language, keyword, strategy, article, week_start, index))
    return slots
