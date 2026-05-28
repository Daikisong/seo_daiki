from __future__ import annotations

from datetime import datetime, timezone

from workers.python.common import read_json, write_json
from workers.python.intelligence.monetization_review_apply import monetization_apply_payload, monetization_apply_result
from workers.python.intelligence.monetization_review_paths import (
    MONETIZATION_APPLY_REPORT_PATH,
    MONETIZATION_REVIEWS_PATH,
    MONETIZED_PLACEMENTS_PATH,
    PRODUCT_ANALYSIS_PATH,
)
from workers.python.intelligence.monetization_review_placements import (
    approved_candidate_ids,
    blocked_placement_record,
    monetized_placement_payload,
    placement_draft_record,
    placement_drafts_for_review,
    review_allows_placement_drafts,
)
from workers.python.intelligence.monetization_review_records import (
    analysis_matches_article,
    monetization_review_record,
    monetization_review_records,
)


def create_monetization_review(article_id: str | None = None) -> str:
    analyses = read_json(PRODUCT_ANALYSIS_PATH, {"analyses": []}).get("analyses", [])
    reviews = monetization_review_records(analyses, article_id, now)
    return str(write_json(MONETIZATION_REVIEWS_PATH, {"reviews": reviews}))


def draft_monetized_placements(review_id: str | None = None) -> str:
    reviews = read_json(MONETIZATION_REVIEWS_PATH, {"reviews": []}).get("reviews", [])
    analyses = read_json(PRODUCT_ANALYSIS_PATH, {"analyses": []}).get("analyses", [])
    return str(write_json(MONETIZED_PLACEMENTS_PATH, monetized_placement_payload(reviews, analyses, review_id, now)))


def apply_approved_monetization(review_id: str | None = None) -> str:
    reviews = read_json(MONETIZATION_REVIEWS_PATH, {"reviews": []}).get("reviews", [])
    return str(write_json(MONETIZATION_APPLY_REPORT_PATH, monetization_apply_payload(reviews, review_id)))


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
