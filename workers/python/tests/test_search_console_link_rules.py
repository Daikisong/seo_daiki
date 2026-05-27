from __future__ import annotations

import unittest

from workers.python.intelligence.search_console_link_rules import (
    _anchor_text,
    _diversify_link_types,
    _internal_link_candidates,
    _link_reason,
    _link_score,
    _link_score_breakdown,
)


class SearchConsoleLinkRulesTest(unittest.TestCase):
    def test_score_breakdown_rewards_claim_problem_and_risk_overlap(self) -> None:
        breakdown = _link_score_breakdown(
            {"path": "/en/guides/fake-65w-return-risk/", "type": "guide", "cluster": "charger variant"},
            ["fake", "65w", "return", "charger"],
        )

        self.assertEqual(breakdown["same_locale_score"], 8)
        self.assertEqual(breakdown["same_category_score"], 16)
        self.assertEqual(breakdown["same_claim_score"], 14)
        self.assertEqual(breakdown["same_problem_score"], 14)
        self.assertEqual(breakdown["risk_overlap_score"], 8)
        self.assertGreater(_link_score({"path": "/en/guides/fake-65w-return-risk/", "type": "guide"}, ["fake", "65w"]), 0)

    def test_price_query_rewards_comparison_and_data_pages(self) -> None:
        compare = _link_score_breakdown({"path": "/en/compare/charger-price/", "type": "compare"}, ["price", "charger"])
        lab = _link_score_breakdown({"path": "/en/lab/charger-test/", "type": "lab"}, ["price", "charger"])

        self.assertEqual(compare["alternative_price_band_score"], 8)
        self.assertEqual(lab["alternative_price_band_score"], 0)

    def test_candidate_generation_filters_locale_status_and_current_page(self) -> None:
        candidates = _internal_link_candidates(
            "/en/guides/charger/",
            "en",
            ["charger", "65w"],
            [
                {"locale": "en", "status": "index_candidate", "path": "/en/guides/charger/", "type": "guide", "cluster": "charger"},
                {"locale": "en", "status": "draft", "path": "/en/data/draft/", "type": "data", "cluster": "charger"},
                {"locale": "es", "status": "index_candidate", "path": "/es/data/charger/", "type": "data", "cluster": "charger"},
                {"locale": "en", "status": "index_candidate", "path": "/en/data/charger-65w/", "type": "data", "cluster": "charger"},
            ],
        )

        self.assertEqual(len(candidates), 1)
        self.assertEqual(candidates[0]["path"], "/en/data/charger-65w/")

    def test_diversification_keeps_first_page_of_each_type_before_duplicates(self) -> None:
        diversified = _diversify_link_types(
            [
                {"path": "/en/data/a/", "type": "data"},
                {"path": "/en/data/b/", "type": "data"},
                {"path": "/en/lab/a/", "type": "lab"},
            ]
        )

        self.assertEqual([row["path"] for row in diversified], ["/en/data/a/", "/en/lab/a/", "/en/data/b/"])

    def test_anchor_and_reason_are_stable_by_article_type(self) -> None:
        self.assertEqual(_anchor_text({"type": "data", "cluster": "65w charger"}, ["65w"]), "verified data table")
        self.assertEqual(_anchor_text({"type": "hub", "cluster": "USB-C charger"}, []), "USB-C charger buying hub")
        self.assertIn("original data support", _link_reason("data", {"same_locale_score": 8, "same_category_score": 16}))


if __name__ == "__main__":
    unittest.main()
