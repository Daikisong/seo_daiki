from __future__ import annotations

from collections import defaultdict
from typing import Any

from workers.python.intelligence.trend_normalization_rules import topic_signature


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
