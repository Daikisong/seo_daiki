from __future__ import annotations

from datetime import datetime, timezone

from workers.python.common import DATA, read_json, slugify, write_json

PRODUCT_ANALYSIS_PATH = DATA / "exports" / "product_candidate_analysis.json"
MONETIZATION_REVIEWS_PATH = DATA / "exports" / "monetization_reviews.json"
MONETIZED_PLACEMENTS_PATH = DATA / "exports" / "monetized_placement_drafts.json"


def create_monetization_review(article_id: str | None = None) -> str:
    analyses = read_json(PRODUCT_ANALYSIS_PATH, {"analyses": []}).get("analyses", [])
    reviews = []
    for analysis in analyses:
        if not isinstance(analysis, dict) or (article_id and analysis.get("articleId") != article_id):
            continue
        reviews.append(
            {
                "id": f"monetization-review-{slugify(str(analysis.get('articleId')))}",
                "articleId": analysis.get("articleId"),
                "market": analysis.get("market"),
                "language": analysis.get("language"),
                "productAnalysisId": analysis.get("id"),
                "status": "pending_human_review",
                "reviewerNotes": "Human must verify candidates, policies, prices, disclosures, and article fit before links.",
                "approvedCandidateIdsJson": [],
                "rejectedCandidateIdsJson": [],
                "createdAt": now(),
                "updatedAt": now(),
            }
        )
    return str(write_json(MONETIZATION_REVIEWS_PATH, {"reviews": reviews}))


def draft_monetized_placements(review_id: str | None = None) -> str:
    reviews = read_json(MONETIZATION_REVIEWS_PATH, {"reviews": []}).get("reviews", [])
    analyses = read_json(PRODUCT_ANALYSIS_PATH, {"analyses": []}).get("analyses", [])
    analysis_by_id = {analysis.get("id"): analysis for analysis in analyses if isinstance(analysis, dict)}
    placements = []
    blocked = []
    for review in reviews:
        if not isinstance(review, dict) or (review_id and review.get("id") != review_id):
            continue
        if review.get("status") not in {"approved_candidates", "final_approved"}:
            blocked.append(
                {
                    "reviewId": review.get("id"),
                    "status": "blocked",
                    "reason": "Human approval required before monetized placement drafts.",
                }
            )
            continue
        analysis = analysis_by_id.get(review.get("productAnalysisId"), {})
        approved = set(review.get("approvedCandidateIdsJson") or [])
        for candidate in analysis.get("candidatesJson", []):
            if isinstance(candidate, dict) and candidate.get("id") in approved:
                placements.append(
                    {
                        "id": f"placement-draft-{slugify(str(review.get('id')))}-{slugify(str(candidate.get('id')))}",
                        "articleId": review.get("articleId"),
                        "candidateId": candidate.get("id"),
                        "merchant": candidate.get("sourceMerchant"),
                        "placementType": "analysis_block",
                        "anchorText": str(candidate.get("title")),
                        "disclosureText": "Sponsored link may be added after final approval.",
                        "rel": "sponsored nofollow",
                        "status": "draft",
                        "createdAt": now(),
                    }
                )
    return str(write_json(MONETIZED_PLACEMENTS_PATH, {"placements": placements, "blocked": blocked}))


def apply_approved_monetization(review_id: str | None = None) -> str:
    reviews = read_json(MONETIZATION_REVIEWS_PATH, {"reviews": []}).get("reviews", [])
    results = []
    for review in reviews:
        if not isinstance(review, dict) or (review_id and review.get("id") != review_id):
            continue
        if review.get("status") != "final_approved":
            results.append(
                {
                    "reviewId": review.get("id"),
                    "status": "not_applied",
                    "reason": "Final human approval is required before article revision/link insertion.",
                }
            )
        else:
            results.append(
                {
                    "reviewId": review.get("id"),
                    "status": "ready_for_manual_apply",
                    "relEnforced": "sponsored nofollow",
                }
            )
    return str(write_json(DATA / "exports" / "monetization_apply_report.json", {"results": results}))


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
