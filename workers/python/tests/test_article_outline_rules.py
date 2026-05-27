from __future__ import annotations

import unittest

from workers.python.writers.article_outline_rules import (
    build_outline_for_pack,
    internal_link_plan,
    search_intent,
    target_index_status,
)


class ArticleOutlineRulesTest(unittest.TestCase):
    def test_complete_review_outline_is_index_ready_and_evidence_backed(self) -> None:
        outline = build_outline_for_pack(sample_pack(), "en", "review")

        self.assertEqual(outline["product_id"], "charger-65w")
        self.assertEqual(outline["target_index_status"], "index_ready")
        self.assertEqual(outline["h1_candidate"], "65W GaN Charger: 30-second verdict")
        self.assertTrue(outline["quality_gate_inputs"]["affiliate_disclosure_required"])
        self.assertEqual(outline["evidence_summary"]["variant_trap_count"], 1)
        self.assertEqual(outline["evidence_summary"]["price_zone"], "normal")
        self.assertIn("seller_claim:wattage:65W", outline["sections"][0]["evidence_refs"])
        self.assertIn("verified_claim:load_test:61W", outline["sections"][0]["evidence_refs"])

    def test_missing_foundational_evidence_blocks_index_ready(self) -> None:
        self.assertEqual(target_index_status([], [{"test_type": "load"}], [{"option": "EU"}], [{"country": "US"}]), "pending_more_evidence")
        self.assertEqual(target_index_status([{"claim_type": "wattage"}], [{"test_type": "load"}], [{"option": "EU"}], []), "pending_more_evidence")

    def test_hub_internal_link_plan_does_not_link_to_itself(self) -> None:
        plan = internal_link_plan("hub", "chargers")

        self.assertNotIn("hub", [item["target_type"] for item in plan])
        self.assertIn("risk", [item["target_type"] for item in plan])
        self.assertIn("compare", [item["target_type"] for item in plan])

    def test_localized_intent_keeps_article_type_rules(self) -> None:
        spanish = search_intent("review", "es", "Cargador USB C")
        portuguese = search_intent("review", "pt-br", "Carregador USB C")

        self.assertTrue(spanish.startswith("Decidir si"))
        self.assertTrue(portuguese.startswith("Decidir se"))
        self.assertIn("checking claims", spanish)
        self.assertIn("checking claims", portuguese)

    def test_unknown_article_type_uses_review_section_template(self) -> None:
        outline = build_outline_for_pack(sample_pack(), "en", "custom")

        self.assertEqual(outline["title_candidate"], "65W GaN Charger Custom")
        self.assertEqual(outline["sections"][0]["heading"], "Affiliate disclosure and verdict")
        self.assertFalse(outline["quality_gate_inputs"]["affiliate_disclosure_required"])


def sample_pack() -> dict[str, object]:
    return {
        "product_id": "charger-65w",
        "product": {"title": "65W GaN Charger", "category": "chargers"},
        "seller_claims": [{"claim_type": "wattage", "claim_value": "65W"}],
        "verified_claims": [{"test_type": "load_test", "result_value": "61W"}],
        "variants": [{"option": "EU plug", "risk_flags": ["plug mismatch"]}],
        "price_truth": [{"current_zone": "normal"}],
        "market_risks": [{"country": "US", "return_risk": "medium"}],
        "review_signals": [{"topic": "heat", "sentiment": "negative"}],
        "forbidden_claims": ["fastest charger"],
    }


if __name__ == "__main__":
    unittest.main()
