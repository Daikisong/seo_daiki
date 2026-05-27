from __future__ import annotations

from difflib import SequenceMatcher
from typing import Any

from workers.python.intelligence.product_identity_values import jaccard, set_value, string_value


def identity_score(left: dict[str, Any], right: dict[str, Any]) -> dict[str, Any]:
    title_similarity = SequenceMatcher(
        None,
        string_value(left.get("_title_normalized")),
        string_value(right.get("_title_normalized")),
    ).ratio()
    image_hash = 1.0 if left.get("_image_fingerprint") and left.get("_image_fingerprint") == right.get("_image_fingerprint") else 0.0
    brand_token = 1.0 if left.get("_brand_token") and left.get("_brand_token") == right.get("_brand_token") else 0.0
    spec_token = jaccard(set_value(left.get("_spec_tokens")), set_value(right.get("_spec_tokens")))
    seller_overlap = jaccard(set_value(left.get("_seller_tokens")), set_value(right.get("_seller_tokens")))
    model_number = jaccard(set_value(left.get("_model_tokens")), set_value(right.get("_model_tokens")))

    confidence = (
        title_similarity * 0.3
        + image_hash * 0.15
        + brand_token * 0.15
        + spec_token * 0.2
        + seller_overlap * 0.1
        + model_number * 0.1
    )

    if left.get("category") != right.get("category"):
        confidence = min(confidence, 0.49)
    if brand_token == 0:
        confidence = min(confidence, 0.65)

    score_parts = {
        "title_similarity": round(title_similarity, 3),
        "image_hash": round(image_hash, 3),
        "brand_token": round(brand_token, 3),
        "spec_token": round(spec_token, 3),
        "seller_overlap": round(seller_overlap, 3),
        "model_number": round(model_number, 3),
    }
    return {"confidence": round(confidence, 3), "score_parts": score_parts}
