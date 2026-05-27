from __future__ import annotations

from typing import Any

from workers.python.common import slugify
from workers.python.intelligence.product_identity_score_parts import identity_score
from workers.python.intelligence.product_identity_values import list_value, number_value, string_value


def canonical_item(group: list[dict[str, Any]]) -> dict[str, Any]:
    return max(
        group,
        key=lambda item: (
            number_value(item.get("orders")),
            number_value(item.get("rating")),
            -number_value(item.get("price")),
            string_value(item.get("product_id")),
        ),
    )


def group_confidence(group: list[dict[str, Any]]) -> float:
    if len(group) == 1:
        item = group[0]
        signals = [
            bool(item.get("_brand_token")),
            bool(item.get("_spec_tokens")),
            bool(item.get("_image_fingerprint")),
            bool(item.get("seller")),
            bool(item.get("category")),
        ]
        return round(0.58 + sum(signals) * 0.04, 3)

    pair_scores = [
        identity_score(left, right)["confidence"]
        for index, left in enumerate(group)
        for right in group[index + 1 :]
    ]
    return round(sum(pair_scores) / len(pair_scores), 3)


def canonical_slug(item: dict[str, Any]) -> str:
    parts = [
        string_value(item.get("_brand_token")),
        *list_value(item.get("_spec_tokens")),
        string_value(item.get("category")),
    ]
    return slugify(" ".join(part for part in parts if part))
