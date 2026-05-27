from __future__ import annotations

from typing import Any

from workers.python.intelligence.market_trend_artifacts import clean
from workers.python.intelligence.trend_rules import market_from_country


def market_trend_market(row: dict[str, Any]) -> str:
    return clean(row.get("market")) or market_from_country(clean(row.get("country")))


def market_trend_language(row: dict[str, Any]) -> str:
    return clean(row.get("language")) or clean(row.get("locale")) or "en"


def market_trend_country(row: dict[str, Any], market: str) -> str:
    return clean(row.get("country")).upper() or market.upper()


def market_trend_source_type(row: dict[str, Any]) -> str:
    return clean(row.get("source_type")) or "manual_csv"


def market_trend_source_key(market: str, language: str, source_type: str) -> str:
    return f"{market}-{language}-{source_type}"
