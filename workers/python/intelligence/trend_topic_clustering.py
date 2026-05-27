from __future__ import annotations

from collections import Counter
import re
from statistics import mean
from typing import Any

from workers.python.common import slugify
from workers.python.intelligence.trend_topic_values import clean, score

CLUSTER_STOP_WORDS = {"best", "review", "reviews", "buy", "price", "deal", "deals", "vs", "2026"}
EMPTY_SCORE_BREAKDOWN = {
    "growthScore": 0,
    "commercialScore": 0,
    "evidenceFitScore": 0,
    "affiliateFitScore": 0,
    "lowCompetitionScore": 0,
    "freshnessScore": 0,
}


def cluster_key(signal: dict[str, Any]) -> str:
    topic = clean(signal.get("topicRaw")) or clean(signal.get("query"))
    words = [word for word in re.findall(r"[a-z0-9]+", topic.lower()) if word not in CLUSTER_STOP_WORDS]
    return slugify(" ".join(words)) or slugify(topic)


def canonical_topic_for(signals: list[dict[str, Any]]) -> str:
    names = [clean(signal.get("topicRaw")) or clean(signal.get("query")) for signal in signals]
    return Counter(names).most_common(1)[0][0]


def signal_weight(signal: dict[str, Any]) -> float:
    return round((score(signal.get("growthScore")) + score(signal.get("commercialScore")) + score(signal.get("affiliateFitScore"))) / 300, 3)


def score_breakdown(signals: list[dict[str, Any]]) -> dict[str, float]:
    if not signals:
        return EMPTY_SCORE_BREAKDOWN.copy()

    return {
        "growthScore": round(mean(score(item.get("growthScore")) for item in signals), 2),
        "commercialScore": round(mean(score(item.get("commercialScore")) for item in signals), 2),
        "evidenceFitScore": round(mean(score(item.get("evidenceFitScore")) for item in signals), 2),
        "affiliateFitScore": round(mean(score(item.get("affiliateFitScore")) for item in signals), 2),
        "lowCompetitionScore": round(100 - mean(score(item.get("competitionScore")) for item in signals), 2),
        "freshnessScore": round(mean(score(item.get("freshnessScore")) for item in signals), 2),
    }
