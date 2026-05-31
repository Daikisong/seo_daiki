from __future__ import annotations

from typing import Any

from workers.python.writers.content_strategy_rules import evidence_needed, section_plan, title_for


FORBIDDEN_CLAIMS = [
    "Do not claim first-hand testing without evidence.",
    "Do not invent prices, discounts, medical outcomes, or availability.",
    "Do not insert affiliate links in the test article.",
    "Do not copy competitor wording or headings.",
    "Do not claim a product is best without a comparison method.",
]


def dry_run_strategy_refiner(
    keyword: dict[str, Any],
    cluster: dict[str, Any],
    opportunity: dict[str, Any],
    competitor_analyses: list[dict[str, Any]],
) -> dict[str, Any]:
    keyword_text = str(keyword.get("keyword") or "")
    market = keyword.get("market")
    sections = section_plan(keyword_text, opportunity, competitor_analyses)
    title = title_for(keyword_text, market, opportunity)
    recommended_angle = opportunity.get("recommendedAngle") or f"Create a market-specific no-link test post for {keyword_text}."

    return {
        "strategyProvider": "dry-run",
        "selectedArticleType": opportunity.get("recommendedArticleType") or "informational_test_post",
        "recommendedAngle": recommended_angle,
        "titleStrategy": title,
        "h1": title,
        "metaDescription": f"Market-specific test article for {keyword_text}. Product links and monetization are deferred.",
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
        "evidenceNeededJson": evidence_needed(keyword_text, competitor_analyses),
        "productCandidateNeedsJson": [
            "Product candidate analysis pending.",
            "Future candidates must be verified before any monetized placement.",
        ],
        "forbiddenClaimsJson": FORBIDDEN_CLAIMS,
        "competitorPatternsJson": opportunity.get("topPatternsJson") or [],
        "contentGapJson": opportunity.get("contentGapJson") or {},
        "monetizationDeferred": True,
    }
