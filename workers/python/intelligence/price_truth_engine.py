from __future__ import annotations

from workers.python.common import DATA, read_json, write_json
from workers.python.intelligence.price_truth_rules import (
    CATEGORY_THRESHOLDS,
    avoid_reasons_for_price,
    price_truth,
    price_truth_from_values,
)
from workers.python.intelligence.price_truth_snapshots import price_truth_for_snapshot
from workers.python.intelligence.price_truth_values import number_value, string_value


def build_price_truth() -> str:
    products = {str(item.get("product_id")): item for item in read_json(DATA / "raw" / "raw_product_candidates.json", [])}
    snapshots = read_json(DATA / "snapshots" / "price_snapshots.json", [])
    variant_traps = read_json(DATA / "snapshots" / "variant_traps.json", [])

    rows = [
        price_truth_for_snapshot(snapshot, products.get(str(snapshot.get("product_id")), {}), variant_traps)
        for snapshot in snapshots
        if isinstance(snapshot, dict)
    ]
    path = write_json(DATA / "snapshots" / "price_truth.json", rows)
    return str(path)
