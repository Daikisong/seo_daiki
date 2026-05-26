from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from statistics import mean
from typing import Any

from workers.python.common import DATA, read_csv, read_json, slugify, write_json

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
        score_value = round(
            breakdown["velocityScore"] * 0.22
            + breakdown["sourceCorroborationScore"] * 0.18
            + breakdown["marketSpecificityScore"] * 0.16
            + breakdown["contentOpportunityScore"] * 0.16
            + breakdown["commercialHintScore"] * 0.10
            + breakdown["evidenceHintScore"] * 0.10
            + breakdown["freshnessScore"] * 0.08
            - breakdown["noisePenalty"]
            - breakdown["compliancePenalty"],
            2,
        )
        clusters.append({**cluster, "score": max(0, score_value), "scoreBreakdownJson": breakdown, "status": "scored"})
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


def trend_score_breakdown(signals: list[dict[str, Any]], cluster: dict[str, Any]) -> dict[str, float]:
    source_count = len({str(signal.get("sourceId")) for signal in signals})
    market = str(cluster.get("market"))
    compliance_penalty = 12 if infer_category(str(cluster.get("canonicalTopic"))) in {"health", "wellness"} and market in {"kr", "jp", "de"} else 0
    return {
        "velocityScore": avg(signals, "velocityScore"),
        "sourceCorroborationScore": min(100, 45 + source_count * 20 + len(signals) * 4),
        "marketSpecificityScore": avg(signals, "localeSpecificityScore"),
        "contentOpportunityScore": content_opportunity(cluster, signals),
        "commercialHintScore": avg(signals, "commercialHintScore"),
        "evidenceHintScore": avg(signals, "evidenceHintScore"),
        "freshnessScore": avg(signals, "freshnessScore"),
        "noisePenalty": 8 if len(signals) == 1 and avg(signals, "velocityScore") < 50 else 0,
        "compliancePenalty": compliance_penalty,
    }


def cross_market_patterns(clusters: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_topic: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for cluster in clusters:
        by_topic[topic_signature(str(cluster.get("canonicalTopic")))].append(cluster)
    patterns = []
    for topic, rows in sorted(by_topic.items()):
        markets = sorted({str(row.get("market")) for row in rows})
        if len(markets) >= 4:
            classification = "global trend"
        elif len(markets) >= 2:
            classification = "regional trend"
        else:
            classification = "local-only trend"
        patterns.append(
            {
                "topic": topic,
                "markets": markets,
                "classification": classification,
                "reason": f"{len(markets)} market(s) currently show signal.",
                "laggingMarketOpportunity": len(markets) >= 2,
            }
        )
    return patterns


def cluster_topic(signal: dict[str, Any]) -> str:
    value = str(signal.get("topicRaw") or signal.get("normalizedKeyword") or "").lower()
    replacements = {
        "magnesium sleep": "magnesium sleep",
        "gut health": "gut health",
        "usb c": "usb c charger",
        "usb-c": "usb c charger",
        "power bank": "power bank real capacity",
        "desk gadget": "compact desk gadget",
        "travel adapter": "travel adapter",
        "smartwatch": "budget smartwatch",
        "beauty ingredient": "beauty ingredient",
    }
    for needle, topic in replacements.items():
        if needle in value:
            return topic
    return normalize_keyword(value)


def topic_signature(value: str) -> str:
    words = [word for word in normalize_keyword(value).split() if len(word) > 2]
    return " ".join(words[:4]) or normalize_keyword(value)


def infer_category(value: str) -> str:
    text = value.lower()
    if any(term in text for term in ["magnesium", "gut", "probiotic", "sleep", "wellness"]):
        return "wellness"
    if any(term in text for term in ["beauty", "ingredient", "skin"]):
        return "beauty"
    if any(term in text for term in ["charger", "power bank", "adapter", "gadget", "smartwatch"]):
        return "consumer-tech"
    return "general"


def infer_intent(keyword: str, category: str) -> str:
    text = f"{keyword} {category}".lower()
    if any(term in text for term in ["best", "vs", "compare", "alternative"]):
        return "comparison"
    if any(term in text for term in ["price", "budget", "deal"]):
        return "commercial"
    if any(term in text for term in ["magnesium", "gut", "health", "sleep"]):
        return "informational_health"
    return "informational"


def content_opportunity(cluster: dict[str, Any], signals: list[dict[str, Any]]) -> float:
    keyword_count = len({signal.get("normalizedKeyword") for signal in signals})
    base = 55 + keyword_count * 8 + float(cluster.get("signalCount") or 0) * 4
    return min(100, base)


def normalize_keyword(value: str) -> str:
    return " ".join(str(value).lower().replace("-", " ").split())


def market_from_country(country: str) -> str:
    return country.lower() if country else "us"


def avg(rows: list[dict[str, Any]], key: str) -> float:
    values = [float(row.get(key) or 0) for row in rows]
    return round(mean(values), 2) if values else 0


def score(value: Any) -> float:
    try:
        return max(0, min(100, float(value or 0)))
    except (TypeError, ValueError):
        return 0


def integer(value: Any, fallback: int) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return fallback


def bucket(value: float) -> str:
    if value >= 80:
        return "high"
    if value >= 50:
        return "medium"
    if value > 0:
        return "low"
    return "unknown"


def clean(value: Any) -> str:
    return str(value or "").strip()


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
