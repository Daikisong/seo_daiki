from __future__ import annotations

from pathlib import Path
from typing import Any, Callable

from workers.python.intelligence.market_trend_signal_identity import (
    market_trend_country,
    market_trend_language,
    market_trend_market,
    market_trend_source_key,
    market_trend_source_type,
)
from workers.python.intelligence.market_trend_signal_records import market_trend_signal_record
from workers.python.intelligence.market_trend_source_records import market_trend_source_record


def market_trend_import_records(
    rows: list[dict[str, Any]],
    seed_path: Path,
    timestamp: Callable[[], str],
) -> dict[str, Any]:
    sources_by_key: dict[str, dict[str, Any]] = {}
    signals = []
    for index, row in enumerate(rows, start=1):
        market = market_trend_market(row)
        language = market_trend_language(row)
        country = market_trend_country(row, market)
        source_type = market_trend_source_type(row)
        source_key = market_trend_source_key(market, language, source_type)
        source = sources_by_key.setdefault(
            source_key,
            market_trend_source_record(row, seed_path, source_key, source_type, market, language, country, timestamp),
        )
        signals.append(market_trend_signal_record(row, index, source, source_key, source_type, market, language, country, timestamp))
    return {"sources": list(sources_by_key.values()), "signals": signals}


__all__ = [
    "market_trend_country",
    "market_trend_import_records",
    "market_trend_language",
    "market_trend_market",
    "market_trend_signal_record",
    "market_trend_source_key",
    "market_trend_source_record",
    "market_trend_source_type",
]
