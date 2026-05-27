from __future__ import annotations

from datetime import datetime, timezone

from workers.python.common import DATA

TREND_CLUSTERS_PATH = DATA / "exports" / "trend_clusters.json"
TREND_KEYWORDS_PATH = DATA / "exports" / "trend_keywords.json"
SERP_OPPORTUNITY_PATH = DATA / "exports" / "serp_opportunity_report.json"
SERP_ANALYSIS_PATH = DATA / "exports" / "competitor_content_analysis.json"
CONTENT_STRATEGIES_PATH = DATA / "exports" / "content_strategies.json"
CONTENT_BRIEFS_PATH = DATA / "exports" / "content_briefs.json"
TEST_ARTICLES_PATH = DATA / "exports" / "test_articles.json"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
