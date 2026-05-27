from __future__ import annotations

from workers.python.common import read_json, write_json
from workers.python.intelligence.market_trend_artifacts import MARKETS_PATH, MARKET_TREND_SOURCES_PATH


def init_markets() -> str:
    markets = read_json(MARKETS_PATH, [])
    sources = []
    for market in markets:
        if not isinstance(market, dict) or not market.get("enabled"):
            continue
        sources.append(
            {
                "id": f"trend-source-{market['market']}-{market['language']}-manual-csv",
                "sourceType": "manual_csv",
                "name": f"{market['country']} {market['language']} manual trend feed",
                "market": market["market"],
                "language": market["language"],
                "country": market["country"],
                "enabled": True,
                "reliabilityTier": "manual_reviewed",
                "collectionMode": "manual_csv",
                "configJson": {"feedPath": market["trendFeedPath"], "trendsGeo": market["trendsGeo"]},
                "lastCollectedAt": None,
            }
        )
    return str(write_json(MARKET_TREND_SOURCES_PATH, {"sources": sources}))
