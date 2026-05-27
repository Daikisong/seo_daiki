from __future__ import annotations

from typing import Any

from workers.python.intelligence.product_identity_score_parts import identity_score


def duplicate_candidate(source: dict[str, Any], candidate: dict[str, Any]) -> dict[str, Any]:
    score = identity_score(source, candidate)
    decision = "merge_candidate" if score["confidence"] >= 0.78 else "keep_separate"
    if score["score_parts"]["spec_token"] == 0 and source.get("_brand_token") == candidate.get("_brand_token"):
        decision = "same_brand_different_spec"

    return {
        "product_id": candidate.get("product_id"),
        "title": candidate.get("title"),
        "confidence": score["confidence"],
        "decision": decision,
        "score_parts": score["score_parts"],
    }
