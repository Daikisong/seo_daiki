from __future__ import annotations

import unittest
from pathlib import Path
from unittest.mock import patch

from workers.python.intelligence import market_trend_engine
from workers.python.intelligence.market_trend_clusters import market_trend_cluster_records, scored_market_trend_records
from workers.python.intelligence.market_trend_keywords import trend_keyword_records
from workers.python.intelligence.market_trend_signals import import_market_trend_signals, market_trend_import_payload
from workers.python.intelligence.market_trend_sources import init_markets


class MarketTrendEngineModuleTests(unittest.TestCase):
    def test_legacy_module_reexports_split_market_trend_helpers(self) -> None:
        self.assertIs(market_trend_engine.init_markets, init_markets)
        self.assertIs(market_trend_engine.import_market_trend_signals, import_market_trend_signals)
        self.assertIs(market_trend_engine.market_trend_cluster_records, market_trend_cluster_records)
        self.assertIs(market_trend_engine.trend_keyword_records, trend_keyword_records)

    def test_import_payload_normalizes_signal_and_source_records(self) -> None:
        with patch("workers.python.intelligence.market_trend_signals.now", return_value="2026-05-28T00:00:00+00:00"):
            payload = market_trend_import_payload(
                [
                    {
                        "country": "US",
                        "language": "en",
                        "query": "USB-C   Charger",
                        "topic_raw": "USB-C charger fast",
                        "volume_score": "81",
                        "growth_score": "73",
                        "freshness_score": "65",
                        "commercial_score": "59",
                        "evidence_fit_score": "44",
                    }
                ],
                Path("data/seeds/trend-signals.csv"),
            )

        self.assertEqual(len(payload["sources"]), 1)
        self.assertEqual(payload["sources"][0]["id"], "trend-source-us-en-manual_csv")
        self.assertEqual(payload["sources"][0]["lastCollectedAt"], "2026-05-28T00:00:00+00:00")
        self.assertEqual(len(payload["signals"]), 1)
        signal = payload["signals"][0]
        self.assertEqual(signal["market"], "us")
        self.assertEqual(signal["normalizedKeyword"], "usb c charger")
        self.assertEqual(signal["categoryGuess"], "consumer-tech")
        self.assertEqual(signal["sourceVolumeBucket"], "high")
        self.assertEqual(signal["velocityScore"], 73)
        self.assertEqual(signal["status"], "raw")

    def test_cluster_records_group_market_language_topic_signals(self) -> None:
        with patch("workers.python.intelligence.market_trend_clusters.now", return_value="2026-05-28T00:00:00+00:00"):
            clusters = market_trend_cluster_records(
                [
                    {
                        "id": "signal-1",
                        "market": "es",
                        "language": "es",
                        "country": "ES",
                        "topicRaw": "cargador usb-c rapido",
                        "normalizedKeyword": "cargador usb c",
                    },
                    {
                        "id": "signal-2",
                        "market": "es",
                        "language": "es",
                        "country": "ES",
                        "topicRaw": "usb c charger",
                        "normalizedKeyword": "usb c charger",
                    },
                ]
            )

        self.assertEqual(len(clusters), 1)
        self.assertEqual(clusters[0]["canonicalTopic"], "usb c charger")
        self.assertEqual(clusters[0]["signalCount"], 2)
        self.assertEqual(clusters[0]["signalIds"], ["signal-1", "signal-2"])

    def test_scored_records_keep_scoring_separate_from_file_io(self) -> None:
        scored = scored_market_trend_records(
            [
                {
                    "id": "cluster-one",
                    "market": "us",
                    "canonicalTopic": "usb c charger",
                    "signalCount": 1,
                    "signalIds": ["signal-one"],
                }
            ],
            [
                {
                    "id": "signal-one",
                    "sourceId": "source-one",
                    "velocityScore": 80,
                    "localeSpecificityScore": 90,
                    "commercialHintScore": 70,
                    "evidenceHintScore": 60,
                    "freshnessScore": 50,
                    "normalizedKeyword": "usb c charger",
                }
            ],
        )

        self.assertEqual(scored[0]["status"], "scored")
        self.assertGreater(scored[0]["score"], 0)
        self.assertIn("velocityScore", scored[0]["scoreBreakdownJson"])

    def test_keyword_records_dedupe_related_keywords_and_decay_priority(self) -> None:
        keywords = trend_keyword_records(
            [
                {
                    "id": "trend-cluster-us-en-usb-c-charger",
                    "market": "us",
                    "language": "en",
                    "canonicalTopic": "usb c charger",
                    "category": "consumer-tech",
                    "relatedKeywordsJson": ["usb c charger", "best usb c charger"],
                    "score": 80,
                }
            ]
        )

        self.assertEqual([keyword["keyword"] for keyword in keywords], ["usb c charger", "best usb c charger"])
        self.assertEqual(keywords[0]["priorityScore"], 78.5)
        self.assertEqual(keywords[1]["searchIntentGuess"], "comparison")


if __name__ == "__main__":
    unittest.main()
