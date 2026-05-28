from __future__ import annotations

from typing import Any


def performance_snapshot_record(article: dict[str, Any], date_value: str, captured_at: str) -> dict[str, Any]:
    return {
        "id": f"perf-{article.get('id')}",
        "articleId": article.get("id"),
        "market": article.get("market"),
        "language": article.get("language"),
        "dateStart": date_value,
        "dateEnd": date_value,
        "impressions": 0,
        "clicks": 0,
        "ctr": 0,
        "avgPosition": 0,
        "queriesJson": [],
        "countriesJson": [str(article.get("market")).upper()],
        "devicesJson": [],
        "capturedAt": captured_at,
        "source": "sample_or_search_console_import",
    }


def performance_snapshot_records(articles: list[Any], date_value: str, captured_at: str) -> list[dict[str, Any]]:
    return [performance_snapshot_record(article, date_value, captured_at) for article in articles if isinstance(article, dict)]


def performance_action_decision(snapshot: dict[str, Any]) -> tuple[str, str]:
    impressions = int(snapshot.get("impressions") or 0)
    clicks = int(snapshot.get("clicks") or 0)
    if impressions < 50:
        return ("hold", "Not enough search data yet; keep in noindex/test monitoring or wait for editorial review.")
    if clicks == 0:
        return ("rewrite_title_meta", "Impressions exist but clicks are weak.")
    return (
        "request_product_candidate_analysis",
        "Article has enough early signal to justify product candidate analysis.",
    )


def performance_action_record(snapshot: dict[str, Any], created_at: str) -> dict[str, Any]:
    action_type, reason = performance_action_decision(snapshot)
    return {
        "id": f"next-action-{snapshot.get('articleId')}",
        "articleId": snapshot.get("articleId"),
        "actionType": action_type,
        "reason": reason,
        "priority": "medium",
        "payloadJson": {"minimumPerformanceGate": "editorial_or_search_signal_required"},
        "status": "open",
        "createdAt": created_at,
    }


def performance_action_records(snapshots: list[Any], created_at: str) -> list[dict[str, Any]]:
    return [performance_action_record(snapshot, created_at) for snapshot in snapshots if isinstance(snapshot, dict)]


def performance_report_payload(snapshots: list[Any], actions: list[Any], market: str | None = None) -> dict[str, Any]:
    return {
        "market": market,
        "snapshots": [row for row in snapshots if isinstance(row, dict) and (not market or row.get("market") == market)],
        "actions": actions,
    }
