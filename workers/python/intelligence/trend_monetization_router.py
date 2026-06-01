from __future__ import annotations

from typing import Any

from workers.python.common import read_json, slugify, write_json
from workers.python.intelligence.trend_monetization_constants import (
    INFORMATIONAL_EXPLAINER,
    REVIEW_COMPARISON,
    SOURCE_MARKET_ONLY,
    TRANSLATE_ALL_PRODUCT_MARKETS,
)
from workers.python.intelligence.trend_monetization_matching import (
    find_matching_article,
    find_matching_opportunity,
    find_matching_strategy,
    find_matching_strategy_for_opportunity,
)
from workers.python.intelligence.trend_monetization_policy import (
    allowed_next_steps,
    blocked_next_steps,
    localization_policy,
    route_reason,
    route_summary,
)
from workers.python.intelligence.trend_monetization_signals import commerce_score, informational_score, route_signals
from workers.python.intelligence.product_candidate_paths import (
    TEST_ARTICLES_PATH,
    TREND_MONETIZATION_ROUTES_PATH,
    now,
)
from workers.python.writers.market_content_artifacts import CONTENT_STRATEGIES_PATH, SERP_OPPORTUNITY_PATH


def route_trend_monetization(article_id: str | None = None) -> str:
    articles = read_json(TEST_ARTICLES_PATH, {"articles": []}).get("articles", [])
    opportunities = read_json(SERP_OPPORTUNITY_PATH, {"opportunities": []}).get("opportunities", [])
    strategies = read_json(CONTENT_STRATEGIES_PATH, {"strategies": []}).get("strategies", [])
    routes = route_records(articles, opportunities, strategies, article_id)
    summary = route_summary(routes)
    return str(
        write_json(
            TREND_MONETIZATION_ROUTES_PATH,
            {
                "routes": routes,
                "summary": summary,
                "policy": {
                    "routes": [INFORMATIONAL_EXPLAINER, REVIEW_COMPARISON],
                    "productCandidateDiscoveryAllowed": [REVIEW_COMPARISON],
                    "localization": {
                        INFORMATIONAL_EXPLAINER: SOURCE_MARKET_ONLY,
                        REVIEW_COMPARISON: TRANSLATE_ALL_PRODUCT_MARKETS,
                        "translationOnlyIndexable": False,
                    },
                    "healthTopicsRequireGuard": True,
                },
                "generatedAt": now(),
            },
        )
    )


def route_records(
    articles: list[Any],
    opportunities: list[Any],
    strategies: list[Any] | None = None,
    article_id: str | None = None,
) -> list[dict[str, Any]]:
    opportunity_rows = [item for item in opportunities if isinstance(item, dict)]
    strategy_rows = [item for item in (strategies or []) if isinstance(item, dict)]
    all_article_rows = [item for item in articles if isinstance(item, dict)]
    article_rows = [
        item for item in all_article_rows if not article_id or item.get("id") == article_id or item.get("articleId") == article_id
    ]

    if article_id and article_rows:
        return [
            route_article_record(article, find_matching_opportunity(article, opportunity_rows), find_matching_strategy(article, strategy_rows))
            for article in article_rows
        ]

    if opportunity_rows:
        return [
            route_article_record(
                find_matching_article(opportunity, all_article_rows) or {},
                opportunity,
                find_matching_strategy_for_opportunity(opportunity, strategy_rows),
            )
            if find_matching_article(opportunity, all_article_rows)
            else route_opportunity_record(opportunity)
            for opportunity in opportunity_rows
        ]

    return [
        route_article_record(article, find_matching_opportunity(article, opportunity_rows), find_matching_strategy(article, strategy_rows))
        for article in article_rows
    ]


def route_article_record(
    article: dict[str, Any],
    opportunity: dict[str, Any] | None = None,
    strategy: dict[str, Any] | None = None,
) -> dict[str, Any]:
    base = {
        "id": f"trend-route-{slugify(str(article.get('id') or article.get('slug') or article.get('title')))}",
        "articleId": article.get("id") or article.get("articleId"),
        "strategyId": article.get("strategyId"),
        "keywordId": (opportunity or {}).get("keywordId") or (strategy or {}).get("keywordId"),
        "market": article.get("market"),
        "language": article.get("language"),
        "slug": article.get("slug"),
        "keyword": (opportunity or {}).get("keyword") or article.get("keyword"),
        "title": article.get("title"),
        "summary": article.get("summary"),
    }
    return {**base, **route_decision(article, opportunity, strategy)}


def route_opportunity_record(opportunity: dict[str, Any]) -> dict[str, Any]:
    base = {
        "id": f"trend-route-{slugify(str(opportunity.get('id') or opportunity.get('keyword')))}",
        "articleId": None,
        "strategyId": None,
        "keywordId": opportunity.get("keywordId"),
        "market": opportunity.get("market"),
        "language": opportunity.get("language"),
        "slug": slugify(str(opportunity.get("keyword") or "")),
        "keyword": opportunity.get("keyword"),
        "title": None,
        "summary": None,
    }
    return {**base, **route_decision({}, opportunity, None)}


def route_decision(
    article: dict[str, Any],
    opportunity: dict[str, Any] | None = None,
    strategy: dict[str, Any] | None = None,
) -> dict[str, Any]:
    signals = route_signals(article, opportunity, strategy)
    commerce_fit_score = commerce_score(signals)
    informational_fit_score = informational_score(signals)
    route = REVIEW_COMPARISON if commerce_fit_score >= 35 and commerce_fit_score >= informational_fit_score + 10 else INFORMATIONAL_EXPLAINER
    required_guards = ["health_claim_guard"] if route == REVIEW_COMPARISON and signals["healthTerms"] else []
    localization = localization_policy(route)
    return {
        "route": route,
        "commerceFitScore": commerce_fit_score,
        "informationalFitScore": informational_fit_score,
        "routeReason": route_reason(route, signals),
        "localizationPolicy": localization,
        "allowedNextSteps": allowed_next_steps(route),
        "blockedNextSteps": blocked_next_steps(route),
        "requiredGuards": required_guards,
        "signals": signals,
        "createdAt": now(),
    }
