from __future__ import annotations

import unittest

from workers.python.intelligence.search_console_rules import (
    _article_type_from_path,
    _health_claim_risk,
    _internal_link_candidates,
    _is_refresh_candidate,
    _match_query_to_page_sections,
    _missing_section,
    _needs_comparison_table,
    _priority,
    _terms,
    _title_candidate,
)


class SearchConsoleRulesTest(unittest.TestCase):
    def test_refresh_candidate_thresholds(self) -> None:
        self.assertTrue(_is_refresh_candidate({"impressions": 120, "ctr": 0.01, "position": 12}))
        self.assertFalse(_is_refresh_candidate({"impressions": 99, "ctr": 0.01, "position": 12}))
        self.assertFalse(_is_refresh_candidate({"impressions": 120, "ctr": 0.03, "position": 12}))
        self.assertFalse(_is_refresh_candidate({"impressions": 120, "ctr": 0.01, "position": 40}))

    def test_terms_strip_stopwords_but_keep_claim_numbers(self) -> None:
        self.assertEqual(_terms("Why is my 65W USB-C charger not charging?"), ["65w", "usb", "charger", "not", "charging"])

    def test_article_type_from_localized_paths(self) -> None:
        self.assertEqual(_article_type_from_path("/es/resenas/charger/"), "review")
        self.assertEqual(_article_type_from_path("/pt-br/guias-de-compra/power-bank/"), "buyer_guide")
        self.assertEqual(_article_type_from_path("/en/ingredients/magnesium/"), "ingredient_guide")

    def test_section_match_uses_inventory_cluster(self) -> None:
        match = _match_query_to_page_sections(
            "/en/guides/charger/",
            ["65w", "charger", "variant"],
            [{"path": "/en/guides/charger/", "type": "guide", "cluster": "65w charger variant traps"}],
        )
        self.assertGreaterEqual(match["score"], 0.66)
        self.assertIn("variant", match["matched_terms"])

    def test_missing_section_prioritizes_fake_wattage(self) -> None:
        section = _missing_section(
            "fake 65w charger",
            ["fake", "65w"],
            {"score": 0.2},
        )
        self.assertEqual(section["heading"], "How to spot fake wattage claims before buying")
        self.assertEqual(section["intent"], "problem_check")
        self.assertIn("move this answer above lower-priority background sections", section["recommended_details"])

    def test_internal_link_candidates_score_and_diversify(self) -> None:
        candidates = _internal_link_candidates(
            "/en/guides/charger/",
            "en",
            ["65w", "charger", "fake"],
            [
                {"locale": "en", "status": "index_candidate", "path": "/en/data/charger-65w/", "type": "data", "cluster": "65w charger"},
                {"locale": "en", "status": "index_candidate", "path": "/en/lab/charger-test/", "type": "lab", "cluster": "charger test"},
                {"locale": "es", "status": "index_candidate", "path": "/es/data/charger-65w/", "type": "data", "cluster": "65w charger"},
            ],
        )
        self.assertEqual([candidate["type"] for candidate in candidates[:2]], ["data", "lab"])
        self.assertGreater(candidates[0]["score"], 0)

    def test_health_claim_risk_and_comparison_need(self) -> None:
        risk = _health_claim_risk("/en/ingredients/magnesium/", ["magnesium", "dosage"], {"article_type": "ingredient_guide"})
        self.assertEqual(risk["riskLevel"], "high")
        self.assertTrue(_needs_comparison_table(["65w"]))

    def test_title_and_priority_are_bounded_inputs(self) -> None:
        title = _title_candidate("/en/guides/charger/", "aliexpress usb 65w charger not charging")
        self.assertLessEqual(len(title), 68)
        self.assertIn("AliExpress", title)
        priority = _priority({"impressions": 200, "ctr": 0.01, "position": 12}, ["fake"], [{"path": "/en/data/x"}], {"score": 0.25})
        self.assertGreater(priority, 0)


if __name__ == "__main__":
    unittest.main()
