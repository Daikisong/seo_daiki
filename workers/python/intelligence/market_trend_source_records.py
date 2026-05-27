from __future__ import annotations

from pathlib import Path
from typing import Any, Callable

from workers.python.intelligence.market_trend_artifacts import clean


def market_trend_source_record(
    row: dict[str, Any],
    seed_path: Path,
    source_key: str,
    source_type: str,
    market: str,
    language: str,
    country: str,
    timestamp: Callable[[], str],
) -> dict[str, Any]:
    return {
        "id": f"trend-source-{source_key}",
        "sourceType": source_type,
        "name": clean(row.get("source_name")) or f"{country} {language} {source_type}",
        "market": market,
        "language": language,
        "country": country,
        "enabled": True,
        "reliabilityTier": clean(row.get("reliability_tier")) or "manual_reviewed",
        "collectionMode": clean(row.get("collection_mode")) or "manual_csv",
        "configJson": {"importFile": str(seed_path)},
        "lastCollectedAt": timestamp(),
    }
