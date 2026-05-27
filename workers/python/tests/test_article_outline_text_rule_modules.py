from __future__ import annotations

import unittest

from workers.python.writers import article_outline_text_rules
from workers.python.writers.article_outline_evidence_rules import target_index_status, variant_trap_count
from workers.python.writers.article_outline_intent_rules import search_intent
from workers.python.writers.article_outline_link_plan import internal_link_plan
from workers.python.writers.article_outline_title_rules import h1_candidate, meta_description, title_candidate


class ArticleOutlineTextRuleModuleTests(unittest.TestCase):
    def test_legacy_text_rule_module_reexports_split_helpers(self) -> None:
        self.assertIs(article_outline_text_rules.search_intent, search_intent)
        self.assertIs(article_outline_text_rules.title_candidate, title_candidate)
        self.assertIs(article_outline_text_rules.h1_candidate, h1_candidate)
        self.assertIs(article_outline_text_rules.meta_description, meta_description)
        self.assertIs(article_outline_text_rules.target_index_status, target_index_status)
        self.assertIs(article_outline_text_rules.variant_trap_count, variant_trap_count)
        self.assertIs(article_outline_text_rules.internal_link_plan, internal_link_plan)

    def test_title_and_intent_rules_keep_existing_copy(self) -> None:
        self.assertEqual(title_candidate("review", "en", "65W Charger"), "65W Charger Test")
        self.assertEqual(h1_candidate("review", "en", "65W Charger"), "65W Charger: 30-second verdict")
        self.assertEqual(title_candidate("custom", "en", "65W Charger"), "65W Charger Custom")
        self.assertIn("seller claims", meta_description("guide", "en", "65W Charger"))
        self.assertTrue(search_intent("review", "es", "Cargador USB C").startswith("Decidir si"))
        self.assertTrue(search_intent("review", "pt-br", "Carregador USB C").startswith("Decidir se"))

    def test_evidence_and_link_plan_rules_keep_existing_behavior(self) -> None:
        self.assertEqual(
            target_index_status([{"claim_type": "wattage"}], [{"test_type": "load"}], [{"option": "EU"}], [{"country": "US"}]),
            "index_ready",
        )
        self.assertEqual(target_index_status([], [{"test_type": "load"}], [{"option": "EU"}], [{"country": "US"}]), "pending_more_evidence")
        self.assertEqual(variant_trap_count([{"risk_flags": ["plug_mismatch"]}, {"risk_flags": []}, {}]), 1)
        self.assertNotIn("hub", [item["target_type"] for item in internal_link_plan("hub", "chargers")])
        self.assertEqual(internal_link_plan("review", "chargers")[0]["target_type"], "hub")


if __name__ == "__main__":
    unittest.main()
