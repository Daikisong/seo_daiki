from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any

from workers.python.common import DATA, read_json, slugify, write_json
from workers.python.serp.analysis_rules import (
    content_gap,
    recommended_angle,
    recommended_article_type,
    top_patterns,
)
from workers.python.serp.serp_artifacts import SERP_ANALYSIS_PATH, SERP_OPPORTUNITY_PATH, TREND_KEYWORDS_PATH


def summarize_serp_opportunity(keyword_id: str | None = None) -> str:
    keywords = read_json(TREND_KEYWORDS_PATH, {"keywords": []}).get("keywords", [])
    analyses = read_json(SERP_ANALYSIS_PATH, {"analyses": []}).get("analyses", [])
    by_keyword: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for analysis in analyses:
        if isinstance(analysis, dict):
            by_keyword[str(analysis.get("keyword"))].append(analysis)
    opportunities = []
    for keyword in keywords:
        if not isinstance(keyword, dict) or (keyword_id and keyword.get("id") != keyword_id):
            continue
        rows = by_keyword.get(str(keyword.get("keyword")), [])
        if not rows:
            continue
        opportunity = serp_opportunity_record(keyword, rows)
        opportunities.append(opportunity)
    opportunities.sort(key=lambda item: item["opportunityScore"], reverse=True)
    return str(write_json(SERP_OPPORTUNITY_PATH, {"opportunities": opportunities}))


def serp_opportunity_record(keyword: dict[str, Any], rows: list[dict[str, Any]]) -> dict[str, Any]:
    intents = Counter(str(row.get("intentServed")) for row in rows)
    content_types = Counter(str(row.get("contentTypeGuess")) for row in rows)
    weakness_count = sum(len(row.get("weaknessesJson", [])) for row in rows)
    original_data_count = sum(1 for row in rows if row.get("originalDataPresent"))
    serp_gap_score = min(100, 45 + weakness_count * 5 + (20 if original_data_count == 0 else 0))
    weak_competitor_score = min(100, 40 + len([row for row in rows if not row.get("originalDataPresent")]) * 10)
    content_depth = min(100, 50 + len({heading for row in rows for heading in row.get("headingsJson", [])}) * 4)
    freshness_gap = 70 if any(not row.get("freshnessSignalsJson") for row in rows) else 45
    trend_score = float(keyword.get("priorityScore") or 0)
    score_value = round(
        trend_score * 0.20
        + serp_gap_score * 0.25
        + weak_competitor_score * 0.15
        + content_depth * 0.15
        + 80 * 0.10
        + 50 * 0.05
        + freshness_gap * 0.10,
        2,
    )
    return {
        "id": f"serp-opportunity-{slugify(str(keyword.get('id')))}",
        "keywordId": keyword.get("id"),
        "market": keyword.get("market"),
        "language": keyword.get("language"),
        "keyword": keyword.get("keyword"),
        "opportunityScore": score_value,
        "dominantIntent": intents.most_common(1)[0][0],
        "dominantContentTypesJson": [item for item, _ in content_types.most_common(3)],
        "topPatternsJson": top_patterns(rows),
        "contentGapJson": content_gap(rows),
        "recommendedAngle": recommended_angle(keyword, rows),
        "recommendedArticleType": recommended_article_type(intents, content_types),
        "shouldWrite": score_value >= 55,
        "reason": "Trend signal plus manual SERP gaps show a test post opportunity.",
    }


def serp_report(market: str | None = None) -> str:
    payload = read_json(SERP_OPPORTUNITY_PATH, {"opportunities": []})
    opportunities = [
        item for item in payload.get("opportunities", []) if isinstance(item, dict) and (not market or item.get("market") == market)
    ]
    path = DATA / "exports" / (f"serp_report_{market}.json" if market else "serp_opportunity_report.json")
    return str(write_json(path, {"opportunities": opportunities}))
