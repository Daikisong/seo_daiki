from __future__ import annotations

import unittest

from workers.python.intelligence import performance_feedback
from workers.python.intelligence.performance_feedback_paths import (
    NEXT_ACTIONS_PATH,
    PERFORMANCE_PATH,
    TEST_ARTICLES_PATH,
    performance_report_path,
)
from workers.python.intelligence.performance_feedback_records import (
    performance_action_decision,
    performance_action_record,
    performance_action_records,
    performance_report_payload,
    performance_snapshot_record,
    performance_snapshot_records,
)


class PerformanceFeedbackModuleTests(unittest.TestCase):
    def test_performance_feedback_facade_keeps_paths_and_split_helpers_available(self) -> None:
        self.assertEqual(performance_feedback.TEST_ARTICLES_PATH, TEST_ARTICLES_PATH)
        self.assertEqual(performance_feedback.PERFORMANCE_PATH, PERFORMANCE_PATH)
        self.assertEqual(performance_feedback.NEXT_ACTIONS_PATH, NEXT_ACTIONS_PATH)
        self.assertIs(performance_feedback.performance_snapshot_records, performance_snapshot_records)
        self.assertIs(performance_feedback.performance_action_records, performance_action_records)
        self.assertIs(performance_feedback.performance_report_payload, performance_report_payload)

    def test_snapshot_records_skip_bad_rows_and_keep_sample_source(self) -> None:
        records = performance_snapshot_records(
            [
                {"id": "article-1", "market": "kr", "language": "ko"},
                "bad-row",
            ],
            "2026-05-28",
            "2026-05-28T00:00:00+00:00",
        )

        self.assertEqual(records, [performance_snapshot_record({"id": "article-1", "market": "kr", "language": "ko"}, "2026-05-28", "2026-05-28T00:00:00+00:00")])
        self.assertEqual(records[0]["countriesJson"], ["KR"])
        self.assertEqual(records[0]["source"], "sample_or_search_console_import")

    def test_action_decision_keeps_thresholds_stable(self) -> None:
        self.assertEqual(performance_action_decision({"impressions": 49, "clicks": 0})[0], "hold")
        self.assertEqual(performance_action_decision({"impressions": 50, "clicks": 0})[0], "rewrite_title_meta")
        self.assertEqual(performance_action_decision({"impressions": 50, "clicks": 1})[0], "request_product_candidate_analysis")

        action = performance_action_record({"articleId": "article-1", "impressions": 50, "clicks": 1}, "now")
        self.assertEqual(action["id"], "next-action-article-1")
        self.assertEqual(action["status"], "open")
        self.assertEqual(action["payloadJson"]["minimumPerformanceGate"], "editorial_or_search_signal_required")

    def test_report_payload_filters_snapshots_by_market_but_keeps_actions(self) -> None:
        snapshots = [{"articleId": "a", "market": "us"}, {"articleId": "b", "market": "kr"}, "bad-row"]
        actions = [{"articleId": "a"}, {"articleId": "b"}]
        report = performance_report_payload(snapshots, actions, "kr")

        self.assertEqual(report["market"], "kr")
        self.assertEqual(report["snapshots"], [{"articleId": "b", "market": "kr"}])
        self.assertEqual(report["actions"], actions)
        self.assertTrue(str(performance_report_path("kr")).endswith("data/exports/performance_report_kr.json"))


if __name__ == "__main__":
    unittest.main()
