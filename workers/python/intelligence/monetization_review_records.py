from __future__ import annotations

from typing import Any

from workers.python.common import slugify


def analysis_matches_article(analysis: dict[str, Any], article_id: str | None) -> bool:
    return not article_id or analysis.get("articleId") == article_id


def monetization_review_record(analysis: dict[str, Any], created_at: str, updated_at: str) -> dict[str, Any]:
    return {
        "id": f"monetization-review-{slugify(str(analysis.get('articleId')))}",
        "articleId": analysis.get("articleId"),
        "market": analysis.get("market"),
        "language": analysis.get("language"),
        "productAnalysisId": analysis.get("id"),
        "status": "pending_human_review",
        "reviewerNotes": "Human must verify candidates, policies, prices, disclosures, and article fit before links.",
        "approvedCandidateIdsJson": [],
        "rejectedCandidateIdsJson": [],
        "createdAt": created_at,
        "updatedAt": updated_at,
    }


def monetization_review_records(analyses: object, article_id: str | None, timestamp_factory) -> list[dict[str, Any]]:
    analysis_rows = analyses if isinstance(analyses, list) else []
    records = []
    for analysis in analysis_rows:
        if not isinstance(analysis, dict) or not analysis_matches_article(analysis, article_id):
            continue
        records.append(monetization_review_record(analysis, timestamp_factory(), timestamp_factory()))
    return records
