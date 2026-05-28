from __future__ import annotations

from typing import Any


def monetization_apply_result(review: dict[str, Any]) -> dict[str, Any]:
    if review.get("status") != "final_approved":
        return {
            "reviewId": review.get("id"),
            "status": "not_applied",
            "reason": "Final human approval is required before article revision/link insertion.",
        }
    return {
        "reviewId": review.get("id"),
        "status": "ready_for_manual_apply",
        "relEnforced": "sponsored nofollow",
    }


def monetization_apply_payload(reviews: object, review_id: str | None) -> dict[str, list[dict[str, Any]]]:
    review_rows = reviews if isinstance(reviews, list) else []
    results = []
    for review in review_rows:
        if not isinstance(review, dict) or (review_id and review.get("id") != review_id):
            continue
        results.append(monetization_apply_result(review))
    return {"results": results}
