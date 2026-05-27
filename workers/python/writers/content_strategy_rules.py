from __future__ import annotations

from typing import Any


def section_plan(keyword: str, opportunity: dict[str, Any], rows: list[dict[str, Any]]) -> list[dict[str, str]]:
    missing = []
    content_gap = opportunity.get("contentGapJson") if isinstance(opportunity, dict) else {}
    if isinstance(content_gap, dict):
        missing = [str(item) for item in content_gap.get("missingAngles", [])]
    plan = [
        {"heading": "Direct answer", "purpose": "Answer the market user's query first."},
        {"heading": "Why this is trending in this market", "purpose": "Separate local signal from global noise."},
        {"heading": "What top pages already cover", "purpose": "Summarize patterns without copying wording."},
        {"heading": "What to verify before buying or recommending", "purpose": "List evidence and risk checks."},
    ]
    if missing:
        plan.append({"heading": "Gaps this test post should fill", "purpose": "; ".join(missing[:4])})
    if any(row.get("comparisonTablePresent") for row in rows):
        plan.append({"heading": "Comparison criteria to add later", "purpose": "Prepare a future table without product links."})
    plan.append({"heading": "Product candidate analysis pending", "purpose": "Make monetization deferral explicit."})
    return plan


def evidence_needed(keyword: str, rows: list[dict[str, Any]]) -> list[str]:
    needs = ["SERP source URLs and summaries", "Market-specific availability context", "Freshness/date checks"]
    text = keyword.lower()
    if any(term in text for term in ["magnesium", "gut", "health", "sleep"]):
        needs.append("HealthClaimGuard review and conservative evidence sources")
    if any(term in text for term in ["charger", "power bank", "adapter"]):
        needs.append("Spec verification checklist and safety/certification notes")
    if not any(row.get("originalDataPresent") for row in rows):
        needs.append("Original data or testing plan before claiming superiority")
    return needs


def title_for(keyword: str, market: Any, opportunity: dict[str, Any]) -> str:
    if opportunity.get("recommendedArticleType") == "comparison_test_post":
        return f"{keyword.title()}: What to Compare Before Choosing in {str(market).upper()}"
    return f"{keyword.title()}: Market Test Guide for {str(market).upper()}"


def article_sections(strategy: dict[str, Any]) -> list[dict[str, str]]:
    sections = []
    for item in strategy.get("sectionPlanJson", []):
        if not isinstance(item, dict):
            continue
        heading = str(item.get("heading") or "Section")
        purpose = str(item.get("purpose") or "")
        sections.append(
            {
                "heading": heading,
                "body": (
                    f"{purpose} This is a test-publishing draft based on trend and SERP intelligence. "
                    "No affiliate links, prices, or unsupported claims are inserted at this stage."
                ),
            }
        )
    return sections


def brief_markdown(strategy: dict[str, Any]) -> str:
    lines = [
        f"# {strategy.get('titleStrategy')}",
        "",
        f"Angle: {strategy.get('recommendedAngle')}",
        "",
        "Monetization: deferred. Product links are forbidden in the first test post.",
        "",
        "## Outline",
    ]
    for section in strategy.get("sectionPlanJson", []):
        if isinstance(section, dict):
            lines.append(f"- {section.get('heading')}: {section.get('purpose')}")
    return "\n".join(lines)


def markdown_article(title: str, sections: list[dict[str, str]]) -> str:
    lines = [f"# {title}", "", "Product candidate analysis pending. Deal or affiliate links require human approval."]
    for section in sections:
        lines.extend(["", f"## {section['heading']}", section["body"]])
    return "\n".join(lines)
