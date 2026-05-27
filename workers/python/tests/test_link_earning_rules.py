from __future__ import annotations

import os
import unittest

from workers.python.outreach.link_earning_rules import (
    best_asset_for_prospect,
    domain_matches,
    is_suppressed,
    normalize_domain,
    numeric,
    original_data_score_for,
    outreach_body,
    suggested_angle,
    suppression_reason,
    topic_overlap,
    topical_specificity,
    words,
)


class LinkEarningRulesTest(unittest.TestCase):
    def test_asset_scores_reward_original_data_and_specificity(self) -> None:
        self.assertEqual(original_data_score_for("data", ""), 90)
        self.assertEqual(original_data_score_for("guide", "usb c charger"), 72)
        self.assertEqual(original_data_score_for("trend", ""), 55)
        self.assertEqual(topical_specificity("usb-c-charger-real-capacity"), 60)
        self.assertEqual(topical_specificity(""), 20)

    def test_topic_overlap_handles_empty_and_shared_terms(self) -> None:
        self.assertEqual(topic_overlap("", "usb c charger"), 35)
        self.assertEqual(topic_overlap("power bank real capacity", "real capacity test"), 80)
        self.assertEqual(words("USB-C charger data"), ["charger", "data"])

    def test_best_asset_prefers_explicit_match_then_topic_and_score(self) -> None:
        assets = [
            {"id": "asset-a", "topic": "usb charger", "linkableScore": 80},
            {"id": "asset-b", "topic": "power bank capacity", "linkableScore": 70},
        ]

        self.assertEqual(best_asset_for_prospect({"suggestedAssetId": "asset-b", "topic": "usb charger"}, assets), assets[1])
        self.assertEqual(best_asset_for_prospect({"topic": "usb charger"}, assets), assets[0])
        self.assertIsNone(best_asset_for_prospect({"topic": "usb charger"}, []))

    def test_suppression_matches_email_domain_and_subdomain(self) -> None:
        entries = [
            {"email": "blocked@example.com", "domain": "", "reason": "email opt-out"},
            {"email": "", "domain": "paid-links.test", "reason": "spam domain"},
        ]

        self.assertEqual(normalize_domain("https://www.sub.paid-links.test/path"), "sub.paid-links.test")
        self.assertTrue(domain_matches("sub.paid-links.test", "paid-links.test"))
        self.assertTrue(is_suppressed("allowed.test", "blocked@example.com", entries))
        self.assertTrue(is_suppressed("sub.paid-links.test", "", entries))
        self.assertEqual(suppression_reason("sub.paid-links.test", "", entries), "spam domain")
        self.assertFalse(is_suppressed("publisher.test", "editor@publisher.test", entries))

    def test_suggested_angle_and_body_keep_outreach_safe(self) -> None:
        previous = os.environ.get("OUTREACH_PHYSICAL_ADDRESS")
        os.environ["OUTREACH_PHYSICAL_ADDRESS"] = "123 Example Street"
        try:
            asset = {"assetType": "data", "url": "https://example.com/data", "topic": "usb charger"}
            body = outreach_body({"topic": "usb charger"}, asset)
        finally:
            if previous is None:
                os.environ.pop("OUTREACH_PHYSICAL_ADDRESS", None)
            else:
                os.environ["OUTREACH_PHYSICAL_ADDRESS"] = previous

        self.assertEqual(suggested_angle({}, None), "Manual review required before drafting.")
        self.assertIn("do not ask for optimized anchor text", suggested_angle({}, {"assetType": "data"}))
        self.assertIn("No paid placement or anchor text request", body)
        self.assertIn("123 Example Street", body)

    def test_numeric_falls_back_for_invalid_values(self) -> None:
        self.assertEqual(numeric("12.5", 0), 12.5)
        self.assertEqual(numeric("bad", 7), 7)


if __name__ == "__main__":
    unittest.main()
