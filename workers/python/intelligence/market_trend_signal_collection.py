from __future__ import annotations

from typing import Any


def market_trend_collect_payload(payload: dict[str, Any], market: str | None = None, source: str | None = None) -> dict[str, Any]:
    signals = [
        signal
        for signal in payload.get("signals", [])
        if isinstance(signal, dict)
        and (not market or signal.get("market") == market)
        and (not source or signal.get("sourceType") == source)
    ]
    return {"market": market, "source": source, "signals": signals}
