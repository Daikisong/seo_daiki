from __future__ import annotations

import unittest

from workers.python.writers.content_strategy_rules import (
    article_sections,
    brief_markdown,
    evidence_needed,
    markdown_article,
    section_plan,
    title_for,
)


class ContentStrategyRulesTest(unittest.TestCase):
    def test_section_plan_adds_gaps_and_deferred_product_section(self) -> None:
        plan = section_plan(
            "usb c charger",
            {"contentGapJson": {"missingAngles": ["market-specific guidance"]}},
            [{"comparisonTablePresent": True}],
        )
        headings = [item["heading"] for item in plan]
        self.assertIn("Gaps this test post should fill", headings)
        self.assertIn("Comparison criteria to add later", headings)
        self.assertEqual(headings[-1], "Product candidate analysis pending")

    def test_evidence_needed_prevents_unsupported_claims(self) -> None:
        needs = evidence_needed("magnesium sleep", [{"originalDataPresent": False}])
        self.assertIn("HealthClaimGuard review and conservative evidence sources", needs)
        self.assertIn("Original data or testing plan before claiming superiority", needs)

    def test_title_changes_for_comparison_strategy(self) -> None:
        self.assertEqual(
            title_for("usb c charger", "es", {"recommendedArticleType": "comparison_test_post"}),
            "Usb C Charger: What to Compare Before Choosing in ES",
        )

    def test_article_markdown_and_sections_keep_links_out(self) -> None:
        strategy = {
            "titleStrategy": "USB C Charger",
            "recommendedAngle": "Test angle",
            "sectionPlanJson": [{"heading": "Direct answer", "purpose": "Answer first."}],
        }
        sections = article_sections(strategy)
        article = markdown_article("USB C Charger", sections)
        self.assertIn("No affiliate links", sections[0]["body"])
        self.assertIn("Product candidate analysis pending", article)
        self.assertIn("Product links are forbidden", brief_markdown(strategy))


if __name__ == "__main__":
    unittest.main()
