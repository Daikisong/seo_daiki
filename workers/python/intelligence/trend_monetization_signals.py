from __future__ import annotations

import re
from typing import Any
from workers.python.intelligence.trend_monetization_constants import (
    BUYER_TERMS,
    COMMERCIAL_ARTICLE_TYPES,
    COMMERCIAL_INTENTS,
    HEALTH_GUARD_TERMS,
    INFORMATIONAL_ARTICLE_TYPES,
    INFORMATIONAL_TERMS,
    PRODUCT_TERMS,
    RUMOR_OR_FUTURE_TERMS,
)

def route_signals(
    article: dict[str, Any],
    opportunity: dict[str, Any] | None = None,
    strategy: dict[str, Any] | None = None,
) -> dict[str, Any]:
    opportunity = opportunity or {}
    strategy = strategy or {}
    content_types = list_values(opportunity.get("dominantContentTypesJson"))
    text = " ".join(
        [
            str(article.get("title") or ""),
            str(article.get("summary") or ""),
            str(article.get("contentMdx") or ""),
            str(opportunity.get("keyword") or ""),
            str(opportunity.get("recommendedArticleType") or ""),
            str(opportunity.get("dominantIntent") or ""),
            " ".join(content_types),
            str(opportunity.get("topPatternsJson") or ""),
            str(opportunity.get("contentGapJson") or ""),
            str(strategy.get("selectedArticleType") or ""),
            str(strategy.get("recommendedAngle") or ""),
        ]
    ).lower()
    return {
        "dominantIntent": str(opportunity.get("dominantIntent") or ""),
        "recommendedArticleType": str(opportunity.get("recommendedArticleType") or strategy.get("selectedArticleType") or ""),
        "dominantContentTypes": content_types,
        "buyerTerms": matched_terms(text, BUYER_TERMS),
        "productTerms": matched_terms(text, PRODUCT_TERMS),
        "informationalTerms": matched_terms(text, INFORMATIONAL_TERMS),
        "rumorOrFutureTerms": matched_terms(text, RUMOR_OR_FUTURE_TERMS),
        "healthTerms": matched_terms(text, HEALTH_GUARD_TERMS),
    }


def commerce_score(signals: dict[str, Any]) -> int:
    score = 0
    if signals["dominantIntent"] in COMMERCIAL_INTENTS:
        score += 40
    if signals["recommendedArticleType"] in COMMERCIAL_ARTICLE_TYPES:
        score += 25
    score += min(30, len(signals["buyerTerms"]) * 8)
    score += min(30, len(signals["productTerms"]) * 6)
    score += min(18, len([item for item in signals["dominantContentTypes"] if item in COMMERCIAL_ARTICLE_TYPES]) * 9)
    if signals["healthTerms"]:
        score += 18
    if signals["rumorOrFutureTerms"] and signals["dominantIntent"] == "informational":
        score -= 18
    return max(0, min(100, score))


def informational_score(signals: dict[str, Any]) -> int:
    score = 0
    if signals["dominantIntent"] == "informational":
        score += 35
    if signals["recommendedArticleType"] in INFORMATIONAL_ARTICLE_TYPES:
        score += 20
    score += min(40, len(signals["informationalTerms"]) * 8)
    score += min(20, len(signals["rumorOrFutureTerms"]) * 10)
    if not signals["productTerms"] and not signals["buyerTerms"]:
        score += 10
    return max(0, min(100, score))

def list_values(value: object) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value]
    if isinstance(value, tuple):
        return [str(item) for item in value]
    if value:
        return [str(value)]
    return []


def matched_terms(text: str, terms: tuple[str, ...]) -> list[str]:
    matches = []
    for term in terms:
        normalized_term = term.lower()
        if ascii_token_term(normalized_term):
            if re.search(rf"(?<![a-z0-9]){re.escape(normalized_term)}(?![a-z0-9])", text):
                matches.append(term)
        elif normalized_term in text:
            matches.append(term)
    return matches


def ascii_token_term(term: str) -> bool:
    return all(char.isascii() and (char.isalnum() or char in {" ", "-"}) for char in term)
