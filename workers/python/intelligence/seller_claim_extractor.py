from __future__ import annotations

import re

from workers.python.common import DATA, read_json, write_json


def extract_seller_claims() -> str:
    candidates = read_json(DATA / "raw" / "raw_product_candidates.json", [])
    claims = []
    for item in candidates:
        title = str(item["title"])
        watts = re.findall(r"\b\d{2,3}\s*w\b", title.lower())
        for watt in watts:
            claims.append(
                {
                    "product_id": item["product_id"],
                    "claim_type": "max_output",
                    "claim_value": watt.upper().replace(" ", ""),
                    "raw_text": title,
                    "source_url": item["source_url"],
                    "confidence": 0.7
                }
            )
        capacities = re.findall(r"\b\d{4,6}\s*mah\b", title.lower())
        for capacity in capacities:
            claims.append(
                {
                    "product_id": item["product_id"],
                    "claim_type": "capacity",
                    "claim_value": capacity.upper().replace(" ", ""),
                    "raw_text": title,
                    "source_url": item["source_url"],
                    "confidence": 0.68
                }
            )
        torque_values = re.findall(r"\b\d+(?:\.\d+)?\s*nm\b", title.lower())
        for torque in torque_values:
            claims.append(
                {
                    "product_id": item["product_id"],
                    "claim_type": "torque",
                    "claim_value": torque.upper().replace(" ", ""),
                    "raw_text": title,
                    "source_url": item["source_url"],
                    "confidence": 0.64
                }
            )
        if "pps" in title.lower():
            claims.append(
                {
                    "product_id": item["product_id"],
                    "claim_type": "charging_profile",
                    "claim_value": "PPS",
                    "raw_text": title,
                    "source_url": item["source_url"],
                    "confidence": 0.6
                }
            )
        if "zigbee" in title.lower():
            claims.append(
                {
                    "product_id": item["product_id"],
                    "claim_type": "protocol",
                    "claim_value": "Zigbee",
                    "raw_text": title,
                    "source_url": item["source_url"],
                    "confidence": 0.66
                }
            )
        if "e marker" in title.lower() or "e-marker" in title.lower():
            claims.append(
                {
                    "product_id": item["product_id"],
                    "claim_type": "e_marker",
                    "claim_value": "E-marker claimed",
                    "raw_text": title,
                    "source_url": item["source_url"],
                    "confidence": 0.62
                }
            )
    path = write_json(DATA / "snapshots" / "seller_claims.json", claims)
    return str(path)
