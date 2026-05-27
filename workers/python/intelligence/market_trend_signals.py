from __future__ import annotations

from pathlib import Path
from typing import Any

from workers.python.common import DATA, read_csv, read_json, slugify, write_json
from workers.python.intelligence.market_trend_artifacts import (
    MARKET_TREND_SIGNALS_PATH,
    MARKET_TREND_SOURCES_PATH,
    clean,
    now,
)
from workers.python.intelligence.trend_rules import (
    bucket,
    infer_category,
    integer,
    market_from_country,
    normalize_keyword,
    score,
)


def import_market_trend_signals(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "trend-signals.csv"
    payload = market_trend_import_payload(read_csv(seed_path), seed_path)
    write_json(MARKET_TREND_SOURCES_PATH, {"sources": payload["sources"]})
    return str(write_json(MARKET_TREND_SIGNALS_PATH, payload))


def market_trend_import_payload(rows: list[dict[str, Any]], seed_path: Path) -> dict[str, Any]:
    sources_by_key: dict[str, dict[str, Any]] = {}
    signals = []
    for index, row in enumerate(rows, start=1):
        market = clean(row.get("market")) or market_from_country(clean(row.get("country")))
        language = clean(row.get("language")) or clean(row.get("locale")) or "en"
        country = clean(row.get("country")).upper() or market.upper()
        source_type = clean(row.get("source_type")) or "manual_csv"
        source_key = f"{market}-{language}-{source_type}"
        source = sources_by_key.setdefault(
            source_key,
            {
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
                "lastCollectedAt": now(),
            },
        )
        raw_keyword = clean(row.get("raw_keyword")) or clean(row.get("query"))
        normalized_keyword = clean(row.get("normalized_keyword")) or normalize_keyword(raw_keyword)
        topic_raw = clean(row.get("topic_raw")) or normalized_keyword
        signal = {
            "id": f"market-trend-signal-{slugify(f'{source_key} {normalized_keyword} {index}')}",
            "sourceId": source["id"],
            "sourceType": source_type,
            "market": market,
            "language": language,
            "country": country,
            "rawKeyword": raw_keyword,
            "normalizedKeyword": normalized_keyword,
            "topicRaw": topic_raw,
            "categoryGuess": clean(row.get("category_guess")) or infer_category(topic_raw),
            "url": clean(row.get("url")) or None,
            "observedAt": clean(row.get("observed_at")) or clean(row.get("captured_at")) or now(),
            "sourceRank": integer(row.get("source_rank"), index),
            "sourceVolumeBucket": clean(row.get("source_volume_bucket")) or bucket(score(row.get("volume_score"))),
            "relativeGrowth": score(row.get("relative_growth")) or score(row.get("growth_score")),
            "velocityScore": score(row.get("velocity_score")) or score(row.get("growth_score")),
            "freshnessScore": score(row.get("freshness_score")),
            "commercialHintScore": score(row.get("commercial_hint_score")) or score(row.get("commercial_score")),
            "evidenceHintScore": score(row.get("evidence_hint_score")) or score(row.get("evidence_fit_score")),
            "localeSpecificityScore": score(row.get("locale_specificity_score")) or (80 if market else 40),
            "status": "raw",
            "rawJson": dict(row),
        }
        signals.append(signal)
    return {"sources": list(sources_by_key.values()), "signals": signals}


def collect_market_trends(market: str | None = None, source: str | None = None) -> str:
    payload = read_json(MARKET_TREND_SIGNALS_PATH, {"signals": []})
    signals = [
        signal
        for signal in payload.get("signals", [])
        if isinstance(signal, dict)
        and (not market or signal.get("market") == market)
        and (not source or signal.get("sourceType") == source)
    ]
    return str(write_json(DATA / "exports" / "trend_collect_report.json", {"market": market, "source": source, "signals": signals}))


def normalize_market_trends() -> str:
    payload = read_json(MARKET_TREND_SIGNALS_PATH, {"sources": [], "signals": []})
    signals = []
    for signal in payload.get("signals", []):
        if not isinstance(signal, dict):
            continue
        normalized = dict(signal)
        normalized["normalizedKeyword"] = normalize_keyword(str(normalized.get("normalizedKeyword") or normalized.get("rawKeyword") or ""))
        normalized["status"] = "normalized"
        signals.append(normalized)
    return str(write_json(MARKET_TREND_SIGNALS_PATH, {"sources": payload.get("sources", []), "signals": signals}))
