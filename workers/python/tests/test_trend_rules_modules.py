from __future__ import annotations

import unittest

from workers.python.intelligence import trend_rules
from workers.python.intelligence.trend_cross_market_rules import cross_market_patterns
from workers.python.intelligence.trend_inference_rules import infer_category, infer_intent
from workers.python.intelligence.trend_normalization_rules import (
    cluster_topic,
    market_from_country,
    normalize_keyword,
    topic_signature,
)
from workers.python.intelligence.trend_scoring_rules import (
    content_opportunity,
    trend_score_breakdown,
    trend_score_from_breakdown,
)
from workers.python.intelligence.trend_value_rules import avg, bucket, integer, score


class TrendRulesModulesTest(unittest.TestCase):
    def test_legacy_trend_rules_reexports_split_helpers(self) -> None:
        self.assertIs(trend_rules.avg, avg)
        self.assertIs(trend_rules.bucket, bucket)
        self.assertIs(trend_rules.cluster_topic, cluster_topic)
        self.assertIs(trend_rules.content_opportunity, content_opportunity)
        self.assertIs(trend_rules.cross_market_patterns, cross_market_patterns)
        self.assertIs(trend_rules.infer_category, infer_category)
        self.assertIs(trend_rules.infer_intent, infer_intent)
        self.assertIs(trend_rules.integer, integer)
        self.assertIs(trend_rules.market_from_country, market_from_country)
        self.assertIs(trend_rules.normalize_keyword, normalize_keyword)
        self.assertIs(trend_rules.score, score)
        self.assertIs(trend_rules.topic_signature, topic_signature)
        self.assertIs(trend_rules.trend_score_breakdown, trend_score_breakdown)
        self.assertIs(trend_rules.trend_score_from_breakdown, trend_score_from_breakdown)

    def test_split_helpers_keep_expected_trend_behavior(self) -> None:
        self.assertEqual(cluster_topic({"topicRaw": "usb-c charger"}), "usb c charger")
        self.assertEqual(infer_intent("best charger", "consumer-tech"), "comparison")
        self.assertEqual(bucket(score(82)), "high")


if __name__ == "__main__":
    unittest.main()
