from __future__ import annotations

from pathlib import Path
from typing import Any

from workers.python.common import DATA, ROOT, read_json, write_json

EXPECTED_PIPELINE_STEPS = [
    "trend:init-markets",
    "trend:import-signals",
    "trend:normalize",
    "trend:cluster",
    "trend:score",
    "trend:generate-keywords",
    "trend:report",
    "serp:import-results",
    "serp:fetch-pages",
    "serp:analyze-pages",
    "serp:summarize-opportunity",
    "serp:report",
    "strategy:create",
    "strategy:generate-brief",
    "post:generate-test",
    "post:publish-test --mode noindex",
]

FORBIDDEN_STEP_PREFIXES = [
    "performance:",
    "products:",
    "monetization:",
    "match-affiliate-offers",
    "generate-distribution-assets",
    "draft-outreach",
]


def verify_api_free_six() -> str:
    checks: list[dict[str, str]] = []
    generated_routes: list[str] = []

    def check(name: str, condition: bool, detail: str) -> None:
        checks.append({"name": name, "status": "pass" if condition else "fail", "detail": detail})

    trend_sources = load("market_trend_sources.json", {"sources": []})
    trend_signals = load("market_trend_signals.json", {"signals": []})
    trend_clusters = load("trend_clusters.json", {"clusters": []})
    trend_keywords = load("trend_keywords.json", {"keywords": []})
    trend_report = load("trend_report.json", {"clusters": []})
    serp_results = load("serp_results.json", {"snapshots": [], "results": []})
    competitor_analysis = load("competitor_content_analysis.json", {"analyses": []})
    serp_opportunity = load("serp_opportunity_report.json", {"opportunities": []})
    content_strategies = load("content_strategies.json", {"strategies": []})
    content_briefs = load("content_briefs.json", {"briefs": []})
    test_articles = load("test_articles.json", {"articles": []})
    pipeline_report = load("pipeline_api_free_six_run.json", {"steps": [], "status": "missing"})

    clusters = list_rows(trend_clusters.get("clusters"))
    keywords = list_rows(trend_keywords.get("keywords"))
    opportunities = list_rows(serp_opportunity.get("opportunities"))
    strategies = list_rows(content_strategies.get("strategies"))
    briefs = list_rows(content_briefs.get("briefs"))
    articles = list_rows(test_articles.get("articles"))
    analyses = list_rows(competitor_analysis.get("analyses"))
    results = list_rows(serp_results.get("results"))

    check("trend sources exist", len(list_rows(trend_sources.get("sources"))) > 0, "market_trend_sources.json has sources")
    check("trend signals exist", len(list_rows(trend_signals.get("signals"))) > 0, "market_trend_signals.json has signals")
    check("trend clusters minimum", len(clusters) >= 5, f"{len(clusters)} trend clusters found")
    check("trend keywords minimum", len(keywords) >= 5, f"{len(keywords)} trend keywords found")
    check("trend report exists", len(list_rows(trend_report.get("clusters"))) >= 5, "trend_report.json has cluster report")
    trend_markets = {str(row.get("market")) for row in clusters if row.get("market")}
    check("trend markets minimum", len(trend_markets) >= 3, f"{len(trend_markets)} trend markets found")

    check("serp results minimum", len(results) >= 5, f"{len(results)} SERP results found")
    check("competitor analyses minimum", len(analyses) >= 5, f"{len(analyses)} competitor analyses found")
    check("serp opportunities minimum", len(opportunities) >= 3, f"{len(opportunities)} SERP opportunities found")
    required_opportunity_fields = [
        "keywordId",
        "market",
        "language",
        "keyword",
        "dominantIntent",
        "recommendedAngle",
        "recommendedArticleType",
        "shouldWrite",
    ]
    check(
        "serp opportunity fields",
        all(has_fields(row, required_opportunity_fields) for row in opportunities),
        "every SERP opportunity has required fields",
    )

    required_strategy_fields = [
        "keywordId",
        "clusterId",
        "market",
        "language",
        "selectedArticleType",
        "recommendedAngle",
        "titleStrategy",
        "sectionPlanJson",
    ]
    check("content strategies minimum", len(strategies) >= 3, f"{len(strategies)} content strategies found")
    check("content briefs minimum", len(briefs) >= 3, f"{len(briefs)} content briefs found")
    check(
        "strategy fields",
        all(has_fields(row, required_strategy_fields) and row.get("monetizationDeferred") is True for row in strategies),
        "every strategy has required fields and monetizationDeferred=true",
    )
    check(
        "dry-run strategy provider",
        all(row.get("strategyProvider") == "dry-run" for row in strategies),
        "every strategy was produced by dry-run strategy provider",
    )

    required_article_fields = [
        "market",
        "language",
        "slug",
        "title",
        "h1",
        "metaDescription",
        "affiliateLinks",
        "productCandidateState",
        "indexStatus",
        "publishStatus",
    ]
    for article in articles:
        generated_routes.append(f"/{article.get('market')}/{article.get('language')}/posts/{article.get('slug')}/")
    check("test articles minimum", len(articles) >= 3, f"{len(articles)} test articles found")
    check(
        "test article fields",
        all(has_fields(row, required_article_fields) and (row.get("contentMdx") or row.get("sections")) for row in articles),
        "every test article has required route/render fields",
    )
    check(
        "test article safety",
        all(
            row.get("affiliateLinks") == []
            and row.get("monetizationDeferred") is True
            and row.get("productCandidateState") == "pending"
            and row.get("indexStatus") == "noindex"
            and row.get("publishStatus") in {"pending", "published"}
            for row in articles
        ),
        "test articles are noindex, non-monetized, and affiliateLinks=[]",
    )

    route_source = read_text(ROOT / "apps/web/app/[locale]/[language]/posts/[slug]/page.tsx")
    data_reader_source = read_text(ROOT / "apps/web/lib/market/market-publishing-data-readers.ts")
    pipeline_steps = [str(row.get("name")) for row in list_rows(pipeline_report.get("steps"))]
    check("pipeline report passed", pipeline_report.get("status") == "pass", "pipeline_api_free_six_run.json status is pass")
    check("pipeline exact step order", pipeline_steps == EXPECTED_PIPELINE_STEPS, "pipeline step order matches docs/goal.md")
    check(
        "pipeline excludes forbidden phases",
        not any(any(step.startswith(prefix) for prefix in FORBIDDEN_STEP_PREFIXES) for step in pipeline_steps),
        "pipeline does not run performance, products, monetization, distribution, outreach, or offers",
    )
    check("post route reads generated articles", "readMarketPosts" in route_source, "post route uses readMarketPosts")
    check("post route static params", "generateStaticParams" in route_source, "post route exposes generateStaticParams")
    check("post metadata noindex", "marketResearchMetadata" in route_source, "post route uses noindex research metadata")
    check("post route notFound", "notFound()" in route_source, "missing posts return notFound")
    check("post reader uses test_articles", "exports/test_articles.json" in data_reader_source, "web reader loads generated test_articles.json")
    check(
        "generated route format",
        all(route.startswith("/") and route.endswith("/") and "/posts/" in route for route in generated_routes),
        "all generated routes use /[market]/[language]/posts/[slug]/",
    )

    report = {"passed": all(row["status"] == "pass" for row in checks), "checks": checks, "generatedRoutes": generated_routes}
    output_path = DATA / "exports" / "api_free_six_verification.json"
    write_json(output_path, report)

    if not report["passed"]:
        failed = [f"{row['name']}: {row['detail']}" for row in checks if row["status"] == "fail"]
        raise RuntimeError("API-free six verification failed:\n- " + "\n- ".join(failed))

    return str(output_path)


def load(file_name: str, fallback: dict[str, Any]) -> dict[str, Any]:
    return read_json(DATA / "exports" / file_name, fallback)


def list_rows(value: Any) -> list[dict[str, Any]]:
    return [row for row in value if isinstance(row, dict)] if isinstance(value, list) else []


def has_fields(row: dict[str, Any], fields: list[str]) -> bool:
    return all(field in row and row.get(field) not in (None, "") for field in fields)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""
