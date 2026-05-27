from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from workers.python.common import slugify


def topic_article_prompt(brief: dict[str, Any], placements: list[dict[str, Any]]) -> str:
    return (
        "Generate a guarded article draft only from this ContentBrief and placement candidates. "
        "Do not invent prices, discounts, tests, certifications, product specs, reviews, health claims, or personal experience. "
        "Include update log, affiliate disclosure when offers exist, local market notes, and health disclaimer if needed.\n\n"
        f"BRIEF={brief}\nPLACEMENTS={placements}"
    )


def computed_quality_score(brief: dict[str, Any], placements: list[dict[str, Any]]) -> int:
    score = 55
    if brief.get("outlineJson"):
        score += 10
    if len(brief.get("requiredEvidence", [])) >= 3:
        score += 10
    if placements:
        score += 5
    if brief.get("healthSensitivity") != "none":
        score -= 5
    return max(0, min(79, score))


def health_sensitivity_for_brief(brief: dict[str, Any]) -> str:
    if brief.get("healthSensitivity") == "high":
        return "high"
    if brief.get("healthSensitivity") == "medium":
        return "medium"
    return "none"


def build_topic_article(
    brief: dict[str, Any],
    placements: list[dict[str, Any]],
    generated_note: str,
    created_at: str | None = None,
) -> dict[str, Any]:
    article_id = f"draft-article-{slugify(str(brief['id']))}"
    quality_score = computed_quality_score(brief, placements)
    health_sensitivity = health_sensitivity_for_brief(brief)

    return {
        "id": article_id,
        "topicId": brief.get("topicId"),
        "briefId": brief.get("id"),
        "locale": brief.get("locale"),
        "slug": slugify(str(brief.get("titleCandidate", article_id)))[:90],
        "type": brief.get("articleType"),
        "title": brief.get("titleCandidate"),
        "h1": brief.get("h1Candidate") or brief.get("titleCandidate"),
        "metaDescription": f"Draft generated from brief {brief.get('id')}; requires evidence, compliance, and publishing gate review.",
        "summary": brief.get("searchIntent"),
        "sections": brief.get("outlineJson", []),
        "requiredEvidence": brief.get("requiredEvidence", []),
        "affiliatePlacementCandidates": placements,
        "qualityScore": quality_score,
        "publishStatus": "pending",
        "indexStatus": "pending",
        "healthSensitivity": health_sensitivity,
        "complianceStatus": "manual_required" if health_sensitivity in {"medium", "high"} else "unchecked",
        "generatedNote": generated_note,
        "createdAt": created_at or datetime.now(timezone.utc).isoformat(),
    }
