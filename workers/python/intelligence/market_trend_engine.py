from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from workers.python.common import DATA, read_csv, read_json, slugify, write_json
from workers.python.intelligence.trend_rules import (
    bucket,
    cluster_topic,
    cross_market_patterns,
    infer_category,
    infer_intent,
    integer,
    market_from_country,
    normalize_keyword,
    score,
    trend_score_breakdown,
    trend_score_from_breakdown,
)

MARKETS_PATH = DATA / "config" / "markets.json"
MARKET_TREND_SOURCES_PATH = DATA / "exports" / "market_trend_sources.json"
MARKET_TREND_SIGNALS_PATH = DATA / "exports" / "market_trend_signals.json"
MARKET_TREND_CLUSTERS_PATH = DATA / "exports" / "trend_clusters.json"
MARKET_TREND_KEYWORDS_PATH = DATA / "exports" / "trend_keywords.json"
MARKET_TREND_REPORT_PATH = DATA / "exports" / "trend_report.json"


def init_markets() -> str:
    markets = read_json(MARKETS_PATH, [])
    sources = []
    for market in markets:
        if not isinstance(market, dict) or not market.get("enabled"):
            continue
        sources.append(
            {
                "id": f"trend-source-{market['market']}-{market['language']}-manual-csv",
                "sourceType": "manual_csv",
                "name": f"{market['country']} {market['language']} manual trend feed",
                "market": market["market"],
                "language": market["language"],
                "country": market["country"],
                "enabled": True,
                "reliabilityTier": "manual_reviewed",
                "collectionMode": "manual_csv",
                "configJson": {"feedPath": market["trendFeedPath"], "trendsGeo": market["trendsGeo"]},
                "lastCollectedAt": None,
            }
        )
    return str(write_json(MARKET_TREND_SOURCES_PATH, {"sources": sources}))


def import_market_trend_signals(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "trend-signals.csv"
    rows = read_csv(seed_path)
    sources_by_key: dict[str, dict[str, Any]] = {}
    signals = []
    for index, row in enumerate(rows, start=1):
        market = clean(row.get("market")) or market_from_country(clean(row.get("country")))
        language = clean(row.get("language")) or clean(row.get("locale")) or "en"
        country = clean(row.get("country")).upper() or market.upper()
        source_type = clean(row.get("source_type")) or "manual_csv"
        source_key = f"{market}-{language}-{source_type}"
        source = sources_by_key.setdefault(
            source_key,
            {
                "id": f"trend-source-{source_key}",
                "sourceType": source_type,
                "name": clean(row.get("source_name")) or f"{country} {language} {source_type}",
                "market": market,
                "language": language,
                "country": country,
                "enabled": True,
                "reliabilityTier": clean(row.get("reliability_tier")) or "manual_reviewed",
                "collectionMode": clean(row.get("collection_mode")) or "manual_csv",
                "configJson": {"importFile": str(seed_path)},
                "lastCollectedAt": now(),
            },
        )
        raw_keyword = clean(row.get("raw_keyword")) or clean(row.get("query"))
        normalized_keyword = clean(row.get("normalized_keyword")) or normalize_keyword(raw_keyword)
        topic_raw = clean(row.get("topic_raw")) or normalized_keyword
        signal = {
            "id": f"market-trend-signal-{slugify(f'{source_key} {normalized_keyword} {index}')}",
            "sourceId": source["id"],
            "sourceType": source_type,
            "market": market,
            "language": language,
            "country": country,
            "rawKeyword": raw_keyword,
            "normalizedKeyword": normalized_keyword,
            "topicRaw": topic_raw,
            "categoryGuess": clean(row.get("category_guess")) or infer_category(topic_raw),
            "url": clean(row.get("url")) or None,
            "observedAt": clean(row.get("observed_at")) or clean(row.get("captured_at")) or now(),
            "sourceRank": integer(row.get("source_rank"), index),
            "sourceVolumeBucket": clean(row.get("source_volume_bucket")) or bucket(score(row.get("volume_score"))),
            "relativeGrowth": score(row.get("relative_growth")) or score(row.get("growth_score")),
            "velocityScore": score(row.get("velocity_score")) or score(row.get("growth_score")),
            "freshnessScore": score(row.get("freshness_score")),
            "commercialHintScore": score(row.get("commercial_hint_score")) or score(row.get("commercial_score")),
            "evidenceHintScore": score(row.get("evidence_hint_score")) or score(row.get("evidence_fit_score")),
            "localeSpecificityScore": score(row.get("locale_specificity_score")) or (80 if market else 40),
            "status": "raw",
            "rawJson": dict(row),
        }
        signals.append(signal)
    payload = {"sources": list(sources_by_key.values()), "signals": signals}
    write_json(MARKET_TREND_SOURCES_PATH, {"sources": payload["sources"]})
    return str(write_json(MARKET_TREND_SIGNALS_PATH, payload))


def collect_market_trends(market: str | None = None, source: str | None = None) -> str:
    payload = read_json(MARKET_TREND_SIGNALS_PATH, {"signals": []})
    signals = [
        signal
        for signal in payload.get("signals", [])
        if isinstance(signal, dict)
        and (not market or signal.get("market") == market)
        and (not source or signal.get("sourceType") == source)
    ]
    return str(write_json(DATA / "exports" / "trend_collect_report.json", {"market": market, "source": source, "signals": signals}))


def normalize_market_trends() -> str:
    payload = read_json(MARKET_TREND_SIGNALS_PATH, {"sources": [], "signals": []})
    signals = []
    for signal in payload.get("signals", []):
        if not isinstance(signal, dict):
            continue
        normalized = dict(signal)
        normalized["normalizedKeyword"] = normalize_keyword(str(normalized.get("normalizedKeyword") or normalized.get("rawKeyword") or ""))
        normalized["status"] = "normalized"
        signals.append(normalized)
    return str(write_json(MARKET_TREND_SIGNALS_PATH, {"sources": payload.get("sources", []), "signals": signals}))


def cluster_market_trends() -> str:
    payload = read_json(MARKET_TREND_SIGNALS_PATH, {"signals": []})
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for signal in payload.get("signals", []):
        if isinstance(signal, dict):
            key = f"{signal.get('market')}::{signal.get('language')}::{cluster_topic(signal)}"
            groups[key].append(signal)

    clusters = []
    for key, signals in sorted(groups.items()):
        market, language, topic = key.split("::", 2)
        countries = sorted({str(signal.get("country")) for signal in signals if signal.get("country")})
        related = sorted({str(signal.get("normalizedKeyword")) for signal in signals if signal.get("normalizedKeyword")})
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
                "signalCount": len(signals),
                "countriesSeenJson": countries,
                "relatedKeywordsJson": related,
                "score": 0,
                "scoreBreakdownJson": {},
                "signalIds": [signal["id"] for signal in signals],
            }
        )
    return str(write_json(MARKET_TREND_CLUSTERS_PATH, {"clusters": clusters}))


def score_market_trends() -> str:
    signals_payload = read_json(MARKET_TREND_SIGNALS_PATH, {"signals": []})
    signal_by_id = {signal["id"]: signal for signal in signals_payload.get("signals", []) if isinstance(signal, dict)}
    clusters_payload = read_json(MARKET_TREND_CLUSTERS_PATH, {"clusters": []})
    clusters = []
    for cluster in clusters_payload.get("clusters", []):
        if not isinstance(cluster, dict):
            continue
        signals = [signal_by_id[signal_id] for signal_id in cluster.get("signalIds", []) if signal_id in signal_by_id]
        breakdown = trend_score_breakdown(signals, cluster)
        clusters.append({**cluster, "score": trend_score_from_breakdown(breakdown), "scoreBreakdownJson": breakdown, "status": "scored"})
    clusters.sort(key=lambda item: item["score"], reverse=True)
    report = {"clusters": clusters, "crossMarketPatterns": cross_market_patterns(clusters), "generatedAt": now()}
    write_json(MARKET_TREND_CLUSTERS_PATH, {"clusters": clusters})
    return str(write_json(MARKET_TREND_REPORT_PATH, report))


def generate_trend_keywords(cluster_id: str | None = None) -> str:
    clusters = read_json(MARKET_TREND_CLUSTERS_PATH, {"clusters": []}).get("clusters", [])
    keywords = []
    for cluster in clusters:
        if not isinstance(cluster, dict) or (cluster_id and cluster.get("id") != cluster_id):
            continue
        base_keywords = [cluster["canonicalTopic"], *cluster.get("relatedKeywordsJson", [])]
        for index, keyword in enumerate(dict.fromkeys(base_keywords), start=1):
            keyword_id_source = f"{cluster['id']} {keyword}"
            keywords.append(
                {
                    "id": f"trend-keyword-{slugify(keyword_id_source)}",
                    "clusterId": cluster["id"],
                    "market": cluster["market"],
                    "language": cluster["language"],
                    "keyword": keyword,
                    "searchIntentGuess": infer_intent(keyword, cluster.get("category", "")),
                    "priorityScore": round(float(cluster.get("score") or 0) - index * 1.5, 2),
                    "serpStatus": "pending",
                    "status": "serp_pending",
                }
            )
    return str(write_json(MARKET_TREND_KEYWORDS_PATH, {"keywords": keywords}))


def trend_report(market: str | None = None) -> str:
    payload = read_json(MARKET_TREND_REPORT_PATH, {"clusters": [], "crossMarketPatterns": []})
    if market:
        clusters = [cluster for cluster in payload.get("clusters", []) if isinstance(cluster, dict) and cluster.get("market") == market]
        return str(write_json(DATA / "exports" / f"trend_report_{market}.json", {"market": market, "clusters": clusters}))
    return str(write_json(MARKET_TREND_REPORT_PATH, payload))


def clean(value: Any) -> str:
    return str(value or "").strip()


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
