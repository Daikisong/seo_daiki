from __future__ import annotations

from collections import defaultdict
from typing import Any

from workers.python.common import read_json, slugify, write_json
from workers.python.intelligence.market_trend_artifacts import (
    MARKET_TREND_CLUSTERS_PATH,
    MARKET_TREND_REPORT_PATH,
    MARKET_TREND_SIGNALS_PATH,
    now,
)
from workers.python.intelligence.trend_rules import (
    cluster_topic,
    cross_market_patterns,
    infer_category,
    trend_score_breakdown,
    trend_score_from_breakdown,
)


def cluster_market_trends() -> str:
    payload = read_json(MARKET_TREND_SIGNALS_PATH, {"signals": []})
    return str(write_json(MARKET_TREND_CLUSTERS_PATH, {"clusters": market_trend_cluster_records(payload.get("signals", []))}))


def market_trend_cluster_records(signals: list[dict[str, Any]]) -> list[dict[str, Any]]:
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for signal in signals:
        if isinstance(signal, dict):
            key = f"{signal.get('market')}::{signal.get('language')}::{cluster_topic(signal)}"
            groups[key].append(signal)

    clusters = []
    for key, grouped_signals in sorted(groups.items()):
        market, language, topic = key.split("::", 2)
        countries = sorted({str(signal.get("country")) for signal in grouped_signals if signal.get("country")})
        related = sorted({str(signal.get("normalizedKeyword")) for signal in grouped_signals if signal.get("normalizedKeyword")})
        cluster_id = f"trend-cluster-{slugify(f'{market} {language} {topic}')}"
        clusters.append(
            {
                "id": cluster_id,
                "market": market,
                "language": language,
                "canonicalTopic": topic,
                "slug": slugify(topic),
                "category": infer_category(topic),
                "detectedAt": now(),
                "status": "clustered",
                "signalCount": len(grouped_signals),
                "countriesSeenJson": countries,
                "relatedKeywordsJson": related,
                "score": 0,
                "scoreBreakdownJson": {},
                "signalIds": [signal["id"] for signal in grouped_signals],
            }
        )
    return clusters


def score_market_trends() -> str:
    signals_payload = read_json(MARKET_TREND_SIGNALS_PATH, {"signals": []})
    clusters_payload = read_json(MARKET_TREND_CLUSTERS_PATH, {"clusters": []})
    clusters = scored_market_trend_records(clusters_payload.get("clusters", []), signals_payload.get("signals", []))
    report = {"clusters": clusters, "crossMarketPatterns": cross_market_patterns(clusters), "generatedAt": now()}
    write_json(MARKET_TREND_CLUSTERS_PATH, {"clusters": clusters})
    return str(write_json(MARKET_TREND_REPORT_PATH, report))


def scored_market_trend_records(clusters: list[dict[str, Any]], signals: list[dict[str, Any]]) -> list[dict[str, Any]]:
    signal_by_id = {signal["id"]: signal for signal in signals if isinstance(signal, dict)}
    scored_clusters = []
    for cluster in clusters:
        if not isinstance(cluster, dict):
            continue
        cluster_signals = [signal_by_id[signal_id] for signal_id in cluster.get("signalIds", []) if signal_id in signal_by_id]
        breakdown = trend_score_breakdown(cluster_signals, cluster)
        scored_clusters.append(
            {**cluster, "score": trend_score_from_breakdown(breakdown), "scoreBreakdownJson": breakdown, "status": "scored"}
        )
    scored_clusters.sort(key=lambda item: item["score"], reverse=True)
    return scored_clusters
