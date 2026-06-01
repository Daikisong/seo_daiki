from __future__ import annotations

from workers.python.common import read_json, write_json
from workers.python.intelligence.product_candidate_paths import (
    PRODUCT_CANDIDATES_PATH,
    TEST_ARTICLES_PATH,
    TREND_MONETIZATION_ROUTES_PATH,
)
from workers.python.intelligence.product_candidate_rules import tokens
from workers.python.intelligence.trend_monetization_router import REVIEW_COMPARISON


def discover_product_candidates(article_id: str | None = None) -> str:
    articles = read_json(TEST_ARTICLES_PATH, {"articles": []}).get("articles", [])
    candidates = read_json(PRODUCT_CANDIDATES_PATH, {"candidates": []}).get("candidates", [])
    routes_payload = read_json(TREND_MONETIZATION_ROUTES_PATH, None)
    has_routes = bool(routes_payload and routes_payload.get("routes"))
    discovered = []
    for article in articles:
        if not isinstance(article, dict) or not article_matches_id(article, article_id):
            continue
        route = route_for_article(article, routes_payload)
        if route is not None and route.get("route") != REVIEW_COMPARISON:
            continue
        article_text = article_search_text(article)
        for candidate in candidates:
            if isinstance(candidate, dict) and candidate_matches_article(candidate, article, article_text):
                discovered.append(
                    {
                        **candidate,
                        "articleId": article.get("id"),
                        "monetizationRoute": (route or {}).get("route") or REVIEW_COMPARISON,
                        "status": "discovered",
                    }
                )
    return str(write_json(PRODUCT_CANDIDATES_PATH, {"candidates": discovered if has_routes or discovered else candidates}))


def article_matches_id(article: dict[str, object], article_id: str | None) -> bool:
    return not article_id or article.get("id") == article_id or article.get("articleId") == article_id


def article_search_text(article: dict[str, object]) -> str:
    sections = article.get("sections", [])
    section_text = " ".join(
        str(section.get("body") or "") for section in sections if isinstance(section, dict)
    )
    return " ".join(
        [
            str(article.get("title") or ""),
            str(article.get("summary") or ""),
            section_text,
        ]
    ).lower()


def candidate_matches_article(
    candidate: dict[str, object],
    article: dict[str, object],
    article_text: str,
) -> bool:
    market_match = candidate.get("market") == article.get("market")
    article_match = candidate.get("articleId") == article.get("id")
    topic_match = any(token and token in article_text for token in tokens(str(candidate.get("title") or "")))
    return bool(market_match and (article_match or (not candidate.get("articleId") and topic_match)))


def route_for_article(
    article: dict[str, object],
    routes_payload: object,
) -> dict[str, object] | None:
    if not isinstance(routes_payload, dict):
        return None
    routes = routes_payload.get("routes")
    if not isinstance(routes, list):
        return None
    article_id = str(article.get("id") or article.get("articleId") or "")
    article_slug = str(article.get("slug") or "")
    for route in routes:
        if not isinstance(route, dict):
            continue
        if article_id and route.get("articleId") == article_id:
            return route
        same_market = route.get("market") == article.get("market") and route.get("language") == article.get("language")
        if same_market and article_slug and route.get("slug") == article_slug:
            return route
    return {"route": "informational_explainer"} if routes else None
