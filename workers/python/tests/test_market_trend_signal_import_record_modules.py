from __future__ import annotations

import unittest
from pathlib import Path

from workers.python.intelligence import market_trend_signal_import_records
from workers.python.intelligence.market_trend_signal_identity import (
    market_trend_country,
    market_trend_language,
    market_trend_market,
    market_trend_source_key,
    market_trend_source_type,
)
from workers.python.intelligence.market_trend_signal_records import market_trend_signal_record
from workers.python.intelligence.market_trend_source_records import market_trend_source_record


class MarketTrendSignalImportRecordModuleTests(unittest.TestCase):
    def test_legacy_import_module_reexports_split_helpers(self) -> None:
        self.assertIs(market_trend_signal_import_records.market_trend_market, market_trend_market)
        self.assertIs(market_trend_signal_import_records.market_trend_language, market_trend_language)
        self.assertIs(market_trend_signal_import_records.market_trend_country, market_trend_country)
        self.assertIs(market_trend_signal_import_records.market_trend_source_type, market_trend_source_type)
        self.assertIs(market_trend_signal_import_records.market_trend_source_key, market_trend_source_key)
        self.assertIs(market_trend_signal_import_records.market_trend_source_record, market_trend_source_record)
        self.assertIs(market_trend_signal_import_records.market_trend_signal_record, market_trend_signal_record)

    def test_identity_helpers_keep_import_defaults(self) -> None:
        row = {"country": "KR", "locale": "ko"}

        self.assertEqual(market_trend_market(row), "kr")
        self.assertEqual(market_trend_language(row), "ko")
        self.assertEqual(market_trend_country(row, "kr"), "KR")
        self.assertEqual(market_trend_source_type(row), "manual_csv")
        self.assertEqual(market_trend_source_key("kr", "ko", "manual_csv"), "kr-ko-manual_csv")

    def test_split_record_builders_match_aggregate_import_output(self) -> None:
        row = {
            "country": "US",
            "language": "en",
            "query": "USB-C Charger",
            "growth_score": "73",
            "volume_score": "81",
            "source_rank": "2",
        }
        timestamp = lambda: "2026-05-28T00:00:00+00:00"
        seed_path = Path("data/seeds/trend-signals.csv")

        market = market_trend_market(row)
        language = market_trend_language(row)
        country = market_trend_country(row, market)
        source_type = market_trend_source_type(row)
        source_key = market_trend_source_key(market, language, source_type)
        source = market_trend_source_record(row, seed_path, source_key, source_type, market, language, country, timestamp)
        signal = market_trend_signal_record(row, 1, source, source_key, source_type, market, language, country, timestamp)
        payload = market_trend_signal_import_records.market_trend_import_records([row], seed_path, timestamp)

        self.assertEqual(payload["sources"], [source])
        self.assertEqual(payload["signals"], [signal])
        self.assertEqual(signal["sourceVolumeBucket"], "high")
        self.assertEqual(signal["sourceRank"], 2)


if __name__ == "__main__":
    unittest.main()
