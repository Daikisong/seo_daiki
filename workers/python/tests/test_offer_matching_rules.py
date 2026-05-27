from __future__ import annotations

import unittest

from workers.python.intelligence.offer_matching_rules import (
    category_allowed_for_aliexpress,
    compliance_fit,
    offer_from_row,
    offer_is_eligible,
    placement_type_for,
    price_freshness,
    score_offer,
    synthetic_brief_for_topic,
    topical_fit,
    words,
)


class OfferMatchingRulesTest(unittest.TestCase):
    def test_offer_from_row_normalizes_csv_fields(self) -> None:
        offer = offer_from_row({
            "merchant_slug": "aliexpress",
            "title": "  65W GaN Charger  ",
            "category": "usb-c-chargers",
            "health_sensitive": "false",
            "price": "19.5",
        })

        self.assertEqual(offer["id"], "offer-65w-gan-charger")
        self.assertEqual(offer["title"], "65W GaN Charger")
        self.assertEqual(offer["status"], "active")
        self.assertEqual(offer["price"], 19.5)
        self.assertFalse(offer["healthSensitive"])

    def test_health_sensitive_topics_allow_only_guarded_iherb_offers(self) -> None:
        topic = {"healthSensitive": True, "slug": "magnesium", "id": "topic-1"}
        guarded_brief = {
            "healthSensitivity": "medium",
            "merchantFitJson": {"requiresHealthClaimGuard": True},
            "requiredEvidence": ["health disclaimer", "label source"],
        }
        missing_disclaimer = {**guarded_brief, "requiredEvidence": ["label source"]}
        iherb = {"status": "active", "merchantSlug": "iherb", "healthSensitive": True, "category": "supplements"}
        aliexpress = {"status": "active", "merchantSlug": "aliexpress", "healthSensitive": False, "category": "usb-c-chargers"}

        self.assertTrue(offer_is_eligible(topic, guarded_brief, iherb))
        self.assertFalse(offer_is_eligible(topic, guarded_brief, aliexpress))
        self.assertFalse(offer_is_eligible(topic, missing_disclaimer, iherb))

    def test_non_health_topics_reject_iherb_and_bad_aliexpress_categories(self) -> None:
        topic = {"healthSensitive": False}
        brief = {"healthSensitivity": "none"}

        self.assertFalse(offer_is_eligible(topic, brief, {"status": "active", "merchantSlug": "iherb", "category": "supplements"}))
        self.assertFalse(offer_is_eligible(topic, brief, {"status": "active", "merchantSlug": "aliexpress", "category": "fashion"}))
        self.assertTrue(offer_is_eligible(topic, brief, {"status": "active", "merchantSlug": "aliexpress", "category": "desk-gadget"}))
        self.assertFalse(category_allowed_for_aliexpress("fashion"))
        self.assertTrue(category_allowed_for_aliexpress("usb-c-chargers"))

    def test_score_offer_weights_relevance_locale_evidence_and_compliance(self) -> None:
        topic = {"canonicalTopic": "usb c charger", "intent": "commercial", "healthSensitive": False}
        brief = {"titleCandidate": "Best USB C charger", "searchIntent": "comparison", "locale": "en", "healthSensitivity": "none"}
        offer = {
            "merchantSlug": "aliexpress",
            "title": "USB C GaN charger",
            "description": "compact charger",
            "category": "usb-c-chargers",
            "locale": "en",
            "evidenceLevel": "verified_product",
            "lastCheckedAt": "2026-05-27",
            "healthSensitive": False,
        }

        scored = score_offer(topic, brief, offer)
        self.assertGreater(scored["offerScore"], 80)
        self.assertEqual(scored["scoreBreakdown"]["localeFit"], 100)
        self.assertEqual(scored["scoreBreakdown"]["priceFreshness"], 90)
        self.assertEqual(scored["scoreBreakdown"]["complianceFit"], 85)

    def test_placement_types_and_synthetic_briefs_are_stable(self) -> None:
        self.assertEqual(placement_type_for("deal_watch", 1), "cta")
        self.assertEqual(placement_type_for("deal_watch", 2), "comparison_table")
        self.assertEqual(placement_type_for("ingredient_guide", 1), "ingredient_card")
        self.assertEqual(placement_type_for("trend", 2), "inline")

        brief = synthetic_brief_for_topic({
            "id": "topic-health",
            "slug": "magnesium-sleep",
            "canonicalTopic": "magnesium sleep",
            "intent": "health",
            "primaryLocale": "en",
            "healthSensitive": True,
        })
        self.assertEqual(brief["articleType"], "ingredient_guide")
        self.assertEqual(brief["healthSensitivity"], "medium")
        self.assertTrue(brief["merchantFitJson"]["requiresHealthClaimGuard"])
        self.assertIn("health disclaimer", brief["requiredEvidence"])

    def test_low_level_helpers_cover_fallbacks(self) -> None:
        self.assertEqual(price_freshness({"lastCheckedAt": "2026-05-01"}), 90)
        self.assertEqual(price_freshness({"lastCheckedAt": "2025-12-01"}), 45)
        self.assertEqual(price_freshness({}), 20)
        self.assertEqual(compliance_fit({"healthSensitive": True}, {}, {"merchantSlug": "aliexpress"}), 0)
        self.assertEqual(topical_fit({}, {}, {"category": "supplements", "title": "", "description": ""}), 62)
        self.assertEqual(words("USB-C charger 100W"), ["charger", "100w"])


if __name__ == "__main__":
    unittest.main()
