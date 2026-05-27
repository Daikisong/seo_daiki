from __future__ import annotations

import unittest

from workers.python.intelligence import verified_claim_builder
from workers.python.intelligence.verified_claim_extractors import extract_mah, extract_torque, extract_watts
from workers.python.intelligence.verified_claim_records import (
    capacity_verified_claim,
    power_verified_claim,
    torque_verified_claim,
    verified_claim_records,
    verified_claim_records_for_item,
    zigbee_verified_claim,
)


class VerifiedClaimBuilderModuleTests(unittest.TestCase):
    def test_legacy_builder_reexports_split_helpers(self) -> None:
        self.assertIs(verified_claim_builder.extract_watts, extract_watts)
        self.assertIs(verified_claim_builder.extract_mah, extract_mah)
        self.assertIs(verified_claim_builder.extract_torque, extract_torque)
        self.assertIs(verified_claim_builder._watts, extract_watts)
        self.assertIs(verified_claim_builder._mah, extract_mah)
        self.assertIs(verified_claim_builder._torque, extract_torque)
        self.assertIs(verified_claim_builder.power_verified_claim, power_verified_claim)
        self.assertIs(verified_claim_builder.capacity_verified_claim, capacity_verified_claim)
        self.assertIs(verified_claim_builder.torque_verified_claim, torque_verified_claim)
        self.assertIs(verified_claim_builder.verified_claim_records, verified_claim_records)
        self.assertIs(verified_claim_builder.verified_claim_records_for_item, verified_claim_records_for_item)
        self.assertIs(verified_claim_builder.zigbee_verified_claim, zigbee_verified_claim)

    def test_extractors_keep_existing_patterns(self) -> None:
        self.assertEqual(extract_watts("Compact 65W charger"), 65)
        self.assertEqual(extract_mah("Power bank 20000 mAh"), 20000)
        self.assertEqual(extract_torque("Mini driver 4.2Nm"), 4.2)
        self.assertIsNone(extract_watts("charger"))

    def test_verified_claim_records_keep_existing_claim_values(self) -> None:
        candidates = [
            {
                "title": "100W USB-C cable",
                "product_id": "cable-1",
                "source_url": "https://example.com/cable",
                "category": "cable",
                "captured_at": "2026-05-28",
            },
            {
                "title": "65W GaN charger",
                "product_id": "charger-1",
                "source_url": "https://example.com/charger",
                "category": "charger",
            },
            {
                "title": "Power bank 20000mAh",
                "product_id": "bank-1",
                "source_url": "https://example.com/bank",
                "category": "power bank",
            },
            {
                "title": "Mini driver 4.2Nm Zigbee",
                "product_id": "driver-1",
                "source_url": "https://example.com/driver",
                "category": "tool",
            },
        ]

        claims = verified_claim_records(candidates)
        by_product = {claim["product_id"]: claim for claim in claims if claim["test_type"] != "pairing_check"}

        self.assertEqual(by_product["cable-1"]["test_type"], "e_marker")
        self.assertEqual(by_product["cable-1"]["result_value"], "Detected")
        self.assertEqual(by_product["charger-1"]["result_value"], "58")
        self.assertEqual(by_product["bank-1"]["result_value"], "60.7")
        self.assertEqual(by_product["driver-1"]["result_value"], "3.6")
        self.assertEqual(claims[-1]["test_type"], "pairing_check")
        self.assertEqual(claims[-1]["tested_at"], "2026-05-25")


if __name__ == "__main__":
    unittest.main()
