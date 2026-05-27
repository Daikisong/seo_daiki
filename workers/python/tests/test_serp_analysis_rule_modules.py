from __future__ import annotations

from collections import Counter
import unittest

from workers.python.serp.analysis_gap_rules import content_gap as direct_content_gap
from workers.python.serp.analysis_gap_rules import inferred_headings as direct_inferred_headings
from workers.python.serp.analysis_gap_rules import missing_angles as direct_missing_angles
from workers.python.serp.analysis_gap_rules import recommended_angle as direct_recommended_angle
from workers.python.serp.analysis_gap_rules import recommended_article_type as direct_recommended_article_type
from workers.python.serp.analysis_gap_rules import top_patterns as direct_top_patterns
from workers.python.serp.analysis_intent_rules import infer_intent as direct_infer_intent
from workers.python.serp.analysis_intent_rules import monetization_pattern as direct_monetization_pattern
from workers.python.serp.analysis_rules import (
    clean,
    content_gap,
    domain_for,
    infer_intent,
    inferred_headings,
    integer,
    missing_angles,
    monetization_pattern,
    recommended_angle,
    recommended_article_type,
    split_list,
    top_patterns,
    truthy,
)
from workers.python.serp.analysis_value_rules import clean as direct_clean
from workers.python.serp.analysis_value_rules import domain_for as direct_domain_for
from workers.python.serp.analysis_value_rules import integer as direct_integer
from workers.python.serp.analysis_value_rules import split_list as direct_split_list
from workers.python.serp.analysis_value_rules import truthy as direct_truthy


class SerpAnalysisRuleModulesTest(unittest.TestCase):
    def test_compatibility_module_reexports_split_serp_analysis_rules(self) -> None:
        self.assertIs(clean, direct_clean)
        self.assertIs(content_gap, direct_content_gap)
        self.assertIs(domain_for, direct_domain_for)
        self.assertIs(infer_intent, direct_infer_intent)
        self.assertIs(inferred_headings, direct_inferred_headings)
        self.assertIs(integer, direct_integer)
        self.assertIs(missing_angles, direct_missing_angles)
        self.assertIs(monetization_pattern, direct_monetization_pattern)
        self.assertIs(recommended_angle, direct_recommended_angle)
        self.assertIs(recommended_article_type, direct_recommended_article_type)
        self.assertIs(split_list, direct_split_list)
        self.assertIs(top_patterns, direct_top_patterns)
        self.assertIs(truthy, direct_truthy)

    def test_split_modules_keep_intent_gap_and_value_behavior(self) -> None:
        rows = [{"productLinksPresent": True, "originalDataPresent": False, "missingAnglesJson": ["freshness signal"]}]

        self.assertEqual(direct_infer_intent("Best magnesium vs glycinate", ""), "comparison")
        self.assertEqual(direct_domain_for("https://example.com/post"), "example.com")
        self.assertEqual(direct_split_list("one|two; three"), ["one", "two", "three"])
        self.assertIn("Safety and evidence limits", direct_inferred_headings({"title": "Gut health guide", "snippet": ""}))
        self.assertEqual(direct_content_gap(rows)["missingAngles"], ["freshness signal"])
        self.assertIn("Product-card monetization appears", direct_top_patterns(rows)[0])
        self.assertEqual(direct_recommended_article_type(Counter({"commercial": 1}), Counter()), "buyer_intent_test_post")


if __name__ == "__main__":
    unittest.main()
