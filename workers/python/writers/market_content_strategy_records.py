from __future__ import annotations

from typing import Any

from workers.python.common import read_json, slugify, write_json
from workers.python.intelligence.product_candidate_paths import TREND_MONETIZATION_ROUTES_PATH
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
    routes = read_json(TREND_MONETIZATION_ROUTES_PATH, {"routes": []}).get("routes", [])
    strategies = content_strategy_records(keywords, clusters, opportunities, analyses, keyword_id)
    strategies = attach_monetization_routes(strategies, routes)
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


def attach_monetization_routes(strategies: list[dict[str, Any]], routes: list[Any]) -> list[dict[str, Any]]:
    route_by_keyword_id = {
        str(route.get("keywordId")): route
        for route in routes
        if isinstance(route, dict) and route.get("keywordId")
    }
    for strategy in strategies:
        route = route_by_keyword_id.get(str(strategy.get("keywordId")))
        if not route:
            continue
        strategy["monetizationRoute"] = route.get("route")
        strategy["contentBranch"] = content_branch_for_route(route)
        strategy["commerceFitScore"] = route.get("commerceFitScore")
        strategy["informationalFitScore"] = route.get("informationalFitScore")
        strategy["localizationPolicyJson"] = route.get("localizationPolicy")
        strategy["marketExpansionPolicy"] = (route.get("localizationPolicy") or {}).get("strategy")
        strategy["productCandidateNeedsJson"] = product_candidate_needs_for_route(route)
    return strategies


def content_branch_for_route(route: dict[str, Any]) -> str:
    return "review" if route.get("route") == "review_comparison" else "news"


def product_candidate_needs_for_route(route: dict[str, Any]) -> list[str]:
    if route.get("route") == "review_comparison":
        needs = [
            "Product candidate analysis is allowed after the test article exists.",
            "Future candidates must be verified before any monetized placement.",
        ]
        if route.get("requiredGuards"):
            needs.append("Health or claims guard must be completed before review.")
        return needs
    return [
        "Product candidate analysis is skipped for this informational explainer.",
        "Use sources, dates, checklists, and official context instead of merchant links.",
    ]
