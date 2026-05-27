from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any

from workers.python.common import slugify
from workers.python.intelligence.trend_topic_rules import (
    canonical_topic_for,
    cluster_key,
    infer_intent,
    looks_health_related,
    score_breakdown,
    signal_weight,
)


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
