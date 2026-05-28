from __future__ import annotations

import unittest
from pathlib import Path

from workers.python.serp import serp_importer
from workers.python.serp.serp_import_records import (
    keyword_id_for_row,
    serp_import_payload,
    serp_result_record,
    serp_snapshot_record,
    snapshot_id_for_row,
    snapshot_identity,
    sorted_serp_results,
)
from workers.python.serp.serp_import_reports import (
    SERP_CONTENT_FETCH_POLICY,
    collect_serp_report_payload,
    fetched_serp_result_record,
    fetched_serp_result_rows,
)


class SerpImporterModuleTests(unittest.TestCase):
    def test_serp_importer_facade_keeps_split_helpers_available(self) -> None:
        self.assertIs(serp_importer.snapshot_identity, snapshot_identity)
        self.assertIs(serp_importer.snapshot_id_for_row, snapshot_id_for_row)
        self.assertIs(serp_importer.keyword_id_for_row, keyword_id_for_row)
        self.assertIs(serp_importer.serp_snapshot_record, serp_snapshot_record)
        self.assertIs(serp_importer.serp_result_record, serp_result_record)
        self.assertIs(serp_importer.serp_import_payload, serp_import_payload)
        self.assertIs(serp_importer.collect_serp_report_payload, collect_serp_report_payload)
        self.assertIs(serp_importer.fetched_serp_result_rows, fetched_serp_result_rows)
        self.assertEqual(serp_importer.SERP_CONTENT_FETCH_POLICY, SERP_CONTENT_FETCH_POLICY)

    def test_snapshot_and_result_records_keep_manual_csv_defaults(self) -> None:
        row = {
            "market": " us ",
            "language": "en",
            "country": "us",
            "keyword": "magnesium sleep",
            "rank": "2",
            "url": "https://example.com/post",
            "title": "Best magnesium sleep guide",
            "snippet": "Compare forms for sleep",
            "is_affiliate_likely": "true",
            "is_publisher": "true",
        }
        snapshot_id = snapshot_id_for_row(row)
        snapshot = serp_snapshot_record(row, snapshot_id, Path("data/seeds/serp-results.csv"), lambda: "captured")
        result = serp_result_record(row, snapshot_id, "en")

        self.assertEqual(snapshot_identity(row), ("us", "en", "magnesium sleep"))
        self.assertEqual(snapshot_id, "serp-snapshot-us-en-magnesium-sleep")
        self.assertEqual(keyword_id_for_row(row), "trend-keyword-us-en-magnesium-sleep")
        self.assertEqual(snapshot["provider"], "manual_csv")
        self.assertEqual(snapshot["collectedAt"], "captured")
        self.assertEqual(snapshot["rawJson"]["sourceFile"], "data/seeds/serp-results.csv")
        self.assertEqual(result["rank"], 2)
        self.assertEqual(result["domain"], "example.com")
        self.assertEqual(result["contentFetchedStatus"], "manual_summary_available")
        self.assertTrue(result["isAffiliateLikely"])

    def test_import_payload_groups_snapshot_counts_and_sorts_results(self) -> None:
        rows = [
            {"market": "us", "language": "en", "keyword": "usb charger", "rank": "3", "url": "https://b.test/post"},
            {"market": "us", "language": "en", "keyword": "usb charger", "rank": "1", "url": "https://a.test/post"},
            "bad-row",
        ]

        payload = serp_import_payload(rows, Path("seed.csv"), lambda: "captured")

        self.assertEqual(len(payload["snapshots"]), 1)
        self.assertEqual(payload["snapshots"][0]["topResultCount"], 2)
        self.assertEqual([result["rank"] for result in payload["results"]], [1, 3])
        self.assertEqual(sorted_serp_results(list(reversed(payload["results"]))), payload["results"])

    def test_collect_report_filters_by_keyword_and_provider(self) -> None:
        payload = {
            "snapshots": [
                {"id": "one", "keywordId": "kw-1", "provider": "manual_csv"},
                {"id": "two", "keywordId": "kw-2", "provider": "manual_csv"},
                {"id": "three", "keywordId": "kw-1", "provider": "disabled_provider"},
                "bad-row",
            ]
        }

        report = collect_serp_report_payload(payload, "kw-1", "manual_csv")

        self.assertEqual(report, {"provider": "manual_csv", "snapshots": [{"id": "one", "keywordId": "kw-1", "provider": "manual_csv"}]})

    def test_fetch_rows_store_summary_only_policy_without_full_body(self) -> None:
        rows = [
            {"id": "one", "snapshotId": "snapshot-one", "contentFetchedStatus": "pending"},
            {"id": "two", "snapshotId": "snapshot-two", "contentFetchedStatus": "pending"},
            "bad-row",
        ]
        updated = fetched_serp_result_rows(rows, "snapshot-one")
        by_id = {row["id"]: row for row in updated}

        self.assertEqual(fetched_serp_result_record(rows[0], "snapshot-one")["contentFetchedStatus"], "summary_only")
        self.assertEqual(by_id["one"]["contentFetchPolicy"], SERP_CONTENT_FETCH_POLICY)
        self.assertNotIn("contentFetchPolicy", by_id["two"])
        self.assertNotIn("body", by_id["one"])


if __name__ == "__main__":
    unittest.main()
