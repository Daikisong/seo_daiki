from __future__ import annotations

from typing import Any

from workers.python.intelligence.trend_topic_rules import (
    article_type_for_intent,
    health_sensitivity_for,
    localization_notes_for,
    merchant_fit_for,
    outline_for,
    required_evidence_for,
    title_candidate,
)


def content_brief_records(topics: list[dict[str, Any]]) -> list[dict[str, Any]]:
    briefs = []
    for topic in topics:
        article_type = article_type_for_intent(topic["intent"])
        briefs.append(content_brief_record(topic, article_type))
    return briefs


def content_brief_record(topic: dict[str, Any], article_type: str) -> dict[str, Any]:
    return {
        "id": f"brief-{topic['slug']}-{topic['primaryLocale']}",
        "topicId": topic["id"],
        "locale": topic["primaryLocale"],
        "articleType": article_type,
        "titleCandidate": title_candidate(topic, article_type),
        "h1Candidate": title_candidate(topic, article_type),
        "searchIntent": topic["intent"],
        "outlineJson": outline_for(topic, article_type),
        "requiredEvidence": required_evidence_for(topic),
        "merchantFitJson": merchant_fit_for(topic),
        "localizationNotes": localization_notes_for(topic),
        "healthSensitivity": health_sensitivity_for(topic),
        "status": "draft",
        "score": topic["score"],
    }
