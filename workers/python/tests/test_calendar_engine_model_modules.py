from __future__ import annotations

import unittest
from datetime import date

from workers.python.intelligence import calendar_engine_model
from workers.python.intelligence.calendar_engine_balance import (
    TOPICAL_BALANCE_LIMITS,
    category_counts,
    topical_balance_summary,
)
from workers.python.intelligence.calendar_engine_filters import enabled_market_configs, market_items, records_by_key
from workers.python.intelligence.calendar_engine_slots import (
    EDITORIAL_SLOT_REASON,
    MAX_EDITORIAL_SLOTS_PER_WEEK,
    editorial_slot_record,
    editorial_slots,
    sorted_keywords_by_priority,
)


class CalendarEngineModelModuleTests(unittest.TestCase):
    def test_calendar_model_facade_keeps_split_helpers_available(self) -> None:
        self.assertIs(calendar_engine_model.enabled_market_configs, enabled_market_configs)
        self.assertIs(calendar_engine_model.market_items, market_items)
        self.assertIs(calendar_engine_model.records_by_key, records_by_key)
        self.assertIs(calendar_engine_model.editorial_slots, editorial_slots)
        self.assertIs(calendar_engine_model.editorial_slot_record, editorial_slot_record)
        self.assertIs(calendar_engine_model.sorted_keywords_by_priority, sorted_keywords_by_priority)
        self.assertIs(calendar_engine_model.topical_balance_summary, topical_balance_summary)
        self.assertIs(calendar_engine_model.category_counts, category_counts)
        self.assertEqual(calendar_engine_model.MAX_EDITORIAL_SLOTS_PER_WEEK, MAX_EDITORIAL_SLOTS_PER_WEEK)
        self.assertEqual(calendar_engine_model.EDITORIAL_SLOT_REASON, EDITORIAL_SLOT_REASON)

    def test_filter_helpers_keep_market_silos_separate(self) -> None:
        markets = [
            {"market": "us", "language": "en", "enabled": True},
            {"market": "kr", "language": "ko", "enabled": True},
            {"market": "es", "language": "es", "enabled": False},
        ]
        rows = [
            {"id": "us-row", "market": "us", "language": "en"},
            {"id": "kr-row", "market": "kr", "language": "ko"},
            {"id": "wrong-language", "market": "us", "language": "ko"},
        ]

        self.assertEqual(enabled_market_configs(markets, "kr"), [markets[1]])
        self.assertEqual(market_items(rows, "us", "en"), [rows[0]])
        self.assertEqual(records_by_key(rows, "id")["kr-row"], rows[1])

    def test_editorial_slots_sort_by_priority_limit_to_five_and_link_strategy_article(self) -> None:
        keywords = [
            {"id": f"kw-{index}", "clusterId": "cluster-1", "priorityScore": index}
            for index in range(7)
        ]
        strategies = {"kw-6": {"id": "strategy-6"}}
        articles = {"strategy-6": {"id": "article-6"}}

        slots = editorial_slots("us", "en", keywords, strategies, articles, date(2026, 5, 28))

        self.assertEqual(len(slots), MAX_EDITORIAL_SLOTS_PER_WEEK)
        self.assertEqual([slot["keywordId"] for slot in slots], ["kw-6", "kw-5", "kw-4", "kw-3", "kw-2"])
        self.assertEqual(slots[0]["date"], "2026-05-28")
        self.assertEqual(slots[1]["date"], "2026-05-29")
        self.assertEqual(slots[0]["articleId"], "article-6")
        self.assertEqual(slots[0]["reason"], EDITORIAL_SLOT_REASON)

    def test_topical_balance_counts_categories_and_keeps_policy_limits(self) -> None:
        clusters = [{"category": "sleep"}, {"category": "sleep"}, {"category": "chargers"}, {}]
        summary = topical_balance_summary(clusters)

        self.assertEqual(category_counts(clusters), {"sleep": 2, "chargers": 1, "None": 1})
        self.assertEqual(summary["categories"], {"sleep": 2, "chargers": 1, "None": 1})
        for key, value in TOPICAL_BALANCE_LIMITS.items():
            self.assertEqual(summary[key], value)


if __name__ == "__main__":
    unittest.main()
