from __future__ import annotations

from workers.python.writers.market_content_artifacts import (
    CONTENT_BRIEFS_PATH,
    CONTENT_STRATEGIES_PATH,
    SERP_ANALYSIS_PATH,
    SERP_OPPORTUNITY_PATH,
    TEST_ARTICLES_PATH,
    TREND_CLUSTERS_PATH,
    TREND_KEYWORDS_PATH,
    now,
)
from workers.python.writers.market_content_briefs import content_brief_records, generate_content_brief
from workers.python.writers.market_content_strategy_records import content_strategy_records, create_content_strategy
from workers.python.writers.market_test_articles import (
    generate_test_post,
    promote_index_candidate,
    promote_index_candidate_records,
    publish_test_article,
    publish_test_article_records,
    test_article_records,
)

__all__ = [
    "CONTENT_BRIEFS_PATH",
    "CONTENT_STRATEGIES_PATH",
    "SERP_ANALYSIS_PATH",
    "SERP_OPPORTUNITY_PATH",
    "TEST_ARTICLES_PATH",
    "TREND_CLUSTERS_PATH",
    "TREND_KEYWORDS_PATH",
    "content_brief_records",
    "content_strategy_records",
    "create_content_strategy",
    "generate_content_brief",
    "generate_test_post",
    "now",
    "promote_index_candidate",
    "promote_index_candidate_records",
    "publish_test_article",
    "publish_test_article_records",
    "test_article_records",
]
