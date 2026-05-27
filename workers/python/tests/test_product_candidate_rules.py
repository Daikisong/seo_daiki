from __future__ import annotations

import unittest

from workers.python.intelligence.product_candidate_rules import (
    candidate_score_breakdown,
    candidate_score_from_breakdown,
    comparison_rows,
    evidence_needed,
    risk_score,
    tokens,
)


class ProductCandidateRulesTest(unittest.TestCase):
    def test_candidate_score_formula_is_bounded_and_predictable(self) -> None:
        parts = {
            "topic_relevance": 100,
            "user_problem_fit": 100,
            "market_availability": 100,
            "comparison_value": 100,
            "evidence_availability": 100,
            "price_or_value_hint": 100,
            "risk_penalty": 0,
        }
        self.assertEqual(candidate_score_from_breakdown(parts), 95)

    def test_candidate_breakdown_uses_defaults_and_risk(self) -> None:
        row = {"title": "Magnesium supplement", "reason": "health claims"}
        parts = candidate_score_breakdown(row)
        self.assertEqual(parts["topic_relevance"], 70)
        self.assertGreaterEqual(parts["risk_penalty"], 44)

    def test_evidence_needed_adds_health_and_safety_requirements(self) -> None:
        health = evidence_needed({"title": "gut health supplement"})
        charger = evidence_needed({"title": "usb c charger"})
        self.assertIn("Health claim review and supplement disclaimer", health)
        self.assertIn("Safety/certification and spec verification", charger)

    def test_comparison_rows_mark_high_risk(self) -> None:
        rows = comparison_rows(
            [
                {
                    "id": "candidate-1",
                    "title": "Probiotic",
                    "sourceMerchant": "iHerb",
                    "reason": "gut health",
                    "evidenceNeededJson": ["Health claim review"],
                    "riskScore": 72,
                }
            ]
        )
        self.assertEqual(rows[0]["riskLevel"], "high")
        self.assertIn("Health claim review", rows[0]["verifyBeforeLinking"])

    def test_tokens_ignore_tiny_words(self) -> None:
        self.assertEqual(tokens("USB-C GaN charger"), ["charger"])


if __name__ == "__main__":
    unittest.main()
