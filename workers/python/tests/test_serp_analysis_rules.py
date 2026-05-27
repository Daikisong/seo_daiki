from __future__ import annotations

from collections import Counter
import unittest

from workers.python.serp.analysis_rules import (
    content_gap,
    domain_for,
    inferred_headings,
    infer_intent,
    missing_angles,
    recommended_article_type,
    split_list,
    top_patterns,
)


class SerpAnalysisRulesTest(unittest.TestCase):
    def test_extracts_domain_and_lists(self) -> None:
        self.assertEqual(domain_for("https://example.com/path?q=1"), "example.com")
        self.assertEqual(split_list("a|b; c"), ["a", "b", "c"])

    def test_infers_intent_from_titles(self) -> None:
        self.assertEqual(infer_intent("Best USB-C chargers", ""), "comparison")
        self.assertEqual(infer_intent("USB-C charger price guide", ""), "commercial")
        self.assertEqual(infer_intent("What is magnesium", ""), "informational")

    def test_missing_angles_detects_strategy_gaps(self) -> None:
        gaps = missing_angles({"title": "USB charger guide", "snippet": "Specs overview"}, ["Power"])
        self.assertIn("market-specific guidance", gaps)
        self.assertIn("evidence or verification checklist", gaps)
        self.assertIn("freshness signal", gaps)

    def test_headings_include_safety_for_health_topics(self) -> None:
        headings = inferred_headings({"title": "Gut health basics", "snippet": "probiotic guide"})
        self.assertIn("Safety and evidence limits", headings)

    def test_patterns_and_gap_keep_monetization_deferred(self) -> None:
        rows = [
            {
                "comparisonTablePresent": True,
                "productLinksPresent": True,
                "originalDataPresent": False,
                "missingAnglesJson": ["market notes"],
            }
        ]
        self.assertIn("Product-card monetization appears, but this pipeline defers links", top_patterns(rows))
        self.assertEqual(content_gap(rows)["missingAngles"], ["market notes"])

    def test_recommended_article_type_uses_dominant_intent(self) -> None:
        self.assertEqual(recommended_article_type(Counter({"comparison": 2}), Counter({"article": 1})), "comparison_test_post")
        self.assertEqual(recommended_article_type(Counter({"commercial": 2}), Counter({"article": 1})), "buyer_intent_test_post")


if __name__ == "__main__":
    unittest.main()
