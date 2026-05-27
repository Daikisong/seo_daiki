from __future__ import annotations

from datetime import datetime, timezone

from workers.python.common import DATA

TEST_ARTICLES_PATH = DATA / "exports" / "test_articles.json"
PRODUCT_CANDIDATES_PATH = DATA / "exports" / "product_candidates.json"
PRODUCT_ANALYSIS_PATH = DATA / "exports" / "product_candidate_analysis.json"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
