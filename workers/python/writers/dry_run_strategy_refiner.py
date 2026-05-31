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
    language = str(keyword.get("language") or "")
    sections = section_plan(keyword_text, opportunity, competitor_analyses)
    title = title_for(keyword_text, market, opportunity, language)
    recommended_angle = localized_recommended_angle(language, keyword_text, opportunity)

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
        "competitorSummaryJson": competitor_summary(competitor_analyses),
        "monetizationDeferred": True,
    }


def competitor_summary(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    summary = []
    for row in rows[:5]:
        if not isinstance(row, dict):
            continue
        summary.append(
            {
                "title": row.get("pageTitle"),
                "type": row.get("contentTypeGuess"),
                "intent": row.get("intentServed"),
                "monetization": row.get("monetizationPattern"),
                "hasComparisonTable": row.get("comparisonTablePresent"),
                "hasProductLinks": row.get("productLinksPresent"),
                "hasOriginalData": row.get("originalDataPresent"),
                "angles": row.get("contentAnglesJson") or [],
                "gaps": row.get("missingAnglesJson") or [],
                "strengths": row.get("strengthsJson") or [],
                "weaknesses": row.get("weaknessesJson") or [],
            }
        )
    return summary


def localized_recommended_angle(language: str, keyword_text: str, opportunity: dict[str, Any]) -> str:
    gap = opportunity.get("contentGapJson") if isinstance(opportunity, dict) else {}
    missing = [str(item) for item in gap.get("missingAngles", [])] if isinstance(gap, dict) else []
    gap_text = ", ".join(missing[:3]) if missing else "market-specific verification"
    if language == "es":
        return f"Resolver la búsqueda sobre {keyword_text} con una guía práctica basada en fuentes oficiales y cubrir: {gap_text}."
    if language == "pt-br":
        return f"Responder se {keyword_text} merece atenção agora com checagem de preço, garantia e contexto do Brasil."
    if language == "ja":
        return f"{keyword_text} について、確定情報と噂を分け、日本の読者が確認すべき点を整理する。"
    if language == "ko":
        return f"{keyword_text} 이슈를 정책 근거와 학생·학부모 확인사항 중심으로 정리한다."
    return opportunity.get("recommendedAngle") or f"Create a market-specific no-link test post for {keyword_text}."
