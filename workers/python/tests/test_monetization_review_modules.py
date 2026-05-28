from __future__ import annotations

import unittest

from workers.python.intelligence import monetization_review
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


class MonetizationReviewModulesTest(unittest.TestCase):
    def test_facade_reexports_split_helpers_and_paths(self) -> None:
        self.assertIs(monetization_review.monetization_review_records, monetization_review_records)
        self.assertIs(monetization_review.monetized_placement_payload, monetized_placement_payload)
        self.assertIs(monetization_review.monetization_apply_payload, monetization_apply_payload)
        self.assertEqual(monetization_review.PRODUCT_ANALYSIS_PATH, PRODUCT_ANALYSIS_PATH)
        self.assertEqual(monetization_review.MONETIZATION_REVIEWS_PATH, MONETIZATION_REVIEWS_PATH)
        self.assertEqual(monetization_review.MONETIZED_PLACEMENTS_PATH, MONETIZED_PLACEMENTS_PATH)
        self.assertEqual(monetization_review.MONETIZATION_APPLY_REPORT_PATH, MONETIZATION_APPLY_REPORT_PATH)

    def test_review_record_requires_human_review_and_filters_by_article(self) -> None:
        analysis = {"id": "analysis-1", "articleId": "article 1", "market": "us", "language": "en"}

        self.assertTrue(analysis_matches_article(analysis, "article 1"))
        self.assertFalse(analysis_matches_article(analysis, "other"))

        record = monetization_review_record(analysis, "created", "updated")
        self.assertEqual(record["id"], "monetization-review-article-1")
        self.assertEqual(record["status"], "pending_human_review")
        self.assertEqual(record["approvedCandidateIdsJson"], [])
        self.assertEqual(record["rejectedCandidateIdsJson"], [])
        self.assertIn("Human must verify", record["reviewerNotes"])

    def test_review_records_use_timestamp_factory_and_skip_bad_rows(self) -> None:
        timestamps = iter(["created-1", "updated-1", "created-2", "updated-2"])
        records = monetization_review_records(
            [
                {"id": "analysis-1", "articleId": "article-1", "market": "us", "language": "en"},
                "bad-row",
                {"id": "analysis-2", "articleId": "article-2", "market": "es", "language": "es"},
            ],
            None,
            lambda: next(timestamps),
        )

        self.assertEqual([record["articleId"] for record in records], ["article-1", "article-2"])
        self.assertEqual(records[0]["createdAt"], "created-1")
        self.assertEqual(records[0]["updatedAt"], "updated-1")

    def test_placement_drafts_block_until_candidates_are_human_approved(self) -> None:
        pending_review = {"id": "review-1", "status": "pending_human_review"}

        self.assertFalse(review_allows_placement_drafts(pending_review))
        self.assertEqual(blocked_placement_record(pending_review)["reason"], "Human approval required before monetized placement drafts.")
        placements, blocked = placement_drafts_for_review(pending_review, {}, lambda: "now")
        self.assertEqual(placements, [])
        self.assertEqual(blocked[0]["status"], "blocked")

    def test_placement_drafts_include_only_approved_candidates_with_sponsored_rel(self) -> None:
        review = {
            "id": "review-1",
            "articleId": "article-1",
            "status": "approved_candidates",
            "productAnalysisId": "analysis-1",
            "approvedCandidateIdsJson": ["candidate-1"],
        }
        analysis_by_id = {
            "analysis-1": {
                "candidatesJson": [
                    {"id": "candidate-1", "title": "Magnesium", "sourceMerchant": "iherb"},
                    {"id": "candidate-2", "title": "USB charger", "sourceMerchant": "amazon"},
                ]
            }
        }

        self.assertEqual(approved_candidate_ids(review), {"candidate-1"})
        placements, blocked = placement_drafts_for_review(review, analysis_by_id, lambda: "2026-05-28T00:00:00+00:00")

        self.assertEqual(blocked, [])
        self.assertEqual(len(placements), 1)
        self.assertEqual(placements[0]["candidateId"], "candidate-1")
        self.assertEqual(placements[0]["rel"], "sponsored nofollow")
        self.assertEqual(placements[0]["status"], "draft")

        direct = placement_draft_record(review, analysis_by_id["analysis-1"]["candidatesJson"][0], "now")
        self.assertEqual(direct["id"], "placement-draft-review-1-candidate-1")

    def test_placement_payload_filters_reviews_and_keeps_block_report(self) -> None:
        reviews = [
            {"id": "review-1", "status": "pending_human_review", "productAnalysisId": "analysis-1"},
            {
                "id": "review-2",
                "articleId": "article-2",
                "status": "final_approved",
                "productAnalysisId": "analysis-1",
                "approvedCandidateIdsJson": ["candidate-1"],
            },
        ]
        analyses = [{"id": "analysis-1", "candidatesJson": [{"id": "candidate-1", "title": "Candidate"}]}]

        all_payload = monetized_placement_payload(reviews, analyses, None, lambda: "now")
        filtered_payload = monetized_placement_payload(reviews, analyses, "review-2", lambda: "now")

        self.assertEqual(len(all_payload["blocked"]), 1)
        self.assertEqual(len(all_payload["placements"]), 1)
        self.assertEqual(filtered_payload["blocked"], [])
        self.assertEqual(filtered_payload["placements"][0]["articleId"], "article-2")

    def test_apply_payload_requires_final_human_approval(self) -> None:
        pending = {"id": "review-1", "status": "approved_candidates"}
        final = {"id": "review-2", "status": "final_approved"}

        self.assertEqual(monetization_apply_result(pending)["status"], "not_applied")
        self.assertEqual(monetization_apply_result(final)["status"], "ready_for_manual_apply")
        self.assertEqual(monetization_apply_result(final)["relEnforced"], "sponsored nofollow")

        payload = monetization_apply_payload([pending, final, "bad-row"], None)
        self.assertEqual([result["status"] for result in payload["results"]], ["not_applied", "ready_for_manual_apply"])
        filtered = monetization_apply_payload([pending, final], "review-2")
        self.assertEqual(filtered["results"][0]["reviewId"], "review-2")


if __name__ == "__main__":
    unittest.main()
