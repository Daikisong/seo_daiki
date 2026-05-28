from __future__ import annotations

from typing import Any

SERP_CONTENT_FETCH_POLICY = "Stored URL, title, snippet, headings/summary only; no full article body."


def collect_serp_report_payload(payload: dict[str, Any], keyword_id: str | None = None, provider: str = "manual_csv") -> dict[str, Any]:
    snapshots = [
        snapshot
        for snapshot in payload.get("snapshots", [])
        if isinstance(snapshot, dict)
        and (not keyword_id or snapshot.get("keywordId") == keyword_id)
        and snapshot.get("provider") == provider
    ]
    return {"provider": provider, "snapshots": snapshots}


def fetched_serp_result_record(result: dict[str, Any], snapshot_id: str | None = None) -> dict[str, Any]:
    row = dict(result)
    if not snapshot_id or row.get("snapshotId") == snapshot_id:
        row["contentFetchedStatus"] = "summary_only"
        row["contentFetchPolicy"] = SERP_CONTENT_FETCH_POLICY
    return row


def fetched_serp_result_rows(results: list[Any], snapshot_id: str | None = None) -> list[dict[str, Any]]:
    return [fetched_serp_result_record(result, snapshot_id) for result in results if isinstance(result, dict)]
