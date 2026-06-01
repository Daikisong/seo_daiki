from __future__ import annotations

from typing import Any
from workers.python.common import slugify

def find_matching_opportunity(article: dict[str, Any], opportunities: list[dict[str, Any]]) -> dict[str, Any] | None:
    article_id = str(article.get("id") or article.get("articleId") or "")
    slug = str(article.get("slug") or "")
    same_market = [
        item
        for item in opportunities
        if item.get("market") == article.get("market") and item.get("language") == article.get("language")
    ]
    for opportunity in same_market:
        keyword_id = str(opportunity.get("keywordId") or "")
        keyword_slug = slugify(str(opportunity.get("keyword") or ""))
        if keyword_id and keyword_id in article_id:
            return opportunity
        if slug and keyword_slug == slug:
            return opportunity
    return None


def find_matching_strategy(article: dict[str, Any], strategies: list[dict[str, Any]]) -> dict[str, Any] | None:
    strategy_id = str(article.get("strategyId") or "")
    if strategy_id:
        for strategy in strategies:
            if strategy.get("id") == strategy_id:
                return strategy
    slug = str(article.get("slug") or "")
    for strategy in strategies:
        if strategy.get("market") == article.get("market") and strategy.get("language") == article.get("language"):
            if slug and strategy.get("slug") == slug:
                return strategy
    return None


def find_matching_article(opportunity: dict[str, Any], articles: list[dict[str, Any]]) -> dict[str, Any] | None:
    keyword_id = str(opportunity.get("keywordId") or "")
    keyword_slug = slugify(str(opportunity.get("keyword") or ""))
    same_market = [
        item
        for item in articles
        if item.get("market") == opportunity.get("market") and item.get("language") == opportunity.get("language")
    ]
    for article in same_market:
        article_id = str(article.get("id") or article.get("articleId") or "")
        if keyword_id and keyword_id in article_id:
            return article
        if keyword_slug and article.get("slug") == keyword_slug:
            return article
    return same_market[0] if len(same_market) == 1 else None


def find_matching_strategy_for_opportunity(
    opportunity: dict[str, Any],
    strategies: list[dict[str, Any]],
) -> dict[str, Any] | None:
    keyword_id = str(opportunity.get("keywordId") or "")
    keyword_slug = slugify(str(opportunity.get("keyword") or ""))
    for strategy in strategies:
        if keyword_id and strategy.get("keywordId") == keyword_id:
            return strategy
        if keyword_slug and strategy.get("slug") == keyword_slug:
            if strategy.get("market") == opportunity.get("market") and strategy.get("language") == opportunity.get("language"):
                return strategy
    return None
