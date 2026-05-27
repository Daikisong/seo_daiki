from __future__ import annotations

from typing import Any

from workers.python.common import read_json, slugify, write_json
from workers.python.writers.content_strategy_rules import article_sections, markdown_article
from workers.python.writers.market_content_artifacts import CONTENT_STRATEGIES_PATH, TEST_ARTICLES_PATH, now


def generate_test_post(strategy_id: str | None = None) -> str:
    strategies = read_json(CONTENT_STRATEGIES_PATH, {"strategies": []}).get("strategies", [])
    return str(write_json(TEST_ARTICLES_PATH, {"articles": test_article_records(strategies, strategy_id)}))


def test_article_records(strategies: list[dict[str, Any]], strategy_id: str | None = None) -> list[dict[str, Any]]:
    articles = []
    for strategy in strategies:
        if not isinstance(strategy, dict) or (strategy_id and strategy.get("id") != strategy_id):
            continue
        slug = str(strategy.get("slug") or slugify(str(strategy.get("titleStrategy"))))
        article_id = f"test-article-{slugify(str(strategy.get('id')))}"
        sections = article_sections(strategy)
        title = str(strategy.get("titleStrategy") or "Market test post")
        articles.append(
            {
                "id": article_id,
                "strategyId": strategy.get("id"),
                "articleId": article_id,
                "market": strategy.get("market"),
                "language": strategy.get("language"),
                "slug": slug,
                "title": title,
                "h1": title,
                "metaDescription": f"Market-specific test post for {title}. No affiliate links are inserted.",
                "summary": str(strategy.get("recommendedAngle") or ""),
                "contentMdx": markdown_article(title, sections),
                "sections": sections,
                "affiliateLinks": [],
                "monetizationDeferred": True,
                "productCandidateState": "pending",
                "noindexReason": "Initial test article; index candidate requires human/editorial approval.",
                "status": "test_pending",
                "indexStatus": "noindex",
                "publishStatus": "pending",
                "createdAt": now(),
                "updatedAt": now(),
            }
        )
    return articles


def publish_test_article(article_id: str | None = None, mode: str = "noindex") -> str:
    payload = read_json(TEST_ARTICLES_PATH, {"articles": []})
    articles = publish_test_article_records(payload.get("articles", []), article_id, mode)
    return str(write_json(TEST_ARTICLES_PATH, {"articles": articles}))


def publish_test_article_records(
    articles: list[dict[str, Any]], article_id: str | None = None, mode: str = "noindex"
) -> list[dict[str, Any]]:
    rows = []
    for article in articles:
        if not isinstance(article, dict):
            continue
        row = dict(article)
        if not article_id or row.get("id") == article_id or row.get("articleId") == article_id:
            row["publishStatus"] = "published"
            row["indexStatus"] = "noindex" if mode == "noindex" else "pending"
            row["status"] = "test_published_noindex" if mode == "noindex" else "test_published_index_candidate"
            row["updatedAt"] = now()
        rows.append(row)
    return rows


def promote_index_candidate(article_id: str | None = None) -> str:
    payload = read_json(TEST_ARTICLES_PATH, {"articles": []})
    articles = promote_index_candidate_records(payload.get("articles", []), article_id)
    return str(write_json(TEST_ARTICLES_PATH, {"articles": articles}))


def promote_index_candidate_records(articles: list[dict[str, Any]], article_id: str | None = None) -> list[dict[str, Any]]:
    rows = []
    for article in articles:
        if not isinstance(article, dict):
            continue
        row = dict(article)
        if not article_id or row.get("id") == article_id or row.get("articleId") == article_id:
            row["indexStatus"] = "pending"
            row["status"] = "test_published_index_candidate"
            row["updatedAt"] = now()
        rows.append(row)
    return rows
