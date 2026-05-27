from __future__ import annotations

import unittest
from unittest.mock import patch

from workers.python.intelligence import search_console_feedback
from workers.python.intelligence.search_console_feedback_inputs import search_console_rows
from workers.python.intelligence.search_console_localization_candidates import localization_improvement_candidates
from workers.python.intelligence.search_console_offer_candidates import offer_replacement_candidates
from workers.python.intelligence.search_console_suggestion_builder import suggest_for_row


class SearchConsoleFeedbackModulesTest(unittest.TestCase):
    def test_legacy_feedback_module_reexports_split_helpers(self) -> None:
        self.assertIs(search_console_feedback._offer_replacement_candidates, offer_replacement_candidates)
        self.assertIs(search_console_feedback._localization_improvement_candidates, localization_improvement_candidates)
        self.assertIs(search_console_feedback._suggest_for_row, suggest_for_row)

    def test_offer_candidates_rank_overlap_and_health_merchant_fit(self) -> None:
        candidates = offer_replacement_candidates(
            ["magnesium", "sleep"],
            [
                {"id": "p1", "offerId": "offer-1", "merchantSlug": "aliexpress", "anchorText": "USB charger", "offerScore": 95},
                {"id": "p2", "offerId": "offer-2", "merchantSlug": "iherb", "anchorText": "supplement pick", "offerScore": 60},
                {"id": "p3", "offerId": "offer-3", "merchantSlug": "iherb", "anchorText": "magnesium sleep", "offerScore": 80},
            ],
        )

        self.assertEqual([candidate["placementCandidateId"] for candidate in candidates], ["p3", "p2"])
        self.assertEqual(candidates[0]["refreshScore"], 90)

    def test_localization_candidates_deduplicate_and_skip_same_locale(self) -> None:
        candidates = localization_improvement_candidates(
            "/en/reviews/usb-c-charger/",
            "en",
            scores=[
                {"locale": "en", "articleId": "article-usb-c-charger-en", "localizationDepthScore": 30},
                {"locale": "es", "articleId": "article-usb-c-charger-es", "localizationDepthScore": 65},
                {"locale": "pt-br", "articleId": "article-usb-c-charger-pt-br", "localizationDepthScore": 92},
            ],
            localized_articles=[
                {"locale": "es", "id": "article-usb-c-charger-es", "slug": "usb-c-charger", "topicId": "topic-usb-c", "localizationDepthScore": 50},
                {"locale": "ja", "id": "article-usb-c-charger-ja", "slug": "usb-c-charger", "topicId": "topic-usb-c", "localizationDepthScore": 45},
            ],
        )

        self.assertEqual([candidate["locale"] for candidate in candidates], ["es", "ja"])

    def test_suggestion_builder_adds_comparison_and_health_guardrail_actions(self) -> None:
        suggestion = suggest_for_row(
            {
                "page": "/en/ingredients/magnesium-sleep/",
                "query": "magnesium dosage sleep",
                "impressions": 200,
                "ctr": 0.01,
                "position": 12,
            },
            [],
        )

        self.assertEqual(suggestion["health_claim_risk"]["riskLevel"], "high")
        self.assertIn("Run HealthClaimGuard review", " ".join(suggestion["action"]))

    def test_input_loader_prefers_real_rows_over_sample_rows(self) -> None:
        def fake_read_json(path: object, default: object) -> object:
            if str(path).endswith("search_console_rows.json"):
                return [{"query": "real"}]
            return [{"query": "sample"}]

        with patch("workers.python.intelligence.search_console_feedback_inputs.read_json", side_effect=fake_read_json):
            self.assertEqual(search_console_rows(), [{"query": "real"}])


if __name__ == "__main__":
    unittest.main()
