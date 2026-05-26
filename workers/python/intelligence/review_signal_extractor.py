from __future__ import annotations

from workers.python.common import DATA, read_json, write_json


def extract_review_signals() -> str:
    candidates = read_json(DATA / "raw" / "raw_product_candidates.json", [])
    signals = []
    for item in candidates:
        category = str(item["category"])
        base_topic = "wrong plug option" if "charger" in category else "selected variant mismatch"
        signals.extend(
            [
                {
                    "product_id": item["product_id"],
                    "locale": "en",
                    "topic": base_topic,
                    "sentiment": "negative",
                    "count": 8,
                    "confidence": 0.64,
                    "window": "90d"
                },
                {
                    "product_id": item["product_id"],
                    "locale": "es",
                    "topic": "confusion about listing options",
                    "sentiment": "negative",
                    "count": 5,
                    "confidence": 0.58,
                    "window": "90d"
                },
                {
                    "product_id": item["product_id"],
                    "locale": "pt-br",
                    "topic": "customs and delivery delay",
                    "sentiment": "negative",
                    "count": 6,
                    "confidence": 0.61,
                    "window": "90d"
                }
            ]
        )
    path = write_json(DATA / "snapshots" / "review_signals.json", signals)
    return str(path)
