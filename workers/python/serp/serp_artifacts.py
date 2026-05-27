from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from workers.python.common import DATA

TREND_KEYWORDS_PATH = DATA / "exports" / "trend_keywords.json"
SERP_RESULTS_PATH = DATA / "exports" / "serp_results.json"
SERP_ANALYSIS_PATH = DATA / "exports" / "competitor_content_analysis.json"
SERP_OPPORTUNITY_PATH = DATA / "exports" / "serp_opportunity_report.json"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def find_snapshot(snapshot_id: Any, payload: dict[str, Any]) -> dict[str, Any]:
    for snapshot in payload.get("snapshots", []):
        if isinstance(snapshot, dict) and snapshot.get("id") == snapshot_id:
            return snapshot
    return {}


def market_for_snapshot(snapshot_id: Any, payload: dict[str, Any]) -> str:
    snapshot = find_snapshot(snapshot_id, payload)
    return str(snapshot.get("market") or "")


def language_for_snapshot(snapshot_id: Any, payload: dict[str, Any]) -> str:
    snapshot = find_snapshot(snapshot_id, payload)
    return str(snapshot.get("language") or "")


def keyword_for_snapshot(snapshot_id: Any, payload: dict[str, Any]) -> str:
    snapshot = find_snapshot(snapshot_id, payload)
    return str(snapshot.get("keyword") or "")
