from __future__ import annotations

from pathlib import Path
from typing import Any, Callable

from workers.python.common import slugify
from workers.python.intelligence.market_trend_artifacts import clean
from workers.python.intelligence.trend_rules import (
    bucket,
    infer_category,
    integer,
    market_from_country,
    normalize_keyword,
    score,
)


def market_trend_import_records(
    rows: list[dict[str, Any]],
    seed_path: Path,
    timestamp: Callable[[], str],
) -> dict[str, Any]:
    sources_by_key: dict[str, dict[str, Any]] = {}
    signals = []
    for index, row in enumerate(rows, start=1):
        market = clean(row.get("market")) or market_from_country(clean(row.get("country")))
        language = clean(row.get("language")) or clean(row.get("locale")) or "en"
        country = clean(row.get("country")).upper() or market.upper()
        source_type = clean(row.get("source_type")) or "manual_csv"
        source_key = market_trend_source_key(market, language, source_type)
        source = sources_by_key.setdefault(
            source_key,
            market_trend_source_record(row, seed_path, source_key, source_type, market, language, country, timestamp),
        )
        signals.append(market_trend_signal_record(row, index, source, source_key, source_type, market, language, country, timestamp))
    return {"sources": list(sources_by_key.values()), "signals": signals}


def market_trend_source_key(market: str, language: str, source_type: str) -> str:
    return f"{market}-{language}-{source_type}"


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


def market_trend_signal_record(
    row: dict[str, Any],
    index: int,
    source: dict[str, Any],
    source_key: str,
    source_type: str,
    market: str,
    language: str,
    country: str,
    timestamp: Callable[[], str],
) -> dict[str, Any]:
    raw_keyword = clean(row.get("raw_keyword")) or clean(row.get("query"))
    normalized_keyword = clean(row.get("normalized_keyword")) or normalize_keyword(raw_keyword)
    topic_raw = clean(row.get("topic_raw")) or normalized_keyword
    return {
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
        "observedAt": clean(row.get("observed_at")) or clean(row.get("captured_at")) or timestamp(),
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
