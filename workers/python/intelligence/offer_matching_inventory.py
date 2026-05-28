from __future__ import annotations

from pathlib import Path
from typing import Any

from workers.python.common import read_csv
from workers.python.intelligence.offer_matching_normalization import offer_from_row


def load_offer_inventory(path: Path) -> list[dict[str, Any]]:
    rows = read_csv(path)
    return offer_inventory_from_rows(rows)


def offer_inventory_from_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [offer_from_row(row) for row in rows]
