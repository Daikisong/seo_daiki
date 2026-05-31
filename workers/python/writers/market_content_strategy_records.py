from __future__ import annotations

from typing import Any

from workers.python.common import read_json, slugify, write_json
from workers.python.writers.dry_run_strategy_refiner import dry_run_strategy_refiner
from workers.python.writers.market_content_artifacts import (
    CONTENT_STRATEGIES_PATH,
    SERP_ANALYSIS_PATH,
    SERP_OPPORTUNITY_PATH,
    TREND_CLUSTERS_PATH,
    TREND_KEYWORDS_PATH,
    now,
)


def create_content_strategy(keyword_id: str | None = None) -> str:
    keywords = read_json(TREND_KEYWORDS_PATH, {"keywords": []}).get("keywords", [])
    clusters = read_json(TREND_CLUSTERS_PATH, {"clusters": []}).get("clusters", [])
    opportunities = read_json(SERP_OPPORTUNITY_PATH, {"opportunities": []}).get("opportunities", [])
    analyses = read_json(SERP_ANALYSIS_PATH, {"analyses": []}).get("analyses", [])
    strategies = content_strategy_records(keywords, clusters, opportunities, analyses, keyword_id)
    return str(write_json(CONTENT_STRATEGIES_PATH, {"strategies": strategies}))


def content_strategy_records(
    keywords: list[dict[str, Any]],
    clusters: list[dict[str, Any]],
    opportunities: list[dict[str, Any]],
    analyses: list[dict[str, Any]],
    keyword_id: str | None = None,
) -> list[dict[str, Any]]:
    cluster_by_id = {str(item.get("id")): item for item in clusters if isinstance(item, dict)}
    opportunity_by_keyword_id = {str(item.get("keywordId")): item for item in opportunities if isinstance(item, dict)}
    analyses_by_keyword: dict[str, list[dict[str, Any]]] = {}
    for analysis in analyses:
        if isinstance(analysis, dict):
            analyses_by_keyword.setdefault(str(analysis.get("keyword")), []).append(analysis)

    strategies = []
    for keyword in keywords:
        if not isinstance(keyword, dict) or (keyword_id and keyword.get("id") != keyword_id):
            continue
        opportunity = opportunity_by_keyword_id.get(str(keyword.get("id")), {})
        if not opportunity or opportunity.get("shouldWrite") is False:
            continue
        status = "rejected" if opportunity and opportunity.get("shouldWrite") is False else "brief_pending"
        cluster = cluster_by_id.get(str(keyword.get("clusterId")), {})
        keyword_text = str(keyword.get("keyword") or "")
        rows = analyses_by_keyword.get(keyword_text, [])
        refined = dry_run_strategy_refiner(keyword, cluster, opportunity, rows)
        strategy_id = f"content-strategy-{slugify(str(keyword.get('id') or keyword_text))}"
        strategies.append(
            {
                "id": strategy_id,
                "keywordId": keyword.get("id"),
                "clusterId": keyword.get("clusterId"),
                "market": keyword.get("market"),
                "language": keyword.get("language"),
                "slug": slugify(keyword_text),
                **refined,
                "status": status,
                "createdAt": now(),
                "updatedAt": now(),
            }
        )
    return strategies
