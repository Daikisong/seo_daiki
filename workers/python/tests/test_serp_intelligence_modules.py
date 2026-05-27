from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from workers.python.serp import serp_intelligence
from workers.python.serp.serp_artifacts import keyword_for_snapshot, language_for_snapshot, market_for_snapshot
from workers.python.serp.serp_importer import collect_serp, fetch_serp_pages
from workers.python.serp.serp_importer import import_serp_results
from workers.python.serp.serp_opportunities import serp_opportunity_record, summarize_serp_opportunity
from workers.python.serp.serp_page_analysis import analyze_serp_pages


class SerpIntelligenceModuleTests(unittest.TestCase):
    def test_legacy_module_reexports_split_serp_helpers(self) -> None:
        self.assertIs(serp_intelligence.import_serp_results, import_serp_results)
        self.assertIs(serp_intelligence.collect_serp, collect_serp)
        self.assertIs(serp_intelligence.fetch_serp_pages, fetch_serp_pages)
        self.assertIs(serp_intelligence.analyze_serp_pages, analyze_serp_pages)
        self.assertIs(serp_intelligence.summarize_serp_opportunity, summarize_serp_opportunity)

    def test_snapshot_lookup_helpers_return_market_language_and_keyword(self) -> None:
        payload = {
            "snapshots": [
                {
                    "id": "snapshot-us",
                    "market": "us",
                    "language": "en",
                    "keyword": "magnesium sleep",
                }
            ]
        }

        self.assertEqual(market_for_snapshot("snapshot-us", payload), "us")
        self.assertEqual(language_for_snapshot("snapshot-us", payload), "en")
        self.assertEqual(keyword_for_snapshot("snapshot-us", payload), "magnesium sleep")
        self.assertEqual(market_for_snapshot("missing", payload), "")

    def test_import_serp_results_builds_snapshot_and_result_records(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            csv_path = temp_path / "serp-results.csv"
            output_path = temp_path / "serp_results.json"
            csv_path.write_text(
                "\n".join(
                    [
                        "market,language,country,keyword,keyword_id,provider,rank,url,title,snippet,is_forum,is_video,is_ecommerce,is_affiliate_likely,is_publisher,language_guess",
                        "us,en,US,magnesium sleep,kw-us-magnesium,manual_csv,2,https://example.com/post,Best magnesium sleep guide,Compare forms for sleep,false,false,false,true,true,en",
                    ]
                ),
                encoding="utf-8",
            )

            with patch("workers.python.serp.serp_importer.SERP_RESULTS_PATH", output_path):
                written_path = import_serp_results(csv_path)

            payload = json.loads(output_path.read_text(encoding="utf-8"))
            self.assertEqual(written_path, str(output_path))
            self.assertEqual(len(payload["snapshots"]), 1)
            self.assertEqual(payload["snapshots"][0]["keywordId"], "kw-us-magnesium")
            self.assertEqual(payload["snapshots"][0]["topResultCount"], 1)
            self.assertEqual(payload["results"][0]["rank"], 2)
            self.assertEqual(payload["results"][0]["domain"], "example.com")
            self.assertTrue(payload["results"][0]["isAffiliateLikely"])

    def test_fetch_serp_pages_updates_only_requested_snapshot(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            output_path = Path(temp_dir) / "serp_results.json"
            output_path.write_text(
                json.dumps(
                    {
                        "snapshots": [{"id": "snapshot-one"}, {"id": "snapshot-two"}],
                        "results": [
                            {"id": "result-one", "snapshotId": "snapshot-one", "contentFetchedStatus": "pending"},
                            {"id": "result-two", "snapshotId": "snapshot-two", "contentFetchedStatus": "pending"},
                        ],
                    }
                ),
                encoding="utf-8",
            )

            with patch("workers.python.serp.serp_importer.SERP_RESULTS_PATH", output_path):
                fetch_serp_pages("snapshot-one")

            payload = json.loads(output_path.read_text(encoding="utf-8"))
            by_id = {item["id"]: item for item in payload["results"]}
            self.assertEqual(by_id["result-one"]["contentFetchedStatus"], "summary_only")
            self.assertIn("contentFetchPolicy", by_id["result-one"])
            self.assertEqual(by_id["result-two"]["contentFetchedStatus"], "pending")

    def test_serp_opportunity_record_keeps_scoring_logic_outside_report_io(self) -> None:
        record = serp_opportunity_record(
            {
                "id": "kw-us-magnesium",
                "market": "us",
                "language": "en",
                "keyword": "magnesium sleep",
                "priorityScore": 72,
            },
            [
                {
                    "intentServed": "comparison",
                    "contentTypeGuess": "article",
                    "weaknessesJson": ["No local guidance", "No verification checklist"],
                    "originalDataPresent": False,
                    "headingsJson": ["Best forms", "Dosage basics"],
                    "freshnessSignalsJson": [],
                    "comparisonTablePresent": True,
                    "productLinksPresent": False,
                    "missingAnglesJson": ["market-specific guidance"],
                }
            ],
        )

        self.assertEqual(record["keywordId"], "kw-us-magnesium")
        self.assertEqual(record["dominantIntent"], "comparison")
        self.assertEqual(record["recommendedArticleType"], "comparison_test_post")
        self.assertTrue(record["shouldWrite"])
        self.assertIn("market-specific guidance", record["contentGapJson"]["missingAngles"])


if __name__ == "__main__":
    unittest.main()
