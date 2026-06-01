from __future__ import annotations

from typing import Any

from workers.python.writers.content_strategy_experience import (
    article_experience,
    localized_internal_links,
    seo_readiness_score,
    serp_format_experience,
)
from workers.python.writers.content_strategy_localization import (
    list_phrase,
    localized_list_phrase,
    localized_section_copy,
    summarize_competitors,
    translate_phrase,
)
from workers.python.writers.content_strategy_reader_sections import article_summary, reader_facing_article_sections
from workers.python.writers.content_strategy_topics import topic_key


def section_plan(keyword: str, opportunity: dict[str, Any], rows: list[dict[str, Any]]) -> list[dict[str, str]]:
    missing = []
    content_gap = opportunity.get("contentGapJson") if isinstance(opportunity, dict) else {}
    if isinstance(content_gap, dict):
        missing = [str(item) for item in content_gap.get("missingAngles", [])]
    plan = [
        {"heading": "Quick answer", "purpose": "Give the reader the practical answer first."},
        {"heading": "Why it matters now", "purpose": "Explain the current user need in plain language."},
        {"heading": "What to check", "purpose": "Turn the topic into a useful reader checklist."},
        {"heading": "Common mistakes", "purpose": "Warn readers about likely wrong assumptions."},
    ]
    if missing:
        plan.append({"heading": "Details that are easy to miss", "purpose": "; ".join(missing[:4])})
    if any(row.get("comparisonTablePresent") for row in rows):
        plan.append({"heading": "How to compare options", "purpose": "Explain the criteria readers should use before deciding."})
    plan.append({"heading": "Sources to verify", "purpose": "Point readers to official or primary sources."})
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


def title_for(keyword: str, market: Any, opportunity: dict[str, Any], language: str = "en") -> str:
    cleaned = keyword.strip()
    lowered = cleaned.lower()
    if "samsung s90f" in lowered:
        return "Samsung S90F OLED deal: what US buyers should verify first"
    if "iphone 16" in lowered and language == "pt-br":
        return "iPhone 16 em promoção no Brasil: o que verificar antes de comprar"
    if "iphone 18" in lowered and language == "ja":
        return "iPhone 18の噂: 日本で確認すべきポイント"
    if ("runway" in lowered or "aleph" in lowered) and language == "ja":
        return "Runway Aleph 2.0: AI動画編集ツールを試す前に比較すべき点"
    if "renta 2025" in lowered and language == "es":
        return "Renta 2025 y AEAT: qué comprobar antes de corregir una declaración"
    if "kbo" in lowered and ("올스타" in cleaned or "all-star" in lowered) and language == "ko":
        return "KBO 올스타 팬투표 2026: 후보와 일정 확인할 점"
    if any(term in cleaned for term in ["게임", "게이밍", "모니터"]) and language == "ko":
        return "게이밍 모니터 추천 2026: QHD 180Hz와 OLED 중 먼저 볼 것"
    if language == "es":
        return f"{cleaned}: qué comprobar antes de actuar en {str(market).upper()}"
    if language == "pt-br":
        return f"{cleaned}: o que verificar antes de decidir no {str(market).upper()}"
    if language == "ja":
        return f"{cleaned}: 日本で確認すべきポイント"
    if language == "ko":
        return f"{cleaned}: 한국에서 먼저 확인할 점"
    if opportunity.get("recommendedArticleType") == "comparison_test_post":
        return f"{cleaned.title()}: What to Compare Before Choosing in {str(market).upper()}"
    return f"{cleaned.title()}: Market Test Guide for {str(market).upper()}"


def article_sections(strategy: dict[str, Any]) -> list[dict[str, str]]:
    reader_sections = reader_facing_article_sections(strategy)
    if reader_sections:
        return reader_sections

    language = str(strategy.get("language") or "en")
    keyword = str(strategy.get("slug") or strategy.get("titleStrategy") or "this trend").replace("-", " ")
    market = str(strategy.get("market") or "").upper()
    angle = str(strategy.get("recommendedAngle") or "")
    competitors = [row for row in strategy.get("competitorSummaryJson", []) if isinstance(row, dict)]
    gaps = strategy.get("contentGapJson") if isinstance(strategy.get("contentGapJson"), dict) else {}
    missing_angles = [str(item) for item in gaps.get("missingAngles", [])] if isinstance(gaps, dict) else []
    evidence = [str(item) for item in strategy.get("evidenceNeededJson", [])]
    patterns = [str(item) for item in strategy.get("competitorPatternsJson", [])]

    competitor_line = summarize_competitors(competitors, language)
    gap_line = localized_list_phrase(missing_angles, "market-specific verification", language)
    evidence_line = localized_list_phrase(evidence, "source freshness checks", language)
    pattern_line = localized_list_phrase(patterns, "expected sections and user intent", language)

    localized = localized_section_copy(language, keyword, market, angle, competitor_line, gap_line, evidence_line, pattern_line)
    return [{"heading": heading, "body": body} for heading, body in localized]

def brief_markdown(strategy: dict[str, Any]) -> str:
    lines = [
        f"# {strategy.get('titleStrategy')}",
        "",
        f"Reader angle: {strategy.get('recommendedAngle')}",
        "",
        "## Outline",
    ]
    for section in strategy.get("sectionPlanJson", []):
        if isinstance(section, dict):
            lines.append(f"- {section.get('heading')}: {section.get('purpose')}")
    return "\n".join(lines)


def markdown_article(title: str, sections: list[dict[str, str]]) -> str:
    lines = [f"# {title}"]
    for section in sections:
        lines.extend(["", f"## {section['heading']}", section["body"]])
    return "\n".join(lines)
