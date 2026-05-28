from __future__ import annotations

from collections.abc import Callable
from typing import Any


def article_matches_id(article: dict[str, Any], article_id: str | None = None) -> bool:
    return not article_id or article.get("id") == article_id or article.get("articleId") == article_id


def published_state_for_mode(mode: str) -> tuple[str, str]:
    if mode == "noindex":
        return ("noindex", "test_published_noindex")
    return ("pending", "test_published_index_candidate")


def publish_test_article_record(
    article: dict[str, Any],
    article_id: str | None,
    mode: str,
    now_factory: Callable[[], str],
) -> dict[str, Any]:
    row = dict(article)
    if article_matches_id(row, article_id):
        index_status, status = published_state_for_mode(mode)
        row["publishStatus"] = "published"
        row["indexStatus"] = index_status
        row["status"] = status
        row["updatedAt"] = now_factory()
    return row


def publish_test_article_rows(
    articles: list[Any],
    article_id: str | None,
    mode: str,
    now_factory: Callable[[], str],
) -> list[dict[str, Any]]:
    return [
        publish_test_article_record(article, article_id, mode, now_factory)
        for article in articles
        if isinstance(article, dict)
    ]


def promote_index_candidate_record(
    article: dict[str, Any],
    article_id: str | None,
    now_factory: Callable[[], str],
) -> dict[str, Any]:
    row = dict(article)
    if article_matches_id(row, article_id):
        row["indexStatus"] = "pending"
        row["status"] = "test_published_index_candidate"
        row["updatedAt"] = now_factory()
    return row


def promote_index_candidate_rows(
    articles: list[Any],
    article_id: str | None,
    now_factory: Callable[[], str],
) -> list[dict[str, Any]]:
    return [
        promote_index_candidate_record(article, article_id, now_factory)
        for article in articles
        if isinstance(article, dict)
    ]
