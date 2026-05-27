from __future__ import annotations

from collections import defaultdict
from typing import Any

from workers.python.intelligence.trend_topic_rules import (
    affiliate_match_score,
    article_type_for_intent,
    health_sensitivity_for,
    localization_notes_for,
    localized_title,
    match_reason,
    merchant_fit_for,
    outline_for,
    publishing_blockers,
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


def affiliate_offer_match_records(topics: list[dict[str, Any]]) -> list[dict[str, Any]]:
    matches = []
    for topic in topics:
        merchants = ["iherb"] if topic.get("healthSensitive") else ["aliexpress"]
        if topic["intent"] in {"comparison", "deal", "commercial"} and "aliexpress" not in merchants:
            merchants.append("aliexpress")
        for merchant in merchants:
            matches.append(
                {
                    "topicId": topic["id"],
                    "topicSlug": topic["slug"],
                    "merchantSlug": merchant,
                    "matchScore": affiliate_match_score(topic, merchant),
                    "status": "candidate",
                    "reason": match_reason(topic, merchant),
                }
            )
    return sorted(matches, key=lambda item: item["matchScore"], reverse=True)


def topic_draft_lines(brief: dict[str, Any]) -> list[str]:
    lines = [
        f"# {brief['titleCandidate']}",
        "",
        f"Locale: {brief['locale']}",
        f"Article type: {brief['articleType']}",
        f"Search intent: {brief['searchIntent']}",
        f"Health sensitivity: {brief['healthSensitivity']}",
        "",
        "## Required evidence",
        *(f"- {item}" for item in brief.get("requiredEvidence", [])),
        "",
        "## Outline",
        *(f"- {section['heading']}: {section['purpose']}" for section in brief.get("outlineJson", [])),
        "",
        "## Drafting guardrails",
        "- Use only collected trend signals, evidence packs, offer data, and Search Console context.",
        "- Keep the page noindex until the publishing gate passes.",
        "- Use rel=\"sponsored nofollow\" for affiliate placements.",
    ]
    if brief.get("healthSensitivity") != "none":
        lines.extend(
            [
                "- Include a visible health disclaimer.",
                "- Do not make cure, treatment, prevention, guaranteed, or unsupported medical claims.",
                "- Require manual compliance approval before indexing.",
            ]
        )
    return lines


def topic_localization_records(briefs: list[dict[str, Any]], locales: list[str]) -> list[dict[str, Any]]:
    localized = []
    for brief in briefs:
        for locale in locales:
            if locale == brief.get("locale"):
                continue
            localized.append(
                {
                    "sourceBriefId": brief["id"],
                    "targetLocale": locale,
                    "status": "draft",
                    "titleCandidate": localized_title(str(brief["titleCandidate"]), locale),
                    "localizationNotes": {
                        **brief.get("localizationNotes", {}),
                        "targetLocale": locale,
                        "requiresHumanReview": True,
                    },
                }
            )
    return localized


def publishing_gate_records(briefs: list[dict[str, Any]], matches: list[dict[str, Any]]) -> list[dict[str, Any]]:
    matches_by_topic: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for match in matches:
        matches_by_topic[str(match.get("topicId"))].append(match)

    results = []
    for brief in briefs:
        blockers = publishing_blockers(brief, matches_by_topic.get(str(brief.get("topicId")), []))
        results.append(
            {
                "briefId": brief["id"],
                "topicId": brief["topicId"],
                "locale": brief["locale"],
                "articleType": brief["articleType"],
                "status": "blocked" if blockers else "ready_for_human_review",
                "blockers": blockers,
            }
        )
    return results
