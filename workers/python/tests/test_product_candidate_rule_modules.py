from __future__ import annotations

import unittest

from workers.python.intelligence import product_candidate_rules
from workers.python.intelligence.product_candidate_analysis_rules import comparison_rows, pros_cons, risk_notes
from workers.python.intelligence.product_candidate_risk_evidence import evidence_needed, risk_score
from workers.python.intelligence.product_candidate_scoring import candidate_score_breakdown, candidate_score_from_breakdown
from workers.python.intelligence.product_candidate_values import clean, score, tokens


class ProductCandidateRuleModuleTests(unittest.TestCase):
    def test_legacy_rules_module_reexports_split_helpers(self) -> None:
        self.assertIs(product_candidate_rules.candidate_score_breakdown, candidate_score_breakdown)
        self.assertIs(product_candidate_rules.candidate_score_from_breakdown, candidate_score_from_breakdown)
        self.assertIs(product_candidate_rules.risk_score, risk_score)
        self.assertIs(product_candidate_rules.evidence_needed, evidence_needed)
        self.assertIs(product_candidate_rules.comparison_rows, comparison_rows)
        self.assertIs(product_candidate_rules.pros_cons, pros_cons)
        self.assertIs(product_candidate_rules.risk_notes, risk_notes)
        self.assertIs(product_candidate_rules.tokens, tokens)
        self.assertIs(product_candidate_rules.score, score)
        self.assertIs(product_candidate_rules.clean, clean)

    def test_scoring_and_value_helpers_keep_existing_behavior(self) -> None:
        self.assertEqual(score("120", 50), 100)
        self.assertEqual(score("-10", 50), 0)
        self.assertEqual(score("bad", 50), 50)
        self.assertEqual(clean("  Candidate  "), "Candidate")
        self.assertEqual(tokens("USB-C GaN charger"), ["charger"])
        self.assertEqual(candidate_score_breakdown({"topic_relevance": "90"})["topic_relevance"], 90)

    def test_analysis_rules_keep_human_review_language(self) -> None:
        candidates = [{"id": "candidate-1", "title": "Magnesium", "sourceMerchant": "iHerb", "reason": "sleep", "riskScore": 72}]

        self.assertEqual(comparison_rows(candidates)[0]["riskLevel"], "high")
        self.assertIn("human verification", pros_cons(candidates)["cons"][0])
        self.assertIn("verify policy and claims", risk_notes(candidates)[0])


if __name__ == "__main__":
    unittest.main()
