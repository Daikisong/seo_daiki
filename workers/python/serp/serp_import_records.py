from __future__ import annotations

from collections.abc import Callable
from pathlib import Path
from typing import Any

from workers.python.common import slugify
from workers.python.serp.analysis_rules import clean, domain_for, integer, truthy


def snapshot_identity(row: dict[str, Any]) -> tuple[str, str, str]:
    return (clean(row.get("market")), clean(row.get("language")), clean(row.get("keyword")))


def snapshot_id_for_row(row: dict[str, Any]) -> str:
    market, language, keyword = snapshot_identity(row)
    return clean(row.get("snapshot_id")) or f"serp-snapshot-{slugify(f'{market} {language} {keyword}')}"


def keyword_id_for_row(row: dict[str, Any]) -> str:
    market, language, keyword = snapshot_identity(row)
    return clean(row.get("keyword_id")) or f"trend-keyword-{slugify(f'{market} {language} {keyword}')}"


def serp_snapshot_record(row: dict[str, Any], snapshot_id: str, seed_path: Path, now_factory: Callable[[], str]) -> dict[str, Any]:
    market, language, keyword = snapshot_identity(row)
    return {
        "id": snapshot_id,
        "market": market,
        "language": language,
        "country": clean(row.get("country")).upper(),
        "keywordId": keyword_id_for_row(row),
        "keyword": keyword,
        "provider": clean(row.get("provider")) or "manual_csv",
        "collectedAt": clean(row.get("collected_at")) or now_factory(),
        "status": "imported",
        "rawJson": {"sourceFile": str(seed_path)},
        "topResultCount": 0,
    }


def serp_result_record(row: dict[str, Any], snapshot_id: str, language: str) -> dict[str, Any]:
    result_id_source = f"{snapshot_id} {row.get('rank')}"
    return {
        "id": clean(row.get("result_id")) or f"serp-result-{slugify(result_id_source)}",
        "snapshotId": snapshot_id,
        "rank": integer(row.get("rank"), 0),
        "url": clean(row.get("url")),
        "domain": clean(row.get("domain")) or domain_for(clean(row.get("url"))),
        "title": clean(row.get("title")),
        "snippet": clean(row.get("snippet")),
        "resultType": clean(row.get("result_type")) or "article",
        "dateHint": clean(row.get("date_hint")) or None,
        "isForum": truthy(row.get("is_forum")),
        "isVideo": truthy(row.get("is_video")),
        "isEcommerce": truthy(row.get("is_ecommerce")),
        "isAffiliateLikely": truthy(row.get("is_affiliate_likely")),
        "isPublisher": truthy(row.get("is_publisher")),
        "languageGuess": clean(row.get("language_guess")) or language,
        "contentFetchedStatus": "manual_summary_available",
        "contentAnalysisStatus": "pending",
    }


def sorted_serp_results(results: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(results, key=lambda item: (item["snapshotId"], item["rank"]))


def serp_import_payload(rows: list[dict[str, Any]], seed_path: Path, now_factory: Callable[[], str]) -> dict[str, list[dict[str, Any]]]:
    snapshots: dict[str, dict[str, Any]] = {}
    results = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        snapshot_id = snapshot_id_for_row(row)
        snapshot = snapshots.setdefault(snapshot_id, serp_snapshot_record(row, snapshot_id, seed_path, now_factory))
        result = serp_result_record(row, snapshot_id, str(snapshot.get("language") or ""))
        results.append(result)
        snapshot["topResultCount"] += 1
    return {"snapshots": list(snapshots.values()), "results": sorted_serp_results(results)}
