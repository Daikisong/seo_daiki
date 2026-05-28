from __future__ import annotations

from workers.python.common import DATA

TEST_ARTICLES_PATH = DATA / "exports" / "test_articles.json"
PERFORMANCE_PATH = DATA / "exports" / "article_performance_snapshots.json"
NEXT_ACTIONS_PATH = DATA / "exports" / "article_next_actions.json"


def performance_report_path(market: str | None = None):
    return DATA / "exports" / (f"performance_report_{market}.json" if market else "performance_report.json")
