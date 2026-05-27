from __future__ import annotations

from pathlib import Path
from typing import Any

from workers.python.common import slugify
from workers.python.intelligence.trend_topic_rules import clean, score


def trend_import_payload(rows: list[dict[str, Any]], seed_path: Path, default_captured_at: str) -> dict[str, list[dict[str, Any]]]:
    sources: dict[str, dict[str, Any]] = {}
    signals: list[dict[str, Any]] = []

    for index, row in enumerate(rows, start=1):
        source_slug = clean(row.get("source_slug")) or "manual-csv"
        source = sources.setdefault(source_slug, trend_source_record(row, source_slug, seed_path))
        signals.append(trend_signal_record(row, index, source, source_slug, default_captured_at))

    return {"sources": list(sources.values()), "signals": signals}


def trend_source_record(row: dict[str, Any], source_slug: str, seed_path: Path) -> dict[str, Any]:
    return {
        "id": f"trend-source-{source_slug}",
        "name": clean(row.get("source_name")) or source_slug.replace("-", " ").title(),
        "slug": source_slug,
        "sourceType": clean(row.get("source_type")) or "manual_csv",
        "locale": clean(row.get("source_locale")) or clean(row.get("locale")) or None,
        "country": clean(row.get("source_country")) or clean(row.get("country")) or None,
        "enabled": True,
        "configJson": {"import_file": str(seed_path)}
    }


def trend_signal_record(
    row: dict[str, Any],
    index: int,
    source: dict[str, Any],
    source_slug: str,
    default_captured_at: str,
) -> dict[str, Any]:
    locale = clean(row.get("locale")) or source.get("locale") or "en"
    query = clean(row.get("query"))
    topic_raw = clean(row.get("topic_raw")) or query
    signal_id = f"trend-signal-{slugify(f'{source_slug} {locale} {query} {index}')}"

    return {
        "id": signal_id,
        "sourceId": source["id"],
        "locale": locale,
        "country": clean(row.get("country")) or source.get("country"),
        "query": query,
        "topicRaw": topic_raw,
        "url": clean(row.get("url")) or None,
        "volumeScore": score(row.get("volume_score")),
        "growthScore": score(row.get("growth_score")),
        "competitionScore": score(row.get("competition_score")),
        "commercialScore": score(row.get("commercial_score")),
        "freshnessScore": score(row.get("freshness_score")),
        "evidenceFitScore": score(row.get("evidence_fit_score")),
        "affiliateFitScore": score(row.get("affiliate_fit_score")),
        "capturedAt": clean(row.get("captured_at")) or default_captured_at,
    }
