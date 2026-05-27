from __future__ import annotations

from pathlib import Path
from typing import Any

from workers.python.common import DATA, read_csv, read_json, write_json
from workers.python.intelligence.market_trend_artifacts import (
    MARKET_TREND_SIGNALS_PATH,
    MARKET_TREND_SOURCES_PATH,
    now,
)
from workers.python.intelligence.market_trend_signal_collection import market_trend_collect_payload
from workers.python.intelligence.market_trend_signal_import_records import market_trend_import_records
from workers.python.intelligence.market_trend_signal_normalization import normalized_market_trend_payload


def import_market_trend_signals(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "trend-signals.csv"
    payload = market_trend_import_payload(read_csv(seed_path), seed_path)
    write_json(MARKET_TREND_SOURCES_PATH, {"sources": payload["sources"]})
    return str(write_json(MARKET_TREND_SIGNALS_PATH, payload))


def market_trend_import_payload(rows: list[dict[str, Any]], seed_path: Path) -> dict[str, Any]:
    return market_trend_import_records(rows, seed_path, timestamp=now)


def collect_market_trends(market: str | None = None, source: str | None = None) -> str:
    payload = read_json(MARKET_TREND_SIGNALS_PATH, {"signals": []})
    return str(write_json(DATA / "exports" / "trend_collect_report.json", market_trend_collect_payload(payload, market, source)))


def normalize_market_trends() -> str:
    payload = read_json(MARKET_TREND_SIGNALS_PATH, {"sources": [], "signals": []})
    return str(write_json(MARKET_TREND_SIGNALS_PATH, normalized_market_trend_payload(payload)))
