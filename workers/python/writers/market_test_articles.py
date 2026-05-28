from __future__ import annotations

from typing import Any

from workers.python.common import read_json, write_json
from workers.python.writers.market_content_artifacts import CONTENT_STRATEGIES_PATH, TEST_ARTICLES_PATH, now
from workers.python.writers.market_test_article_records import (
    strategy_matches_filter,
    test_article_record,
    test_article_records_for_strategies,
)
from workers.python.writers.market_test_article_state import (
    article_matches_id,
    promote_index_candidate_record,
    promote_index_candidate_rows,
    publish_test_article_record,
    publish_test_article_rows,
    published_state_for_mode,
)


def generate_test_post(strategy_id: str | None = None) -> str:
    strategies = read_json(CONTENT_STRATEGIES_PATH, {"strategies": []}).get("strategies", [])
    return str(write_json(TEST_ARTICLES_PATH, {"articles": test_article_records(strategies, strategy_id)}))


def test_article_records(strategies: list[dict[str, Any]], strategy_id: str | None = None) -> list[dict[str, Any]]:
    return test_article_records_for_strategies(strategies, strategy_id, now)


def publish_test_article(article_id: str | None = None, mode: str = "noindex") -> str:
    payload = read_json(TEST_ARTICLES_PATH, {"articles": []})
    articles = publish_test_article_records(payload.get("articles", []), article_id, mode)
    return str(write_json(TEST_ARTICLES_PATH, {"articles": articles}))


def publish_test_article_records(
    articles: list[dict[str, Any]], article_id: str | None = None, mode: str = "noindex"
) -> list[dict[str, Any]]:
    return publish_test_article_rows(articles, article_id, mode, now)


def promote_index_candidate(article_id: str | None = None) -> str:
    payload = read_json(TEST_ARTICLES_PATH, {"articles": []})
    articles = promote_index_candidate_records(payload.get("articles", []), article_id)
    return str(write_json(TEST_ARTICLES_PATH, {"articles": articles}))


def promote_index_candidate_records(articles: list[dict[str, Any]], article_id: str | None = None) -> list[dict[str, Any]]:
    return promote_index_candidate_rows(articles, article_id, now)
