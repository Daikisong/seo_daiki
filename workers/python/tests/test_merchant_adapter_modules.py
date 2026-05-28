from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from workers.python.merchants import merchant_adapters
from workers.python.merchants.disabled_live_adapters import (
    AliExpressLiveAdapter,
    AmazonLiveAdapter,
    IHerbLiveAdapter,
    TemuLiveAdapter,
    documentation_only_message,
)
from workers.python.merchants.existing_product_db_adapter import ExistingProductDbAdapter
from workers.python.merchants.manual_csv_adapter import ManualCsvMerchantAdapter, row_matches_candidate_query
from workers.python.merchants.merchant_adapter_contract import MerchantAdapter


class MerchantAdapterModulesTest(unittest.TestCase):
    def test_merchant_adapter_facade_keeps_public_exports(self) -> None:
        self.assertIs(merchant_adapters.ManualCsvMerchantAdapter, ManualCsvMerchantAdapter)
        self.assertIs(merchant_adapters.ExistingProductDbAdapter, ExistingProductDbAdapter)
        self.assertIs(merchant_adapters.AliExpressLiveAdapter, AliExpressLiveAdapter)
        self.assertIs(merchant_adapters.MerchantAdapter, MerchantAdapter)

    def test_manual_csv_adapter_searches_matching_market_language_and_title_tokens(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "candidates.csv"
            path.write_text(
                "\n".join([
                    "id,market,language,title,source_mode",
                    "candidate-1,us,en,Magnesium sleep capsule,",
                    "candidate-2,es,es,Magnesium sleep capsule,",
                    "candidate-3,us,en,USB C charger,manual_feed",
                ]),
                encoding="utf-8",
            )

            adapter = ManualCsvMerchantAdapter(path)
            matches = adapter.search_candidates("sleep magnesium", "us", "en")
            self.assertTrue(adapter.validate_credentials())

        self.assertEqual([match["id"] for match in matches], ["candidate-1"])
        self.assertEqual(matches[0]["sourceMode"], "manual_csv_now")

    def test_manual_csv_adapter_keeps_affiliate_url_generation_blocked(self) -> None:
        adapter = ManualCsvMerchantAdapter(Path("missing.csv"))

        self.assertFalse(adapter.validate_credentials())
        self.assertEqual(adapter.refresh_offer("candidate-1")["status"], "manual_refresh_required")
        self.assertEqual(adapter.validate_policy({"id": "candidate-1"})["status"], "human_review_required")
        self.assertIn("sponsored nofollow", " ".join(adapter.get_required_disclosures()))
        with self.assertRaisesRegex(NotImplementedError, "do not create affiliate URLs"):
            adapter.build_affiliate_url({}, {})

    def test_existing_product_db_adapter_is_available_but_not_monetized(self) -> None:
        adapter = ExistingProductDbAdapter()

        self.assertTrue(adapter.validate_credentials())
        self.assertEqual(adapter.search_candidates("charger", "us", "en"), [])
        self.assertEqual(adapter.normalize_candidate({"id": "product-1"})["sourceMode"], "existing_product_db_now")
        self.assertEqual(adapter.refresh_offer("product-1")["status"], "existing_db_refresh_required")
        self.assertEqual(adapter.validate_policy({"id": "product-1"})["status"], "human_review_required")
        with self.assertRaisesRegex(NotImplementedError, "does not create monetized links"):
            adapter.build_affiliate_url({}, {})

    def test_live_adapters_remain_documentation_only(self) -> None:
        for adapter_class in [AliExpressLiveAdapter, TemuLiveAdapter, AmazonLiveAdapter, IHerbLiveAdapter]:
            adapter = adapter_class()
            with self.subTest(adapter=adapter.name):
                self.assertEqual(documentation_only_message(adapter.name), f"{adapter.name} is documentation-only in this phase.")
                with self.assertRaisesRegex(NotImplementedError, "documentation-only"):
                    adapter.validate_credentials()
                with self.assertRaisesRegex(NotImplementedError, "documentation-only"):
                    adapter.search_candidates("charger", "us", "en")
                with self.assertRaisesRegex(NotImplementedError, "documentation-only"):
                    adapter.build_affiliate_url({}, {})

    def test_row_matcher_requires_market_language_and_any_title_token(self) -> None:
        row = {"market": "us", "language": "en", "title": "USB C charger"}

        self.assertTrue(row_matches_candidate_query(row, {"charger"}, "us", "en"))
        self.assertFalse(row_matches_candidate_query(row, {"charger"}, "es", "en"))
        self.assertFalse(row_matches_candidate_query(row, {"charger"}, "us", "es"))
        self.assertFalse(row_matches_candidate_query(row, {"magnesium"}, "us", "en"))


if __name__ == "__main__":
    unittest.main()
