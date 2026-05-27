from __future__ import annotations

from typing import Any

from workers.python.common import read_json, slugify, write_json
from workers.python.intelligence.market_trend_artifacts import MARKET_TREND_CLUSTERS_PATH, MARKET_TREND_KEYWORDS_PATH
from workers.python.intelligence.trend_rules import infer_intent


def generate_trend_keywords(cluster_id: str | None = None) -> str:
    clusters = read_json(MARKET_TREND_CLUSTERS_PATH, {"clusters": []}).get("clusters", [])
    return str(write_json(MARKET_TREND_KEYWORDS_PATH, {"keywords": trend_keyword_records(clusters, cluster_id)}))


def trend_keyword_records(clusters: list[dict[str, Any]], cluster_id: str | None = None) -> list[dict[str, Any]]:
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
    return keywords
