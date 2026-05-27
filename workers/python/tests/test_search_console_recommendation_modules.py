from __future__ import annotations

import unittest

from workers.python.intelligence import search_console_recommendation_rules
from workers.python.intelligence.search_console_recommendation_health_rules import _health_claim_risk
from workers.python.intelligence.search_console_recommendation_intent_rules import (
    _intent_for_query,
    _needs_comparison_table,
    _recommended_details,
)
from workers.python.intelligence.search_console_recommendation_priority_rules import _priority
from workers.python.intelligence.search_console_recommendation_section_rules import _missing_section
from workers.python.intelligence.search_console_recommendation_title_rules import (
    _meta_candidate,
    _title_candidate,
    _title_word,
    _truncate,
)


class SearchConsoleRecommendationModulesTest(unittest.TestCase):
    def test_legacy_module_reexports_split_helpers(self) -> None:
        self.assertIs(search_console_recommendation_rules._health_claim_risk, _health_claim_risk)
        self.assertIs(search_console_recommendation_rules._intent_for_query, _intent_for_query)
        self.assertIs(search_console_recommendation_rules._meta_candidate, _meta_candidate)
        self.assertIs(search_console_recommendation_rules._missing_section, _missing_section)
        self.assertIs(search_console_recommendation_rules._needs_comparison_table, _needs_comparison_table)
        self.assertIs(search_console_recommendation_rules._priority, _priority)
        self.assertIs(search_console_recommendation_rules._recommended_details, _recommended_details)
        self.assertIs(search_console_recommendation_rules._title_candidate, _title_candidate)
        self.assertIs(search_console_recommendation_rules._title_word, _title_word)
        self.assertIs(search_console_recommendation_rules._truncate, _truncate)

    def test_split_helpers_keep_expected_recommendations(self) -> None:
        self.assertEqual(_intent_for_query(["fake", "65w"]), "problem_check")
        self.assertTrue(_needs_comparison_table(["price"]))
        self.assertIn("AliExpress", _title_candidate("/en/guides/charger/", "aliexpress usb charger"))
        self.assertEqual(_truncate("a" * 70, 20), "aaaaaaaaaaaaaaaaa...")


if __name__ == "__main__":
    unittest.main()
