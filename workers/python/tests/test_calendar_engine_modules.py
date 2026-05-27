from __future__ import annotations

import unittest
from datetime import date

from workers.python.intelligence import calendar_engine
from workers.python.intelligence.calendar_engine_model import calendar_for_market, enabled_market_configs
from workers.python.intelligence.calendar_engine_reports import calendar_explanations, filter_calendars


class CalendarEngineModulesTest(unittest.TestCase):
    def test_legacy_calendar_module_reexports_market_builder(self) -> None:
        self.assertIs(calendar_engine.calendar_for_market, calendar_for_market)

    def test_enabled_market_configs_filters_disabled_and_requested_market(self) -> None:
        markets = [
            {"market": "us", "language": "en", "enabled": True},
            {"market": "es", "language": "es", "enabled": False},
            {"market": "kr", "language": "ko", "enabled": True},
        ]

        self.assertEqual(enabled_market_configs(markets), [markets[0], markets[2]])
        self.assertEqual(enabled_market_configs(markets, "kr"), [markets[2]])

    def test_calendar_for_market_keeps_market_local_queue(self) -> None:
        calendar = calendar_for_market(
            {"market": "us", "language": "en"},
            [
                {"id": "cluster-us", "market": "us", "language": "en", "category": "sleep"},
                {"id": "cluster-es", "market": "es", "language": "es", "category": "chargers"},
            ],
            [
                {"id": "kw-low", "market": "us", "language": "en", "priorityScore": 10, "clusterId": "cluster-us"},
                {"id": "kw-high", "market": "us", "language": "en", "priorityScore": 90, "clusterId": "cluster-us"},
                {"id": "kw-es", "market": "es", "language": "es", "priorityScore": 99, "clusterId": "cluster-es"},
            ],
            [{"id": "strategy-high", "keywordId": "kw-high"}],
            [{"id": "article-high", "strategyId": "strategy-high"}],
            week_start=date(2026, 5, 28),
        )

        self.assertEqual(calendar["id"], "market-calendar-us-en-2026-05-28")
        self.assertEqual(calendar["summaryJson"]["clusterCount"], 1)  # type: ignore[index]
        self.assertEqual(calendar["summaryJson"]["keywordCount"], 2)  # type: ignore[index]
        self.assertEqual(calendar["summaryJson"]["topicalBalance"]["categories"], {"sleep": 1})  # type: ignore[index]
        self.assertEqual(calendar["slots"][0]["keywordId"], "kw-high")  # type: ignore[index]
        self.assertEqual(calendar["slots"][0]["articleId"], "article-high")  # type: ignore[index]
        self.assertNotIn("kw-es", [slot["keywordId"] for slot in calendar["slots"]])  # type: ignore[index]

    def test_calendar_report_filters_and_explains_market_locality(self) -> None:
        calendars = [
            {"market": "us", "language": "en", "summaryJson": {"topicalBalance": {"categories": {"sleep": 1}}}},
            {"market": "kr", "language": "ko", "summaryJson": {"topicalBalance": {"categories": {"health": 1}}}},
        ]

        filtered = filter_calendars(calendars, "kr")
        explanations = calendar_explanations(filtered)

        self.assertEqual(filtered, [calendars[1]])
        self.assertEqual(explanations[0]["market"], "kr")
        self.assertIn("market-local", explanations[0]["reason"])
        self.assertEqual(explanations[0]["topicalBalance"], {"categories": {"health": 1}})


if __name__ == "__main__":
    unittest.main()
