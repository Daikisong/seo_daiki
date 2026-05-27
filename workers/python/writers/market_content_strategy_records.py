from __future__ import annotations

from typing import Any

from workers.python.common import read_json, slugify, write_json
from workers.python.writers.content_strategy_rules import evidence_needed, section_plan, title_for
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
        status = "rejected" if opportunity and opportunity.get("shouldWrite") is False else "brief_pending"
        cluster = cluster_by_id.get(str(keyword.get("clusterId")), {})
        keyword_text = str(keyword.get("keyword") or "")
        rows = analyses_by_keyword.get(keyword_text, [])
        sections = section_plan(keyword_text, opportunity, rows)
        strategy_id = f"content-strategy-{slugify(str(keyword.get('id') or keyword_text))}"
        strategies.append(
            {
                "id": strategy_id,
                "keywordId": keyword.get("id"),
                "clusterId": keyword.get("clusterId"),
                "market": keyword.get("market"),
                "language": keyword.get("language"),
                "slug": slugify(keyword_text),
                "selectedArticleType": opportunity.get("recommendedArticleType") or "informational_test_post",
                "recommendedAngle": opportunity.get("recommendedAngle")
                or f"Create a market-specific no-link test post for {keyword_text}.",
                "titleStrategy": title_for(keyword_text, keyword.get("market"), opportunity),
                "introStrategy": (
                    "Open with the user's immediate question, explain what can be verified now, "
                    "and state that product links are deferred until review."
                ),
                "sectionPlanJson": sections,
                "differentiationPlanJson": [
                    "Use market-specific context instead of a generic global article.",
                    "Explain competitor gaps without copying headings or wording.",
                    "Include a verification checklist before any future monetization.",
                ],
                "evidenceNeededJson": evidence_needed(keyword_text, rows),
                "competitorPatternsJson": opportunity.get("topPatternsJson") or [],
                "contentGapJson": opportunity.get("contentGapJson") or {},
                "monetizationDeferred": True,
                "status": status,
                "createdAt": now(),
                "updatedAt": now(),
            }
        )
    return strategies
