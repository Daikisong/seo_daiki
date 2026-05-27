from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from workers.python.common import DATA, read_json, slugify, write_json
from workers.python.writers.content_strategy_rules import (
    article_sections,
    brief_markdown,
    evidence_needed,
    markdown_article,
    section_plan,
    title_for,
)

TREND_CLUSTERS_PATH = DATA / "exports" / "trend_clusters.json"
TREND_KEYWORDS_PATH = DATA / "exports" / "trend_keywords.json"
SERP_OPPORTUNITY_PATH = DATA / "exports" / "serp_opportunity_report.json"
SERP_ANALYSIS_PATH = DATA / "exports" / "competitor_content_analysis.json"
CONTENT_STRATEGIES_PATH = DATA / "exports" / "content_strategies.json"
CONTENT_BRIEFS_PATH = DATA / "exports" / "content_briefs.json"
TEST_ARTICLES_PATH = DATA / "exports" / "test_articles.json"


def create_content_strategy(keyword_id: str | None = None) -> str:
    keywords = read_json(TREND_KEYWORDS_PATH, {"keywords": []}).get("keywords", [])
    clusters = read_json(TREND_CLUSTERS_PATH, {"clusters": []}).get("clusters", [])
    opportunities = read_json(SERP_OPPORTUNITY_PATH, {"opportunities": []}).get("opportunities", [])
    analyses = read_json(SERP_ANALYSIS_PATH, {"analyses": []}).get("analyses", [])

    cluster_by_id = {str(item.get("id")): item for item in clusters if isinstance(item, dict)}
    opportunity_by_keyword_id = {str(item.get("keywordId")): item for item in opportunities if isinstance(item, dict)}
    analyses_by_keyword: dict[str, list[dict[str, Any]]] = {}
    for analysis in analyses:
        if isinstance(analysis, dict):
            analyses_by_keyword.setdefault(str(analysis.get("keyword")), []).append(analysis)

    strategies = []
    for keyword in keywords:
        if not isinstance(keyword, dict) or (keyword_id and keyword.get("id") != keyword_id):
            continue
        opportunity = opportunity_by_keyword_id.get(str(keyword.get("id")), {})
        if opportunity and opportunity.get("shouldWrite") is False:
            status = "rejected"
        else:
            status = "brief_pending"
        cluster = cluster_by_id.get(str(keyword.get("clusterId")), {})
        keyword_text = str(keyword.get("keyword") or "")
        rows = analyses_by_keyword.get(keyword_text, [])
        sections = section_plan(keyword_text, opportunity, rows)
        strategy_id = f"content-strategy-{slugify(str(keyword.get('id') or keyword_text))}"
        strategies.append(
            {
                "id": strategy_id,
                "keywordId": keyword.get("id"),
                "clusterId": keyword.get("clusterId"),
                "market": keyword.get("market"),
                "language": keyword.get("language"),
                "slug": slugify(keyword_text),
                "selectedArticleType": opportunity.get("recommendedArticleType") or "informational_test_post",
                "recommendedAngle": opportunity.get("recommendedAngle")
                or f"Create a market-specific no-link test post for {keyword_text}.",
                "titleStrategy": title_for(keyword_text, keyword.get("market"), opportunity),
                "introStrategy": (
                    "Open with the user's immediate question, explain what can be verified now, "
                    "and state that product links are deferred until review."
                ),
                "sectionPlanJson": sections,
                "differentiationPlanJson": [
                    "Use market-specific context instead of a generic global article.",
                    "Explain competitor gaps without copying headings or wording.",
                    "Include a verification checklist before any future monetization.",
                ],
                "evidenceNeededJson": evidence_needed(keyword_text, rows),
                "competitorPatternsJson": opportunity.get("topPatternsJson") or [],
                "contentGapJson": opportunity.get("contentGapJson") or {},
                "monetizationDeferred": True,
                "status": status,
                "createdAt": now(),
                "updatedAt": now(),
            }
        )
    return str(write_json(CONTENT_STRATEGIES_PATH, {"strategies": strategies}))


def generate_content_brief(strategy_id: str | None = None) -> str:
    strategies = read_json(CONTENT_STRATEGIES_PATH, {"strategies": []}).get("strategies", [])
    briefs = []
    for strategy in strategies:
        if not isinstance(strategy, dict) or (strategy_id and strategy.get("id") != strategy_id):
            continue
        brief_id = f"brief-{slugify(str(strategy.get('id')))}"
        briefs.append(
            {
                "id": brief_id,
                "strategyId": strategy.get("id"),
                "keywordId": strategy.get("keywordId"),
                "clusterId": strategy.get("clusterId"),
                "market": strategy.get("market"),
                "language": strategy.get("language"),
                "slug": strategy.get("slug"),
                "title": strategy.get("titleStrategy"),
                "angle": strategy.get("recommendedAngle"),
                "monetizationDeferred": True,
                "outlineJson": strategy.get("sectionPlanJson") or [],
                "requiredEvidenceJson": strategy.get("evidenceNeededJson") or [],
                "forbiddenClaimsJson": [
                    "Do not claim first-hand testing without evidence.",
                    "Do not invent prices, discounts, medical outcomes, or availability.",
                    "Do not insert affiliate links in the test article.",
                ],
                "briefMarkdown": brief_markdown(strategy),
                "status": "draft",
                "createdAt": now(),
            }
        )
    return str(write_json(CONTENT_BRIEFS_PATH, {"briefs": briefs}))


def generate_test_post(strategy_id: str | None = None) -> str:
    strategies = read_json(CONTENT_STRATEGIES_PATH, {"strategies": []}).get("strategies", [])
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
    return str(write_json(TEST_ARTICLES_PATH, {"articles": articles}))


def publish_test_article(article_id: str | None = None, mode: str = "noindex") -> str:
    payload = read_json(TEST_ARTICLES_PATH, {"articles": []})
    articles = []
    for article in payload.get("articles", []):
        if not isinstance(article, dict):
            continue
        row = dict(article)
        if not article_id or row.get("id") == article_id or row.get("articleId") == article_id:
            row["publishStatus"] = "published"
            row["indexStatus"] = "noindex" if mode == "noindex" else "pending"
            row["status"] = "test_published_noindex" if mode == "noindex" else "test_published_index_candidate"
            row["updatedAt"] = now()
        articles.append(row)
    return str(write_json(TEST_ARTICLES_PATH, {"articles": articles}))


def promote_index_candidate(article_id: str | None = None) -> str:
    payload = read_json(TEST_ARTICLES_PATH, {"articles": []})
    articles = []
    for article in payload.get("articles", []):
        if not isinstance(article, dict):
            continue
        row = dict(article)
        if not article_id or row.get("id") == article_id or row.get("articleId") == article_id:
            row["indexStatus"] = "pending"
            row["status"] = "test_published_index_candidate"
            row["updatedAt"] = now()
        articles.append(row)
    return str(write_json(TEST_ARTICLES_PATH, {"articles": articles}))


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
