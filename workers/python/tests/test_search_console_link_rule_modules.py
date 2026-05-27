from __future__ import annotations

import unittest

from workers.python.intelligence.search_console_link_candidates import (
    _diversify_link_types as direct_diversify_link_types,
)
from workers.python.intelligence.search_console_link_candidates import (
    _internal_link_candidates as direct_internal_link_candidates,
)
from workers.python.intelligence.search_console_link_rules import (
    _anchor_text,
    _diversify_link_types,
    _internal_link_candidates,
    _link_reason,
    _link_score,
    _link_score_breakdown,
)
from workers.python.intelligence.search_console_link_scoring import (
    _link_score as direct_link_score,
)
from workers.python.intelligence.search_console_link_scoring import (
    _link_score_breakdown as direct_link_score_breakdown,
)
from workers.python.intelligence.search_console_link_text import (
    _anchor_text as direct_anchor_text,
)
from workers.python.intelligence.search_console_link_text import (
    _link_reason as direct_link_reason,
)


class SearchConsoleLinkRuleModulesTest(unittest.TestCase):
    def test_compatibility_module_reexports_split_link_rule_functions(self) -> None:
        self.assertIs(_anchor_text, direct_anchor_text)
        self.assertIs(_diversify_link_types, direct_diversify_link_types)
        self.assertIs(_internal_link_candidates, direct_internal_link_candidates)
        self.assertIs(_link_reason, direct_link_reason)
        self.assertIs(_link_score, direct_link_score)
        self.assertIs(_link_score_breakdown, direct_link_score_breakdown)

    def test_split_modules_keep_scoring_text_and_candidate_behavior(self) -> None:
        inventory = [
            {
                "locale": "en",
                "status": "index_candidate",
                "path": "/en/data/charger-65w/",
                "type": "data",
                "cluster": "65w charger evidence",
            },
            {
                "locale": "en",
                "status": "index_candidate",
                "path": "/en/compare/charger-price/",
                "type": "compare",
                "cluster": "charger price",
            },
        ]

        candidates = direct_internal_link_candidates("/en/guides/charger/", "en", ["65w", "price"], inventory)

        self.assertEqual(candidates[0]["anchor"], "verified data table")
        self.assertGreater(candidates[0]["score_breakdown"]["same_claim_score"], 0)
        self.assertIn("original data support", candidates[0]["reason"])
        self.assertEqual(direct_link_score(inventory[0], ["65w", "price"]), candidates[0]["score"])


if __name__ == "__main__":
    unittest.main()
