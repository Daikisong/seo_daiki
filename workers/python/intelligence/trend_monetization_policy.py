from __future__ import annotations

from typing import Any
from workers.python.intelligence.trend_monetization_constants import (
    INFORMATIONAL_EXPLAINER,
    PRODUCT_LOCALIZATION_REQUIRED_SIGNALS,
    REVIEW_COMPARISON,
    SOURCE_MARKET_ONLY,
    TRANSLATE_ALL_PRODUCT_MARKETS,
)

def route_reason(route: str, signals: dict[str, Any]) -> str:
    if route == REVIEW_COMPARISON:
        if signals["healthTerms"]:
            return "SERP and article signals show product comparison intent; health/supplement wording needs the health claim guard."
        return "SERP and article signals show buyer, review, deal, or product comparison intent."
    return "SERP and article signals are mainly policy, official, rumor, or informational; product links should be skipped."


def allowed_next_steps(route: str) -> list[str]:
    if route == REVIEW_COMPARISON:
        return [
            "ContentStrategy",
            "TestArticle",
            "TranslationGroup",
            "MarketLocalizedDrafts",
            "ProductCandidateDiscovery",
            "ProductCandidateAnalysisBlock",
        ]
    return ["ContentStrategy", "TestArticle"]


def blocked_next_steps(route: str) -> list[str]:
    if route == REVIEW_COMPARISON:
        return ["AutomaticAffiliateLinkInsertion"]
    return [
        "MarketWideTranslationExpansion",
        "ProductCandidateDiscovery",
        "ProductCandidateAnalysisBlock",
        "MonetizationReview",
        "AutomaticAffiliateLinkInsertion",
    ]


def localization_policy(route: str) -> dict[str, Any]:
    if route == REVIEW_COMPARISON:
        return {
            "strategy": TRANSLATE_ALL_PRODUCT_MARKETS,
            "targetRule": "all_enabled_markets",
            "createTranslationGroup": True,
            "createLocalizedDrafts": True,
            "requiresMarketAdaptation": True,
            "translationOnlyIndexable": False,
            "requiredLocalSignals": PRODUCT_LOCALIZATION_REQUIRED_SIGNALS,
            "reason": (
                "Product/review-comparison topics should be localized across enabled markets, "
                "then kept noindex until each market has local SERP, price, availability, "
                "warranty, retailer, and product-candidate context."
            ),
        }
    return {
        "strategy": SOURCE_MARKET_ONLY,
        "targetRule": "source_market_only",
        "createTranslationGroup": False,
        "createLocalizedDrafts": False,
        "requiresMarketAdaptation": False,
        "translationOnlyIndexable": False,
        "requiredLocalSignals": [],
        "reason": "Informational topics stay in the source market unless a separate market trend/SERP opportunity is detected.",
    }

def route_summary(routes: list[dict[str, Any]]) -> dict[str, int]:
    return {
        "total": len(routes),
        "reviewComparison": sum(1 for item in routes if item.get("route") == REVIEW_COMPARISON),
        "informationalExplainer": sum(1 for item in routes if item.get("route") == INFORMATIONAL_EXPLAINER),
    }
