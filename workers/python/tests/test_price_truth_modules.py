from __future__ import annotations

import unittest

from workers.python.intelligence import price_truth_engine
from workers.python.intelligence.price_truth_rules import (
    avoid_reasons_for_price,
    price_truth,
    price_truth_from_values,
)
from workers.python.intelligence.price_truth_snapshots import price_truth_for_snapshot
from workers.python.intelligence.price_truth_values import number_value, string_value


class PriceTruthModulesTest(unittest.TestCase):
    def test_engine_reexports_split_rule_and_snapshot_helpers(self) -> None:
        self.assertIs(price_truth_engine.price_truth, price_truth)
        self.assertIs(price_truth_engine.price_truth_from_values, price_truth_from_values)
        self.assertIs(price_truth_engine.price_truth_for_snapshot, price_truth_for_snapshot)
        self.assertIs(price_truth_engine.avoid_reasons_for_price, avoid_reasons_for_price)
        self.assertIs(price_truth_engine.number_value, number_value)
        self.assertIs(price_truth_engine.string_value, string_value)

    def test_price_zone_thresholds_match_existing_behavior(self) -> None:
        self.assertEqual(price_truth_from_values(17.99, "usb-c-chargers")["current_zone"], "buy")
        self.assertEqual(price_truth_from_values(18, "usb-c-chargers")["current_zone"], "wait")
        self.assertEqual(price_truth_from_values(24, "usb-c-chargers")["current_zone"], "avoid")
        self.assertEqual(price_truth_from_values(44.99, "power-banks")["current_zone"], "buy")
        self.assertEqual(price_truth_from_values(20, "unknown")["wait_zone"], "$18-$24 shipped")

    def test_snapshot_price_truth_normalizes_prices_and_variant_traps(self) -> None:
        row = price_truth_for_snapshot(
            {
                "product_id": "charger-1",
                "currency": "USD",
                "price": "30",
                "shipping": "4.50",
                "coupon": "2",
                "captured_at": "2026-05-28",
            },
            {"category": "usb-c-chargers", "source_url": "https://example.com/product"},
            [
                {"product_id": "charger-1", "risk_flags": ["plug_mismatch", "plug_mismatch", "fake_coupon"]},
                {"product_id": "other", "risk_flags": ["wrong_product"]},
            ],
        )

        self.assertEqual(row["final_price"], 32.5)
        self.assertEqual(row["sale_price"], 28)
        self.assertEqual(row["current_zone"], "avoid")
        self.assertEqual(row["source_url"], "https://example.com/product")
        self.assertEqual(
            row["avoid_reasons"],
            [
                "Final shipped price is above the avoid threshold for this category.",
                "plug_mismatch",
                "fake_coupon",
            ],
        )

    def test_value_helpers_keep_bad_inputs_safe(self) -> None:
        self.assertEqual(number_value("12.345"), 12.35)
        self.assertEqual(number_value("not a number"), 0.0)
        self.assertEqual(string_value(None), "")
        self.assertEqual(string_value("  charger  "), "charger")


if __name__ == "__main__":
    unittest.main()
