from __future__ import annotations

from workers.python.common import DATA, read_json, write_json
from workers.python.intelligence.market_trend_artifacts import MARKET_TREND_REPORT_PATH


def trend_report(market: str | None = None) -> str:
    payload = read_json(MARKET_TREND_REPORT_PATH, {"clusters": [], "crossMarketPatterns": []})
    if market:
        clusters = [cluster for cluster in payload.get("clusters", []) if isinstance(cluster, dict) and cluster.get("market") == market]
        return str(write_json(DATA / "exports" / f"trend_report_{market}.json", {"market": market, "clusters": clusters}))
    return str(write_json(MARKET_TREND_REPORT_PATH, payload))
