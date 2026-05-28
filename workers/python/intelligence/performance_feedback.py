from __future__ import annotations

from datetime import datetime, timezone

from workers.python.common import read_json, write_json
from workers.python.intelligence.performance_feedback_paths import (
    NEXT_ACTIONS_PATH,
    PERFORMANCE_PATH,
    TEST_ARTICLES_PATH,
    performance_report_path,
)
from workers.python.intelligence.performance_feedback_records import (
    performance_action_records,
    performance_report_payload,
    performance_snapshot_records,
)


def import_search_console_performance() -> str:
    articles = read_json(TEST_ARTICLES_PATH, {"articles": []}).get("articles", [])
    rows = performance_snapshot_records(articles, today(), now())
    return str(write_json(PERFORMANCE_PATH, {"snapshots": rows}))


def snapshot_performance() -> str:
    return import_search_console_performance()


def recommend_performance_actions() -> str:
    snapshots = read_json(PERFORMANCE_PATH, {"snapshots": []}).get("snapshots", [])
    actions = performance_action_records(snapshots, now())
    return str(write_json(NEXT_ACTIONS_PATH, {"actions": actions}))


def performance_report(market: str | None = None) -> str:
    snapshots = read_json(PERFORMANCE_PATH, {"snapshots": []}).get("snapshots", [])
    actions = read_json(NEXT_ACTIONS_PATH, {"actions": []}).get("actions", [])
    return str(write_json(performance_report_path(market), performance_report_payload(snapshots, actions, market)))


def today() -> str:
    return datetime.now(timezone.utc).date().isoformat()


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
