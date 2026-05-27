from __future__ import annotations

from collections import Counter
from typing import Any


def missing_angles(result: dict[str, Any], headings: list[str]) -> list[str]:
    text = " ".join([str(result.get("title")), str(result.get("snippet")), *headings]).lower()
    gaps = []
    if "market" not in text and "country" not in text:
        gaps.append("market-specific guidance")
    if "evidence" not in text and "test" not in text:
        gaps.append("evidence or verification checklist")
    if "updated" not in text and "2026" not in text:
        gaps.append("freshness signal")
    return gaps


def inferred_headings(result: dict[str, Any]) -> list[str]:
    text = f"{result.get('title')} {result.get('snippet')}".lower()
    headings = ["What users want to know", "Key comparison points", "Market-specific notes"]
    if "sleep" in text or "gut" in text:
        headings.append("Safety and evidence limits")
    if "charger" in text or "power bank" in text:
        headings.append("Specs and verification checks")
    return headings


def top_patterns(rows: list[dict[str, Any]]) -> list[str]:
    patterns = []
    if any(row.get("comparisonTablePresent") for row in rows):
        patterns.append("Comparison table appears in top results")
    if any(row.get("productLinksPresent") for row in rows):
        patterns.append("Product-card monetization appears, but this pipeline defers links")
    if not any(row.get("originalDataPresent") for row in rows):
        patterns.append("Original data/testing is weak across competitors")
    return patterns or ["Standard guide format dominates"]


def content_gap(rows: list[dict[str, Any]]) -> dict[str, Any]:
    missing = sorted({gap for row in rows for gap in row.get("missingAnglesJson", [])})
    return {"missingAngles": missing[:8], "canDifferentiateWith": ["market notes", "verification checklist", "clear no-link test post"]}


def recommended_angle(keyword: dict[str, Any], rows: list[dict[str, Any]]) -> str:
    missing = content_gap(rows)["missingAngles"]
    if missing:
        return f"Answer {keyword.get('keyword')} with market-specific evidence and fill gaps: {', '.join(missing[:3])}."
    return f"Create a market-specific test post for {keyword.get('keyword')} with clearer structure than competitors."


def recommended_article_type(intents: Counter[str], content_types: Counter[str]) -> str:
    dominant_intent = intents.most_common(1)[0][0]
    if "comparison" in dominant_intent:
        return "comparison_test_post"
    if "commercial" in dominant_intent:
        return "buyer_intent_test_post"
    return content_types.most_common(1)[0][0] if content_types else "informational_test_post"
