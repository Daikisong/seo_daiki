from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from workers.python.common import DATA, read_json, write_json

TEST_ARTICLES_PATH = DATA / "exports" / "test_articles.json"
PERFORMANCE_PATH = DATA / "exports" / "article_performance_snapshots.json"
NEXT_ACTIONS_PATH = DATA / "exports" / "article_next_actions.json"


def import_search_console_performance() -> str:
    articles = read_json(TEST_ARTICLES_PATH, {"articles": []}).get("articles", [])
    rows = []
    for article in articles:
        if not isinstance(article, dict):
            continue
        rows.append(
            {
                "id": f"perf-{article.get('id')}",
                "articleId": article.get("id"),
                "market": article.get("market"),
                "language": article.get("language"),
                "dateStart": datetime.now(timezone.utc).date().isoformat(),
                "dateEnd": datetime.now(timezone.utc).date().isoformat(),
                "impressions": 0,
                "clicks": 0,
                "ctr": 0,
                "avgPosition": 0,
                "queriesJson": [],
                "countriesJson": [str(article.get("market")).upper()],
                "devicesJson": [],
                "capturedAt": now(),
                "source": "sample_or_search_console_import",
            }
        )
    return str(write_json(PERFORMANCE_PATH, {"snapshots": rows}))


def snapshot_performance() -> str:
    return import_search_console_performance()


def recommend_performance_actions() -> str:
    snapshots = read_json(PERFORMANCE_PATH, {"snapshots": []}).get("snapshots", [])
    actions = []
    for snapshot in snapshots:
        if not isinstance(snapshot, dict):
            continue
        impressions = int(snapshot.get("impressions") or 0)
        clicks = int(snapshot.get("clicks") or 0)
        if impressions < 50:
            action_type = "hold"
            reason = "Not enough search data yet; keep in noindex/test monitoring or wait for editorial review."
        elif clicks == 0:
            action_type = "rewrite_title_meta"
            reason = "Impressions exist but clicks are weak."
        else:
            action_type = "request_product_candidate_analysis"
            reason = "Article has enough early signal to justify product candidate analysis."
        actions.append(
            {
                "id": f"next-action-{snapshot.get('articleId')}",
                "articleId": snapshot.get("articleId"),
                "actionType": action_type,
                "reason": reason,
                "priority": "medium",
                "payloadJson": {"minimumPerformanceGate": "editorial_or_search_signal_required"},
                "status": "open",
                "createdAt": now(),
            }
        )
    return str(write_json(NEXT_ACTIONS_PATH, {"actions": actions}))


def performance_report(market: str | None = None) -> str:
    snapshots = read_json(PERFORMANCE_PATH, {"snapshots": []}).get("snapshots", [])
    actions = read_json(NEXT_ACTIONS_PATH, {"actions": []}).get("actions", [])
    report = {
        "market": market,
        "snapshots": [row for row in snapshots if isinstance(row, dict) and (not market or row.get("market") == market)],
        "actions": actions,
    }
    return str(write_json(DATA / "exports" / (f"performance_report_{market}.json" if market else "performance_report.json"), report))


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
