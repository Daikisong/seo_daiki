from __future__ import annotations

from workers.python.common import read_json, write_json
from workers.python.intelligence.product_candidate_paths import (
    PRODUCT_CANDIDATES_PATH,
    TEST_ARTICLES_PATH,
)
from workers.python.intelligence.product_candidate_rules import tokens


def discover_product_candidates(article_id: str | None = None) -> str:
    articles = read_json(TEST_ARTICLES_PATH, {"articles": []}).get("articles", [])
    candidates = read_json(PRODUCT_CANDIDATES_PATH, {"candidates": []}).get("candidates", [])
    discovered = []
    for article in articles:
        if not isinstance(article, dict) or not article_matches_id(article, article_id):
            continue
        article_text = article_search_text(article)
        for candidate in candidates:
            if isinstance(candidate, dict) and candidate_matches_article(candidate, article, article_text):
                discovered.append({**candidate, "articleId": article.get("id"), "status": "discovered"})
    return str(write_json(PRODUCT_CANDIDATES_PATH, {"candidates": discovered or candidates}))


def article_matches_id(article: dict[str, object], article_id: str | None) -> bool:
    return not article_id or article.get("id") == article_id or article.get("articleId") == article_id


def article_search_text(article: dict[str, object]) -> str:
    sections = article.get("sections", [])
    section_text = " ".join(
        str(section.get("body") or "") for section in sections if isinstance(section, dict)
    )
    return " ".join(
        [
            str(article.get("title") or ""),
            str(article.get("summary") or ""),
            section_text,
        ]
    ).lower()


def candidate_matches_article(
    candidate: dict[str, object],
    article: dict[str, object],
    article_text: str,
) -> bool:
    market_match = candidate.get("market") == article.get("market")
    article_match = candidate.get("articleId") == article.get("id")
    topic_match = any(token and token in article_text for token in tokens(str(candidate.get("title") or "")))
    return bool(market_match and (article_match or (not candidate.get("articleId") and topic_match)))
