from __future__ import annotations

from typing import Any

from workers.python.intelligence.trend_rules import normalize_keyword


def normalized_market_trend_payload(payload: dict[str, Any]) -> dict[str, Any]:
    signals = []
    for signal in payload.get("signals", []):
        if not isinstance(signal, dict):
            continue
        normalized = dict(signal)
        normalized["normalizedKeyword"] = normalize_keyword(str(normalized.get("normalizedKeyword") or normalized.get("rawKeyword") or ""))
        normalized["status"] = "normalized"
        signals.append(normalized)
    return {"sources": payload.get("sources", []), "signals": signals}
