from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from workers.python.common import slugify
from workers.python.intelligence.trend_topic_rules import (
    affiliate_match_score,
    article_type_for_intent,
    canonical_topic_for,
    clean,
    cluster_key,
    health_sensitivity_for,
    infer_intent,
    localization_notes_for,
    localized_title,
    looks_health_related,
    match_reason,
    merchant_fit_for,
    outline_for,
    publishing_blockers,
    required_evidence_for,
    score,
    score_breakdown,
    signal_weight,
    title_candidate,
)


def trend_import_payload(rows: list[dict[str, Any]], seed_path: Path, default_captured_at: str) -> dict[str, list[dict[str, Any]]]:
    sources: dict[str, dict[str, Any]] = {}
    signals: list[dict[str, Any]] = []

    for index, row in enumerate(rows, start=1):
        source_slug = clean(row.get("source_slug")) or "manual-csv"
        source = sources.setdefault(source_slug, trend_source_record(row, source_slug, seed_path))
        signals.append(trend_signal_record(row, index, source, source_slug, default_captured_at))

    return {"sources": list(sources.values()), "signals": signals}


def trend_source_record(row: dict[str, Any], source_slug: str, seed_path: Path) -> dict[str, Any]:
    return {
        "id": f"trend-source-{source_slug}",
        "name": clean(row.get("source_name")) or source_slug.replace("-", " ").title(),
        "slug": source_slug,
        "sourceType": clean(row.get("source_type")) or "manual_csv",
        "locale": clean(row.get("source_locale")) or clean(row.get("locale")) or None,
        "country": clean(row.get("source_country")) or clean(row.get("country")) or None,
        "enabled": True,
        "configJson": {"import_file": str(seed_path)}
    }


def trend_signal_record(
    row: dict[str, Any],
    index: int,
    source: dict[str, Any],
    source_slug: str,
    default_captured_at: str,
) -> dict[str, Any]:
    locale = clean(row.get("locale")) or source.get("locale") or "en"
    query = clean(row.get("query"))
    topic_raw = clean(row.get("topic_raw")) or query
    signal_id = f"trend-signal-{slugify(f'{source_slug} {locale} {query} {index}')}"

    return {
        "id": signal_id,
        "sourceId": source["id"],
        "locale": locale,
        "country": clean(row.get("country")) or source.get("country"),
        "query": query,
        "topicRaw": topic_raw,
        "url": clean(row.get("url")) or None,
        "volumeScore": score(row.get("volume_score")),
        "growthScore": score(row.get("growth_score")),
        "competitionScore": score(row.get("competition_score")),
        "commercialScore": score(row.get("commercial_score")),
        "freshnessScore": score(row.get("freshness_score")),
        "evidenceFitScore": score(row.get("evidence_fit_score")),
        "affiliateFitScore": score(row.get("affiliate_fit_score")),
        "capturedAt": clean(row.get("captured_at")) or default_captured_at,
    }


def topic_cluster_payload(signals: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for signal in signals:
        grouped[cluster_key(signal)].append(signal)

    topics: list[dict[str, Any]] = []
    topic_signals: list[dict[str, Any]] = []
    for key, grouped_signals in sorted(grouped.items()):
        canonical_topic = canonical_topic_for(grouped_signals)
        slug = slugify(canonical_topic)
        topic_id = f"topic-{slug}"
        intent = infer_intent(" ".join(str(item.get("query", "")) for item in grouped_signals))
        health_sensitive = intent == "health" or any(looks_health_related(str(item.get("topicRaw", ""))) for item in grouped_signals)
        locale_counts = Counter(str(item.get("locale", "en")) for item in grouped_signals)

        topics.append(
            {
                "id": topic_id,
                "canonicalTopic": canonical_topic,
                "slug": slug,
                "cluster": key,
                "primaryLocale": locale_counts.most_common(1)[0][0],
                "intent": intent,
                "healthSensitive": health_sensitive,
                "status": "candidate",
                "score": 0,
                "scoreBreakdown": {},
                "signalCount": len(grouped_signals),
            }
        )
        for signal in grouped_signals:
            topic_signals.append(topic_signal_record(topic_id, signal))

    return {"topics": topics, "topicSignals": topic_signals}


def topic_signal_record(topic_id: str, signal: dict[str, Any]) -> dict[str, Any]:
    signal_id = signal["id"]
    return {
        "id": f"topic-signal-{slugify(f'{topic_id} {signal_id}')}",
        "topicId": topic_id,
        "trendSignalId": signal_id,
        "weight": signal_weight(signal),
    }


def topic_score_payload(cluster_payload: dict[str, list[dict[str, Any]]], signals: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    signal_by_id = {signal["id"]: signal for signal in signals}
    signals_by_topic: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for link in cluster_payload.get("topicSignals", []):
        signal = signal_by_id.get(link["trendSignalId"])
        if signal:
            signals_by_topic[link["topicId"]].append(signal)

    scored_topics = []
    for topic in cluster_payload.get("topics", []):
        topic_signals = signals_by_topic.get(topic["id"], [])
        breakdown = score_breakdown(topic_signals)
        scored_topics.append({**topic, "score": topic_score_from_breakdown(breakdown), "scoreBreakdown": breakdown})

    scored_topics.sort(key=lambda item: item["score"], reverse=True)
    return {"topics": scored_topics, "topicSignals": cluster_payload.get("topicSignals", [])}


def topic_score_from_breakdown(breakdown: dict[str, float]) -> float:
    return round(
        breakdown["growthScore"] * 0.25
        + breakdown["commercialScore"] * 0.20
        + breakdown["evidenceFitScore"] * 0.20
        + breakdown["affiliateFitScore"] * 0.15
        + breakdown["lowCompetitionScore"] * 0.10
        + breakdown["freshnessScore"] * 0.10,
        2,
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
