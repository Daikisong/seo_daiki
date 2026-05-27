from __future__ import annotations

import unittest

from workers.python.intelligence.trend_rules import (
    bucket,
    cluster_topic,
    cross_market_patterns,
    infer_category,
    infer_intent,
    normalize_keyword,
    score,
    trend_score_breakdown,
    trend_score_from_breakdown,
)


class TrendRulesTest(unittest.TestCase):
    def test_normalizes_hyphenated_keywords(self) -> None:
        self.assertEqual(normalize_keyword("USB-C   Charger"), "usb c charger")

    def test_clusters_known_market_topic_variants(self) -> None:
        self.assertEqual(cluster_topic({"topicRaw": "cargador usb-c rapido"}), "usb c charger")
        self.assertEqual(cluster_topic({"topicRaw": "power bank mah real"}), "power bank real capacity")

    def test_infers_category_and_intent_without_product_bias(self) -> None:
        self.assertEqual(infer_category("magnesium sleep"), "wellness")
        self.assertEqual(infer_category("gan charger"), "consumer-tech")
        self.assertEqual(infer_intent("gut health basics", "wellness"), "informational_health")
        self.assertEqual(infer_intent("best usb c charger", "consumer-tech"), "comparison")

    def test_score_breakdown_applies_health_compliance_penalty_by_market(self) -> None:
        signals = [
            {
                "sourceId": "source-a",
                "velocityScore": 80,
                "localeSpecificityScore": 90,
                "commercialHintScore": 40,
                "evidenceHintScore": 70,
                "freshnessScore": 75,
                "normalizedKeyword": "gut health",
            }
        ]
        breakdown = trend_score_breakdown(signals, {"market": "kr", "canonicalTopic": "gut health", "signalCount": 1})
        self.assertEqual(breakdown["compliancePenalty"], 12)
        self.assertGreater(trend_score_from_breakdown(breakdown), 0)

    def test_cross_market_patterns_classify_global_and_local(self) -> None:
        global_rows = [
            {"market": market, "language": language, "canonicalTopic": "usb c charger"}
            for market, language in [("us", "en"), ("gb", "en"), ("es", "es"), ("mx", "es")]
        ]
        local_rows = [{"market": "br", "language": "pt-br", "canonicalTopic": "power bank real capacity"}]
        patterns = cross_market_patterns(global_rows + local_rows)
        by_topic = {pattern["topic"]: pattern for pattern in patterns}
        self.assertEqual(by_topic["usb charger"]["type"], "global_trend")
        self.assertEqual(by_topic["usb charger"]["classification"], "global trend")
        self.assertTrue(by_topic["usb charger"]["crossLanguageSynonymCluster"])
        self.assertTrue(by_topic["usb charger"]["laggingMarketOpportunity"])
        self.assertEqual(by_topic["power bank real capacity"]["type"], "local_only_trend")
        self.assertEqual(by_topic["power bank real capacity"]["classification"], "local-only trend")

    def test_score_and_bucket_are_bounded(self) -> None:
        self.assertEqual(score(120), 100)
        self.assertEqual(score(-2), 0)
        self.assertEqual(bucket(80), "high")
        self.assertEqual(bucket(0), "unknown")


if __name__ == "__main__":
    unittest.main()
