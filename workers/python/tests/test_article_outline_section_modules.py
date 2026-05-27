from __future__ import annotations

import unittest

from workers.python.writers import article_outline_sections
from workers.python.writers.article_outline_evidence_refs import evidence_refs_for_pack
from workers.python.writers.article_outline_section_templates import SECTION_TEMPLATES, sections_for_article


class ArticleOutlineSectionModuleTests(unittest.TestCase):
    def test_legacy_sections_module_reexports_split_helpers(self) -> None:
        self.assertIs(article_outline_sections.SECTION_TEMPLATES, SECTION_TEMPLATES)
        self.assertIs(article_outline_sections.evidence_refs_for_pack, evidence_refs_for_pack)
        self.assertIs(article_outline_sections.sections_for_article, sections_for_article)

    def test_evidence_refs_keep_existing_format(self) -> None:
        refs = evidence_refs_for_pack(
            [{"claim_type": "wattage", "claim_value": "65W"}],
            [{"test_type": "load_test", "result_value": "61W"}],
            [{"option": "EU plug"}],
            [{"current_zone": "wait"}],
            [{"country": "US", "return_risk": "medium"}],
            [{"topic": "heat", "sentiment": "negative"}],
        )

        self.assertEqual(refs["seller_claims"], ["seller_claim:wattage:65W"])
        self.assertEqual(refs["verified_claims"], ["verified_claim:load_test:61W"])
        self.assertEqual(refs["variants"], ["variant:EU plug"])
        self.assertEqual(refs["price_truth"], ["price_truth:wait"])
        self.assertEqual(refs["market_risks"], ["market_risk:US:medium"])
        self.assertEqual(refs["review_signals"], ["review_signal:heat:negative"])

    def test_section_templates_fallback_and_ref_limit(self) -> None:
        evidence_refs = {
            "seller_claims": ["seller:1", "seller:2", "seller:3", "seller:4"],
            "verified_claims": ["verified:1"],
            "price_truth": ["price:1"],
        }
        sections = sections_for_article("custom", "en", evidence_refs)

        self.assertEqual(sections[0]["heading"], "Affiliate disclosure and verdict")
        self.assertEqual(sections[0]["evidence_refs"], ["seller:1", "seller:2", "seller:3", "verified:1", "price:1"])
        self.assertIn("hub", SECTION_TEMPLATES)


if __name__ == "__main__":
    unittest.main()
