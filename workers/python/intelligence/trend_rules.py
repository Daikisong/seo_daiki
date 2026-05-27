from __future__ import annotations

from collections import defaultdict
from statistics import mean
from typing import Any


def normalize_keyword(value: str) -> str:
    return " ".join(str(value).lower().replace("-", " ").split())


def market_from_country(country: str) -> str:
    return country.lower() if country else "us"


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


def content_opportunity(cluster: dict[str, Any], signals: list[dict[str, Any]]) -> float:
    keyword_count = len({signal.get("normalizedKeyword") for signal in signals})
    base = 55 + keyword_count * 8 + float(cluster.get("signalCount") or 0) * 4
    return min(100, base)


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


def trend_score_from_breakdown(breakdown: dict[str, float]) -> float:
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
    return max(0, score_value)


def cross_market_patterns(clusters: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_topic: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for cluster in clusters:
        by_topic[topic_signature(str(cluster.get("canonicalTopic")))].append(cluster)
    patterns = []
    for topic, rows in sorted(by_topic.items()):
        markets = sorted({str(row.get("market")) for row in rows})
        languages = sorted({str(row.get("language")) for row in rows if row.get("language")})
        if len(markets) >= 4:
            classification = "global trend"
            pattern_type = "global_trend"
        elif len(markets) >= 2:
            classification = "regional trend"
            pattern_type = "regional_trend"
        else:
            classification = "local-only trend"
            pattern_type = "local_only_trend"
        patterns.append(
            {
                "topic": topic,
                "type": pattern_type,
                "markets": markets,
                "languages": languages,
                "classification": classification,
                "reason": f"{len(markets)} market(s) currently show signal.",
                "laggingMarketOpportunity": len(markets) >= 2,
                "crossLanguageSynonymCluster": len(languages) >= 2,
            }
        )
    return patterns


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
