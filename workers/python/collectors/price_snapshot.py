from __future__ import annotations

from workers.python.common import DATA, read_json, write_json


def snapshot_prices() -> str:
    candidates = read_json(DATA / "raw" / "raw_product_candidates.json", [])
    snapshots = []
    for item in candidates:
        final_price = round(float(item["price"]) + float(item.get("shipping") or 0), 2)
        snapshots.append(
            {
                "product_id": item["product_id"],
                "currency": item["currency"],
                "price": item["price"],
                "shipping": item.get("shipping", 0),
                "coupon": 0,
                "final_price": final_price,
                "captured_at": item["captured_at"],
                "source_url": item["source_url"]
            }
        )
    path = write_json(DATA / "snapshots" / "price_snapshots.json", snapshots)
    return str(path)
