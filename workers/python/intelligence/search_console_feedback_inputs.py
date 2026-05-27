from __future__ import annotations

from workers.python.common import DATA, read_json

SEARCH_CONSOLE_ROWS_PATH = DATA / "snapshots" / "search_console_rows.json"
SEARCH_CONSOLE_SAMPLE_PATH = DATA / "snapshots" / "search_console_sample.json"
URL_INVENTORY_PATH = DATA / "exports" / "initial_url_inventory.json"


def search_console_rows() -> list[dict[str, object]]:
    rows = read_json(SEARCH_CONSOLE_ROWS_PATH, None)
    if rows:
        return rows
    return read_json(SEARCH_CONSOLE_SAMPLE_PATH, [])


def url_inventory() -> list[dict[str, object]]:
    return read_json(URL_INVENTORY_PATH, [])
