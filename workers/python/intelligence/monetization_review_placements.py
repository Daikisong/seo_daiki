from __future__ import annotations

from typing import Any

from workers.python.common import slugify

PLACEMENT_DRAFT_ALLOWED_STATUSES = {"approved_candidates", "final_approved"}


def review_allows_placement_drafts(review: dict[str, Any]) -> bool:
    return review.get("status") in PLACEMENT_DRAFT_ALLOWED_STATUSES


def blocked_placement_record(review: dict[str, Any]) -> dict[str, Any]:
    return {
        "reviewId": review.get("id"),
        "status": "blocked",
        "reason": "Human approval required before monetized placement drafts.",
    }


def approved_candidate_ids(review: dict[str, Any]) -> set[object]:
    return set(review.get("approvedCandidateIdsJson") or [])


def placement_draft_record(review: dict[str, Any], candidate: dict[str, Any], created_at: str) -> dict[str, Any]:
    return {
        "id": f"placement-draft-{slugify(str(review.get('id')))}-{slugify(str(candidate.get('id')))}",
        "articleId": review.get("articleId"),
        "candidateId": candidate.get("id"),
        "merchant": candidate.get("sourceMerchant"),
        "placementType": "analysis_block",
        "anchorText": str(candidate.get("title")),
        "disclosureText": "Sponsored link may be added after final approval.",
        "rel": "sponsored nofollow",
        "status": "draft",
        "createdAt": created_at,
    }


def placement_drafts_for_review(
    review: dict[str, Any],
    analysis_by_id: dict[object, dict[str, Any]],
    timestamp_factory,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    if not review_allows_placement_drafts(review):
        return ([], [blocked_placement_record(review)])

    analysis = analysis_by_id.get(review.get("productAnalysisId"), {})
    approved = approved_candidate_ids(review)
    placements = [
        placement_draft_record(review, candidate, timestamp_factory())
        for candidate in analysis.get("candidatesJson", [])
        if isinstance(candidate, dict) and candidate.get("id") in approved
    ]
    return (placements, [])


def monetized_placement_payload(reviews: object, analyses: object, review_id: str | None, timestamp_factory) -> dict[str, list[dict[str, Any]]]:
    analysis_rows = analyses if isinstance(analyses, list) else []
    review_rows = reviews if isinstance(reviews, list) else []
    analysis_by_id = {analysis.get("id"): analysis for analysis in analysis_rows if isinstance(analysis, dict)}
    placements = []
    blocked = []
    for review in review_rows:
        if not isinstance(review, dict) or (review_id and review.get("id") != review_id):
            continue
        review_placements, review_blocked = placement_drafts_for_review(review, analysis_by_id, timestamp_factory)
        placements.extend(review_placements)
        blocked.extend(review_blocked)
    return {"placements": placements, "blocked": blocked}
