from __future__ import annotations

import unittest

from workers.python.intelligence.offer_matching_constants import EVIDENCE_LEVEL_SCORE, MERCHANT_TRUST, PLACEMENT_LIMITS
from workers.python.intelligence.offer_matching_fit import category_allowed_for_aliexpress, locale_fit
from workers.python.intelligence.offer_matching_normalization import offer_from_row, synthetic_brief_for_topic
from workers.python.intelligence.offer_matching_policy import offer_is_eligible, placement_type_for
from workers.python.intelligence.offer_matching_scoring import score_offer


class OfferMatchingModulesTest(unittest.TestCase):
    def test_constants_remain_available_to_pipeline(self) -> None:
        self.assertEqual(PLACEMENT_LIMITS["deal_watch"], 6)
        self.assertEqual(MERCHANT_TRUST["iherb"], 82)
        self.assertEqual(EVIDENCE_LEVEL_SCORE["verified_product"], 90)

    def test_normalization_and_fit_modules_are_independent(self) -> None:
        offer = offer_from_row({"title": " USB C charger ", "merchant_slug": "aliexpress", "locale": "en"})
        brief = {"locale": "en"}

        self.assertEqual(offer["id"], "offer-usb-c-charger")
        self.assertEqual(locale_fit(brief, offer), 100)
        self.assertTrue(category_allowed_for_aliexpress("usb-c-chargers"))

    def test_policy_and_scoring_still_defer_to_human_approval(self) -> None:
        topic = {"canonicalTopic": "usb c charger", "intent": "commercial", "healthSensitive": False}
        brief = {"titleCandidate": "USB C charger", "searchIntent": "comparison", "locale": "en", "healthSensitivity": "none"}
        offer = {
            "merchantSlug": "aliexpress",
            "title": "USB C charger",
            "description": "compact travel charger",
            "category": "usb-c-chargers",
            "locale": "en",
            "evidenceLevel": "verified_product",
            "lastCheckedAt": "2026-05-28",
            "status": "active",
            "healthSensitive": False,
        }

        self.assertTrue(offer_is_eligible(topic, brief, offer))
        self.assertEqual(placement_type_for("trend", 1), "card")
        self.assertIn("human approval", score_offer(topic, brief, offer)["reason"])

    def test_synthetic_health_brief_requires_guard(self) -> None:
        brief = synthetic_brief_for_topic({"id": "topic-1", "slug": "magnesium", "healthSensitive": True})

        self.assertEqual(brief["articleType"], "ingredient_guide")
        self.assertTrue(brief["merchantFitJson"]["requiresHealthClaimGuard"])
        self.assertIn("health disclaimer", brief["requiredEvidence"])


if __name__ == "__main__":
    unittest.main()
