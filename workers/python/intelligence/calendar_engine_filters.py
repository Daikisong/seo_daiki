from __future__ import annotations

from typing import Any


def enabled_market_configs(markets: list[dict[str, Any]], market: str | None = None) -> list[dict[str, Any]]:
    return [
        market_config
        for market_config in markets
        if market_config.get("enabled") and (not market or market_config.get("market") == market)
    ]


def market_items(items: list[dict[str, Any]], market: str, language: str) -> list[dict[str, Any]]:
    return [item for item in items if item.get("market") == market and item.get("language") == language]


def records_by_key(items: list[dict[str, Any]], key: str) -> dict[object, dict[str, Any]]:
    return {item.get(key): item for item in items}
