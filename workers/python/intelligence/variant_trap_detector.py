from __future__ import annotations

import re

from workers.python.common import DATA, read_json, write_json


def detect_variant_traps() -> str:
    candidates = read_json(DATA / "raw" / "raw_product_candidates.json", [])
    traps = []
    for item in candidates:
        title = str(item["title"])
        title_watts = _watts(title)
        title_capacity = _mah(title)
        for option in item.get("options", []):
            option_text = str(option)
            option_watts = _watts(option_text)
            option_capacity = _mah(option_text)
            option_lower = option_text.lower()
            flags = []
            if title_watts and option_watts and option_watts < title_watts:
                flags.append(f"Title says {title_watts}W, but selected option is {option_watts}W.")
            if title_capacity and option_capacity and option_capacity < title_capacity:
                flags.append(f"Title says {title_capacity}mAh, but selected option is {option_capacity}mAh.")
            if "no cable" in option_lower:
                flags.append("Cable not included in this option.")
            if "eu" in option_lower and "us" in title.lower():
                flags.append("Plug type differs between listing text and selected SKU.")
            if "only" in option_lower or "no bits" in option_lower or "handle only" in option_lower:
                flags.append("Accessory-only option can be mistaken for the full product.")
            if "zigbee" in title.lower() and "wi-fi" in option_lower:
                flags.append("Wi-Fi option can be mistaken for the Zigbee version.")
            if flags:
                traps.append({"product_id": item["product_id"], "option": option_text, "risk_flags": flags})
    path = write_json(DATA / "snapshots" / "variant_traps.json", traps)
    return str(path)


def _watts(value: str) -> int | None:
    match = re.search(r"(\d{2,3})\s*w", value.lower())
    return int(match.group(1)) if match else None


def _mah(value: str) -> int | None:
    match = re.search(r"(\d{4,6})\s*mah", value.lower())
    return int(match.group(1)) if match else None
