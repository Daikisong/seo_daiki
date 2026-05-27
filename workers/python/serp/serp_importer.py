from __future__ import annotations

from pathlib import Path
from typing import Any

from workers.python.common import DATA, read_csv, read_json, slugify, write_json
from workers.python.serp.analysis_rules import clean, domain_for, integer, truthy
from workers.python.serp.serp_artifacts import SERP_RESULTS_PATH, now


def import_serp_results(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "serp-results.csv"
    rows = read_csv(seed_path)
    snapshots: dict[str, dict[str, Any]] = {}
    results = []
    for row in rows:
        market = clean(row.get("market"))
        language = clean(row.get("language"))
        keyword = clean(row.get("keyword"))
        snapshot_id = clean(row.get("snapshot_id")) or f"serp-snapshot-{slugify(f'{market} {language} {keyword}')}"
        snapshot = snapshots.setdefault(
            snapshot_id,
            {
                "id": snapshot_id,
                "market": market,
                "language": language,
                "country": clean(row.get("country")).upper(),
                "keywordId": clean(row.get("keyword_id")) or f"trend-keyword-{slugify(f'{market} {language} {keyword}')}",
                "keyword": keyword,
                "provider": clean(row.get("provider")) or "manual_csv",
                "collectedAt": clean(row.get("collected_at")) or now(),
                "status": "imported",
                "rawJson": {"sourceFile": str(seed_path)},
                "topResultCount": 0,
            },
        )
        result_id_source = f"{snapshot_id} {row.get('rank')}"
        result = {
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
        results.append(result)
        snapshot["topResultCount"] += 1
    return str(write_json(SERP_RESULTS_PATH, {"snapshots": list(snapshots.values()), "results": sorted(results, key=lambda item: (item["snapshotId"], item["rank"]))}))


def collect_serp(keyword_id: str | None = None, provider: str = "manual_csv") -> str:
    payload = read_json(SERP_RESULTS_PATH, {"snapshots": [], "results": []})
    snapshots = [
        snapshot
        for snapshot in payload.get("snapshots", [])
        if isinstance(snapshot, dict)
        and (not keyword_id or snapshot.get("keywordId") == keyword_id)
        and snapshot.get("provider") == provider
    ]
    return str(write_json(DATA / "exports" / "serp_collect_report.json", {"provider": provider, "snapshots": snapshots}))


def fetch_serp_pages(snapshot_id: str | None = None) -> str:
    payload = read_json(SERP_RESULTS_PATH, {"snapshots": [], "results": []})
    updated = []
    for result in payload.get("results", []):
        if not isinstance(result, dict):
            continue
        row = dict(result)
        if not snapshot_id or row.get("snapshotId") == snapshot_id:
            row["contentFetchedStatus"] = "summary_only"
            row["contentFetchPolicy"] = "Stored URL, title, snippet, headings/summary only; no full article body."
        updated.append(row)
    return str(write_json(SERP_RESULTS_PATH, {"snapshots": payload.get("snapshots", []), "results": updated}))
