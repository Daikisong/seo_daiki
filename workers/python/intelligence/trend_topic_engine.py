from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from workers.python.common import DATA, read_csv, read_json, slugify, write_json
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

TREND_SIGNALS_PATH = DATA / "snapshots" / "trend_signals.json"
TOPIC_CLUSTERS_PATH = DATA / "snapshots" / "topic_clusters.json"
TOPIC_SCORES_PATH = DATA / "snapshots" / "topic_scores.json"
CONTENT_BRIEFS_PATH = DATA / "briefs" / "content_briefs.json"
OFFER_MATCHES_PATH = DATA / "snapshots" / "affiliate_offer_matches.json"
TOPIC_DRAFTS_REPORT_PATH = DATA / "exports" / "topic_drafts.json"
TOPIC_LOCALIZATION_REPORT_PATH = DATA / "exports" / "topic_localizations.json"
PUBLISHING_GATE_PATH = DATA / "exports" / "topic_publishing_gate.json"


def collect_trend_signals(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "trend-signals.csv"
    return import_trend_signals(seed_path)


def import_trend_signals(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "trend-signals.csv"
    rows = read_csv(seed_path)
    sources: dict[str, dict[str, Any]] = {}
    signals: list[dict[str, Any]] = []

    for index, row in enumerate(rows, start=1):
        source_slug = clean(row.get("source_slug")) or "manual-csv"
        source = sources.setdefault(
            source_slug,
            {
                "id": f"trend-source-{source_slug}",
                "name": clean(row.get("source_name")) or source_slug.replace("-", " ").title(),
                "slug": source_slug,
                "sourceType": clean(row.get("source_type")) or "manual_csv",
                "locale": clean(row.get("source_locale")) or clean(row.get("locale")) or None,
                "country": clean(row.get("source_country")) or clean(row.get("country")) or None,
                "enabled": True,
                "configJson": {"import_file": str(seed_path)}
            },
        )
        locale = clean(row.get("locale")) or source.get("locale") or "en"
        query = clean(row.get("query"))
        topic_raw = clean(row.get("topic_raw")) or query
        captured_at = clean(row.get("captured_at")) or datetime.now(timezone.utc).isoformat()
        signal_id = f"trend-signal-{slugify(f'{source_slug} {locale} {query} {index}')}"

        signals.append(
            {
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
                "capturedAt": captured_at,
            }
        )

    return str(write_json(TREND_SIGNALS_PATH, {"sources": list(sources.values()), "signals": signals}))


def cluster_topics() -> str:
    payload = read_json(TREND_SIGNALS_PATH, {"signals": []})
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for signal in payload.get("signals", []):
        key = cluster_key(signal)
        grouped[key].append(signal)

    topics: list[dict[str, Any]] = []
    topic_signals: list[dict[str, Any]] = []
    for key, signals in sorted(grouped.items()):
        canonical_topic = canonical_topic_for(signals)
        slug = slugify(canonical_topic)
        topic_id = f"topic-{slug}"
        intent = infer_intent(" ".join(str(item.get("query", "")) for item in signals))
        health_sensitive = intent == "health" or any(looks_health_related(str(item.get("topicRaw", ""))) for item in signals)
        locale_counts = Counter(str(item.get("locale", "en")) for item in signals)

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
                "signalCount": len(signals),
            }
        )
        for signal in signals:
            signal_id = signal["id"]
            topic_signals.append(
                {
                    "id": f"topic-signal-{slugify(f'{topic_id} {signal_id}')}",
                    "topicId": topic_id,
                    "trendSignalId": signal_id,
                    "weight": signal_weight(signal),
                }
            )

    return str(write_json(TOPIC_CLUSTERS_PATH, {"topics": topics, "topicSignals": topic_signals}))


def score_topics() -> str:
    cluster_payload = read_json(TOPIC_CLUSTERS_PATH, {"topics": [], "topicSignals": []})
    signal_payload = read_json(TREND_SIGNALS_PATH, {"signals": []})
    signal_by_id = {signal["id"]: signal for signal in signal_payload.get("signals", [])}
    signals_by_topic: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for link in cluster_payload.get("topicSignals", []):
        signal = signal_by_id.get(link["trendSignalId"])
        if signal:
            signals_by_topic[link["topicId"]].append(signal)

    scored_topics = []
    for topic in cluster_payload.get("topics", []):
        signals = signals_by_topic.get(topic["id"], [])
        breakdown = score_breakdown(signals)
        score_value = round(
            breakdown["growthScore"] * 0.25
            + breakdown["commercialScore"] * 0.20
            + breakdown["evidenceFitScore"] * 0.20
            + breakdown["affiliateFitScore"] * 0.15
            + breakdown["lowCompetitionScore"] * 0.10
            + breakdown["freshnessScore"] * 0.10,
            2,
        )
        scored_topics.append({**topic, "score": score_value, "scoreBreakdown": breakdown})

    scored_topics.sort(key=lambda item: item["score"], reverse=True)
    return str(write_json(TOPIC_SCORES_PATH, {"topics": scored_topics, "topicSignals": cluster_payload.get("topicSignals", [])}))


def generate_content_briefs() -> str:
    payload = read_json(TOPIC_SCORES_PATH, {"topics": []})
    briefs = []
    for topic in payload.get("topics", []):
        article_type = article_type_for_intent(topic["intent"])
        health_sensitivity = health_sensitivity_for(topic)
        briefs.append(
            {
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
                "healthSensitivity": health_sensitivity,
                "status": "draft",
                "score": topic["score"],
            }
        )
    return str(write_json(CONTENT_BRIEFS_PATH, {"briefs": briefs}))


def match_affiliate_offers() -> str:
    payload = read_json(TOPIC_SCORES_PATH, {"topics": []})
    matches = []
    for topic in payload.get("topics", []):
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
    matches.sort(key=lambda item: item["matchScore"], reverse=True)
    return str(write_json(OFFER_MATCHES_PATH, {"matches": matches}))


def generate_topic_draft(locale: str | None = None) -> str:
    payload = read_json(CONTENT_BRIEFS_PATH, {"briefs": []})
    briefs = [brief for brief in payload.get("briefs", []) if not locale or brief.get("locale") == locale]
    generated = []
    for brief in briefs:
        path = DATA / "drafts" / f"topic-{brief['locale']}-{brief['articleType']}-{brief['topicId'].replace('topic-', '')}.md"
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
        path.write_text("\n".join(lines), encoding="utf-8")
        generated.append({"briefId": brief["id"], "path": str(path)})

    return str(write_json(TOPIC_DRAFTS_REPORT_PATH, {"drafts": generated}))


def localize_topic_draft(target_locales: list[str] | None = None) -> str:
    payload = read_json(CONTENT_BRIEFS_PATH, {"briefs": []})
    locales = target_locales or ["en", "es", "pt-br"]
    localized = []
    for brief in payload.get("briefs", []):
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

    return str(write_json(TOPIC_LOCALIZATION_REPORT_PATH, {"localizations": localized}))


def run_publishing_gate() -> str:
    briefs_payload = read_json(CONTENT_BRIEFS_PATH, {"briefs": []})
    matches_payload = read_json(OFFER_MATCHES_PATH, {"matches": []})
    matches_by_topic: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for match in matches_payload.get("matches", []):
        matches_by_topic[str(match.get("topicId"))].append(match)

    results = []
    for brief in briefs_payload.get("briefs", []):
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

    return str(write_json(PUBLISHING_GATE_PATH, {"results": results}))
