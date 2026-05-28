from __future__ import annotations

from typing import Any

from workers.python.outreach.link_earning_values import words

LINKABLE_TYPES = {"data", "lab", "methodology", "guide", "compare", "hub", "buyer_guide"}


def best_asset_for_prospect(prospect: dict[str, Any], assets: list[dict[str, Any]]) -> dict[str, Any] | None:
    topic = str(prospect.get("topic", ""))
    candidates = [asset for asset in assets if isinstance(asset, dict)]
    if prospect.get("suggestedAssetId"):
        for asset in candidates:
            if asset.get("id") == prospect.get("suggestedAssetId"):
                return asset
    return max(
        candidates,
        key=lambda asset: topic_overlap(topic, str(asset.get("topic", ""))) + float(asset.get("linkableScore") or 0) / 10,
        default=None,
    )


def original_data_score_for(asset_type: str, topic: str) -> float:
    if asset_type in {"data", "lab", "methodology"}:
        return 90
    if asset_type in {"guide", "compare"} and topic:
        return 72
    return 55


def topical_specificity(value: str) -> float:
    return min(100, max(20, len([part for part in value.split("-") if part]) * 12))


def topic_overlap(left: str, right: str) -> float:
    left_terms = set(words(left))
    right_terms = set(words(right))
    if not left_terms or not right_terms:
        return 35
    return min(100, 40 + len(left_terms & right_terms) * 20)
