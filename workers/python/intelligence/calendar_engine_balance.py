from __future__ import annotations

from typing import Any

TOPICAL_BALANCE_LIMITS = {
    "maxUnrelatedTrendPostsPerWeek": 2,
    "maxHealthSensitivePostsPerWeek": 1,
    "maxDealPostsPerWeek": 0,
    "minimumEvergreenSupportingPostsPerTrendCluster": 1,
}


def category_counts(clusters: list[dict[str, Any]]) -> dict[str, int]:
    categories: dict[str, int] = {}
    for cluster in clusters:
        categories[str(cluster.get("category"))] = categories.get(str(cluster.get("category")), 0) + 1
    return categories


def topical_balance_summary(clusters: list[dict[str, Any]]) -> dict[str, Any]:
    return {"categories": category_counts(clusters), **TOPICAL_BALANCE_LIMITS}
