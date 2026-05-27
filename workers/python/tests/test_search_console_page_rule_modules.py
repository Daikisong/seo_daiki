from __future__ import annotations

import unittest

from workers.python.intelligence.search_console_page_inventory import (
    _article_type_from_path as direct_article_type_from_path,
)
from workers.python.intelligence.search_console_page_inventory import (
    _inventory_row_for_page as direct_inventory_row_for_page,
)
from workers.python.intelligence.search_console_page_inventory import (
    _locale_from_page as direct_locale_from_page,
)
from workers.python.intelligence.search_console_page_rules import (
    TYPE_BASE_TERMS,
    _article_type_from_path,
    _inventory_row_for_page,
    _is_refresh_candidate,
    _locale_from_page,
    _match_query_to_page_sections,
)
from workers.python.intelligence.search_console_refresh_rules import _is_refresh_candidate as direct_is_refresh_candidate
from workers.python.intelligence.search_console_section_match import (
    TYPE_BASE_TERMS as direct_type_base_terms,
)
from workers.python.intelligence.search_console_section_match import (
    _match_query_to_page_sections as direct_match_query_to_page_sections,
)


class SearchConsolePageRuleModulesTest(unittest.TestCase):
    def test_compatibility_module_reexports_split_page_rule_functions(self) -> None:
        self.assertIs(TYPE_BASE_TERMS, direct_type_base_terms)
        self.assertIs(_article_type_from_path, direct_article_type_from_path)
        self.assertIs(_inventory_row_for_page, direct_inventory_row_for_page)
        self.assertIs(_is_refresh_candidate, direct_is_refresh_candidate)
        self.assertIs(_locale_from_page, direct_locale_from_page)
        self.assertIs(_match_query_to_page_sections, direct_match_query_to_page_sections)

    def test_split_page_modules_keep_refresh_inventory_and_section_behavior(self) -> None:
        inventory = [{"path": "/kr/ko/trends/gut-health/", "type": "trend", "cluster": "gut health signal"}]

        self.assertTrue(direct_is_refresh_candidate({"impressions": 120, "ctr": 0.01, "position": 12}))
        self.assertEqual(direct_locale_from_page("/kr/ko/trends/gut-health/"), "kr")
        self.assertEqual(direct_article_type_from_path("/es/resenas/charger/"), "review")
        self.assertEqual(direct_inventory_row_for_page("/kr/ko/trends/gut-health", inventory), inventory[0])

        section_match = direct_match_query_to_page_sections(
            "/kr/ko/trends/gut-health/",
            ["gut", "health", "signal", "missing"],
            inventory,
        )

        self.assertEqual(section_match["article_type"], "trend")
        self.assertIn("signal", section_match["matched_terms"])
        self.assertIn("missing", section_match["missing_terms"])


if __name__ == "__main__":
    unittest.main()
