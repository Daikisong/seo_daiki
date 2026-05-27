from __future__ import annotations

from typing import Any

from workers.python.intelligence.trend_inference_rules import infer_category
from workers.python.intelligence.trend_value_rules import avg


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
