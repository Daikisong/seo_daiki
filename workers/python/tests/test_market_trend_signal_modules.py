from __future__ import annotations

import unittest
from pathlib import Path
from unittest.mock import patch

from workers.python.intelligence.market_trend_signal_collection import market_trend_collect_payload
from workers.python.intelligence.market_trend_signal_import_records import market_trend_import_records
from workers.python.intelligence.market_trend_signal_normalization import normalized_market_trend_payload
from workers.python.intelligence.market_trend_signals import market_trend_import_payload


class MarketTrendSignalModulesTest(unittest.TestCase):
    def test_import_payload_delegates_to_split_record_builder(self) -> None:
        rows = [{"country": "US", "language": "en", "query": "USB-C Charger", "growth_score": "73"}]
        seed_path = Path("data/seeds/trend-signals.csv")

        with patch("workers.python.intelligence.market_trend_signals.now", return_value="2026-05-28T00:00:00+00:00"):
            payload = market_trend_import_payload(rows, seed_path)

        direct_payload = market_trend_import_records(rows, seed_path, timestamp=lambda: "2026-05-28T00:00:00+00:00")

        self.assertEqual(payload, direct_payload)
        self.assertEqual(payload["signals"][0]["normalizedKeyword"], "usb c charger")
        self.assertEqual(payload["sources"][0]["lastCollectedAt"], "2026-05-28T00:00:00+00:00")

    def test_collect_and_normalize_helpers_keep_file_io_outside_rules(self) -> None:
        payload = {
            "sources": [{"id": "source-us"}],
            "signals": [
                {"id": "signal-us", "market": "us", "sourceType": "manual_csv", "normalizedKeyword": "USB-C Charger"},
                {"id": "signal-es", "market": "es", "sourceType": "manual_csv", "normalizedKeyword": "cargador usb c"},
            ],
        }

        collected = market_trend_collect_payload(payload, market="us", source="manual_csv")
        normalized = normalized_market_trend_payload(payload)

        self.assertEqual([signal["id"] for signal in collected["signals"]], ["signal-us"])
        self.assertEqual(normalized["signals"][0]["normalizedKeyword"], "usb c charger")
        self.assertEqual(normalized["signals"][0]["status"], "normalized")


if __name__ == "__main__":
    unittest.main()
