from __future__ import annotations

from pathlib import Path

from workers.python.common import DATA, read_csv, write_json


def seed_products(file: Path) -> Path:
    rows = read_csv(file)
    candidates = []
    for row in rows:
        candidates.append(
            {
                "source_url": row["source_url"],
                "product_id": row["product_id"],
                "title": row["title"],
                "image_url": row["image_url"],
                "price": float(row["price"]),
                "shipping": float(row.get("shipping") or 0),
                "currency": row["currency"],
                "seller": row["seller"],
                "affiliate_url": row.get("affiliate_url") or f"https://example.com/go/{row['product_id']}",
                "orders": int(row.get("orders") or 0),
                "rating": float(row.get("rating") or 0),
                "category": row["category"],
                "options": [option.strip() for option in row.get("options", "").split("|") if option.strip()],
                "raw_json": row,
                "captured_at": row.get("captured_at") or "2026-05-25"
            }
        )
    return write_json(DATA / "raw" / "raw_product_candidates.json", candidates)
