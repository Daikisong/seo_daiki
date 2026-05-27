from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from workers.python.common import DATA

MARKETS_PATH = DATA / "config" / "markets.json"
MARKET_TREND_SOURCES_PATH = DATA / "exports" / "market_trend_sources.json"
MARKET_TREND_SIGNALS_PATH = DATA / "exports" / "market_trend_signals.json"
MARKET_TREND_CLUSTERS_PATH = DATA / "exports" / "trend_clusters.json"
MARKET_TREND_KEYWORDS_PATH = DATA / "exports" / "trend_keywords.json"
MARKET_TREND_REPORT_PATH = DATA / "exports" / "trend_report.json"


def clean(value: Any) -> str:
    return str(value or "").strip()


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
