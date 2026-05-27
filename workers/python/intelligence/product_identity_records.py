from __future__ import annotations

from typing import Any

from workers.python.intelligence.product_identity_normalization import normalize_candidate
from workers.python.intelligence.product_identity_scoring import (
    canonical_item,
    canonical_slug,
    duplicate_candidate,
    group_confidence,
    identity_score,
)
from workers.python.intelligence.product_identity_values import string_value


def identity_graph_records(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    normalized = [normalize_candidate(item) for item in candidates if isinstance(item, dict)]
    groups = group_candidates(normalized)
    return [identity_group(group, normalized) for group in groups]


def group_candidates(candidates: list[dict[str, Any]]) -> list[list[dict[str, Any]]]:
    groups: list[list[dict[str, Any]]] = []
    for item in sorted(candidates, key=lambda row: string_value(row.get("product_id"))):
        best_group: list[dict[str, Any]] | None = None
        best_score = 0.0
        for group in groups:
            group_score = max(identity_score(item, member)["confidence"] for member in group)
            if group_score > best_score:
                best_group = group
                best_score = group_score

        if best_group is not None and best_score >= 0.78:
            best_group.append(item)
        else:
            groups.append([item])

    return groups


def identity_group(group: list[dict[str, Any]], all_candidates: list[dict[str, Any]]) -> dict[str, Any]:
    canonical = canonical_item(group)
    duplicate_candidates = [
        duplicate_candidate(canonical, candidate)
        for candidate in all_candidates
        if candidate.get("product_id") != canonical.get("product_id")
    ]
    duplicate_candidates = sorted(
        duplicate_candidates,
        key=lambda row: (-float(row["confidence"]), string_value(row["product_id"])),
    )[:5]

    confidence = group_confidence(group)
    return {
        "canonical_slug": canonical_slug(canonical),
        "canonical_product": {
            "product_id": canonical.get("product_id"),
            "title": canonical.get("title"),
            "source_url": canonical.get("source_url"),
            "category": canonical.get("category"),
            "brand_token": canonical.get("_brand_token"),
            "spec_tokens": canonical.get("_spec_tokens"),
            "model_tokens": canonical.get("_model_tokens"),
            "image_fingerprint": canonical.get("_image_fingerprint"),
            "seller": canonical.get("seller"),
        },
        "aliases": [item.get("title") for item in group],
        "source_product_ids": [item.get("product_id") for item in group],
        "duplicate_candidates": duplicate_candidates,
        "identity_signals": {
            "brand_token": canonical.get("_brand_token"),
            "spec_tokens": canonical.get("_spec_tokens"),
            "seller_tokens": canonical.get("_seller_tokens"),
            "image_fingerprint": canonical.get("_image_fingerprint"),
        },
        "confidence": confidence,
    }
