from __future__ import annotations

import unittest

from workers.python.intelligence import trend_topic_rules
from workers.python.intelligence.trend_topic_briefs import localized_title, publishing_blockers
from workers.python.intelligence.trend_topic_clustering import EMPTY_SCORE_BREAKDOWN, cluster_key, score_breakdown
from workers.python.intelligence.trend_topic_intent import article_type_for_intent, infer_intent
from workers.python.intelligence.trend_topic_offers import affiliate_match_score
from workers.python.intelligence.trend_topic_values import clean, score


class TrendTopicRuleModulesTest(unittest.TestCase):
    def test_legacy_rules_module_reexports_split_helpers(self) -> None:
        self.assertIs(trend_topic_rules.clean, clean)
        self.assertIs(trend_topic_rules.cluster_key, cluster_key)
        self.assertIs(trend_topic_rules.infer_intent, infer_intent)
        self.assertIs(trend_topic_rules.localized_title, localized_title)
        self.assertIs(trend_topic_rules.affiliate_match_score, affiliate_match_score)

    def test_value_and_cluster_modules_keep_bounds_and_empty_breakdown(self) -> None:
        self.assertEqual(clean("  charger  "), "charger")
        self.assertEqual(score("101"), 100)
        self.assertEqual(score("not-a-number"), 0)
        self.assertEqual(cluster_key({"topicRaw": "Best Charger Deals 2026"}), "charger")
        self.assertEqual(score_breakdown([]), EMPTY_SCORE_BREAKDOWN)
        self.assertIsNot(score_breakdown([]), EMPTY_SCORE_BREAKDOWN)

    def test_intent_brief_and_offer_modules_are_independent(self) -> None:
        self.assertEqual(infer_intent("magnesium sleep review"), "health")
        self.assertEqual(article_type_for_intent("comparison"), "compare")
        self.assertEqual(localized_title("Guide", "pt-br"), "Rascunho localizado: Guide")
        self.assertEqual(affiliate_match_score({"score": 80, "intent": "deal", "healthSensitive": False}, "aliexpress"), 88)

    def test_publishing_module_keeps_health_approval_blockers(self) -> None:
        blockers = publishing_blockers(
            {
                "requiredEvidence": ["ingredient label source"],
                "outlineJson": [{"heading": "One"}],
                "articleType": "ingredient_guide",
                "healthSensitivity": "medium",
                "merchantFitJson": {"requiresHealthClaimGuard": False},
            },
            [{"merchantSlug": "iherb"}],
        )

        self.assertEqual(blockers, ["health_disclaimer_requirement_missing", "health_claim_guard_requirement_missing"])


if __name__ == "__main__":
    unittest.main()
