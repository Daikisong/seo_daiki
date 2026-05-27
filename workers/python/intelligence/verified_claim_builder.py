from __future__ import annotations

from workers.python.common import DATA, read_json, write_json
from workers.python.intelligence.verified_claim_extractors import extract_mah, extract_torque, extract_watts
from workers.python.intelligence.verified_claim_records import (
    capacity_verified_claim,
    power_verified_claim,
    torque_verified_claim,
    verified_claim_records,
    verified_claim_records_for_item,
    zigbee_verified_claim,
)


def build_verified_claims() -> str:
    candidates = read_json(DATA / "raw" / "raw_product_candidates.json", [])
    path = write_json(DATA / "snapshots" / "verified_claims.json", verified_claim_records(candidates))
    return str(path)


_watts = extract_watts
_mah = extract_mah
_torque = extract_torque


__all__ = [
    "_mah",
    "_torque",
    "_watts",
    "build_verified_claims",
    "capacity_verified_claim",
    "extract_mah",
    "extract_torque",
    "extract_watts",
    "power_verified_claim",
    "torque_verified_claim",
    "verified_claim_records",
    "verified_claim_records_for_item",
    "zigbee_verified_claim",
]
