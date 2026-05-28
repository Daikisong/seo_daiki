from __future__ import annotations

import unittest

from workers.python.outreach import link_earning_rules
from workers.python.outreach.link_earning_asset_rules import (
    LINKABLE_TYPES,
    best_asset_for_prospect,
    original_data_score_for,
    topic_overlap,
    topical_specificity,
)
from workers.python.outreach.link_earning_outreach_rules import SPAM_RISK_DOMAINS, outreach_body, suggested_angle
from workers.python.outreach.link_earning_suppression_rules import (
    domain_matches,
    is_suppressed,
    normalize_domain,
    suppression_reason,
)
from workers.python.outreach.link_earning_values import clean, numeric, words


class LinkEarningRuleModuleTests(unittest.TestCase):
    def test_legacy_rules_module_reexports_split_helpers(self) -> None:
        self.assertIs(link_earning_rules.LINKABLE_TYPES, LINKABLE_TYPES)
        self.assertIs(link_earning_rules.SPAM_RISK_DOMAINS, SPAM_RISK_DOMAINS)
        self.assertIs(link_earning_rules.best_asset_for_prospect, best_asset_for_prospect)
        self.assertIs(link_earning_rules.original_data_score_for, original_data_score_for)
        self.assertIs(link_earning_rules.topical_specificity, topical_specificity)
        self.assertIs(link_earning_rules.topic_overlap, topic_overlap)
        self.assertIs(link_earning_rules.suggested_angle, suggested_angle)
        self.assertIs(link_earning_rules.outreach_body, outreach_body)
        self.assertIs(link_earning_rules.is_suppressed, is_suppressed)
        self.assertIs(link_earning_rules.suppression_reason, suppression_reason)
        self.assertIs(link_earning_rules.normalize_domain, normalize_domain)
        self.assertIs(link_earning_rules.domain_matches, domain_matches)
        self.assertIs(link_earning_rules.words, words)
        self.assertIs(link_earning_rules.numeric, numeric)
        self.assertIs(link_earning_rules.clean, clean)

    def test_asset_rules_keep_topic_matching_and_scoring_behavior(self) -> None:
        assets = [
            {"id": "asset-a", "topic": "usb charger test", "linkableScore": 80},
            {"id": "asset-b", "topic": "power bank", "linkableScore": 95},
        ]

        self.assertIn("data", LINKABLE_TYPES)
        self.assertEqual(original_data_score_for("data", ""), 90)
        self.assertEqual(topical_specificity("usb-c-charger-real-capacity"), 60)
        self.assertEqual(topic_overlap("usb charger", "usb charger test"), 60)
        self.assertEqual(best_asset_for_prospect({"topic": "usb charger"}, assets), assets[0])

    def test_suppression_rules_normalize_domains_and_match_subdomains(self) -> None:
        entries = [{"email": "", "domain": "paid-links.test", "reason": "spam domain"}]

        self.assertEqual(normalize_domain("https://www.sub.paid-links.test/path"), "sub.paid-links.test")
        self.assertTrue(domain_matches("sub.paid-links.test", "paid-links.test"))
        self.assertEqual(suppression_reason("sub.paid-links.test", "", entries), "spam domain")
        self.assertTrue(is_suppressed("sub.paid-links.test", "", entries))

    def test_outreach_and_value_rules_keep_safe_defaults(self) -> None:
        asset = {"assetType": "data", "url": "/en/data/usb/"}
        body = outreach_body({"topic": "usb charger"}, asset)

        self.assertIn("No paid placement", body)
        self.assertIn("Physical address must be configured", body)
        self.assertIn("paid-links.test", SPAM_RISK_DOMAINS)
        self.assertIn("do not ask for optimized anchor text", suggested_angle({}, asset))
        self.assertEqual(words("USB-C charger data"), ["charger", "data"])
        self.assertEqual(numeric("12.5", 0), 12.5)
        self.assertEqual(numeric("bad", 7), 7)
        self.assertEqual(clean("  source  "), "source")


if __name__ == "__main__":
    unittest.main()
