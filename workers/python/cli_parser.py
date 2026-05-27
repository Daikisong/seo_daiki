from __future__ import annotations

import argparse

from workers.python.common import DATA


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Global trend-to-content worker CLI")
    subcommands = parser.add_subparsers(dest="command", required=True)

    add_noarg(subcommands, "trend:init-markets")
    trend_import = subcommands.add_parser("trend:import-signals")
    trend_import.add_argument("--file", default=str(DATA / "seeds" / "trend-signals.csv"))
    trend_collect = subcommands.add_parser("trend:collect")
    trend_collect.add_argument("--market")
    trend_collect.add_argument("--source", default="manual_csv")
    add_noarg(subcommands, "trend:normalize")
    add_noarg(subcommands, "trend:cluster")
    add_noarg(subcommands, "trend:score")
    trend_report_parser = subcommands.add_parser("trend:report")
    trend_report_parser.add_argument("--market")
    trend_keywords = subcommands.add_parser("trend:generate-keywords")
    trend_keywords.add_argument("--cluster-id")

    serp_import = subcommands.add_parser("serp:import-results")
    serp_import.add_argument("--file", default=str(DATA / "seeds" / "serp-results.csv"))
    serp_collect = subcommands.add_parser("serp:collect")
    serp_collect.add_argument("--keyword-id")
    serp_collect.add_argument("--provider", default="manual_csv")
    serp_fetch = subcommands.add_parser("serp:fetch-pages")
    serp_fetch.add_argument("--snapshot-id")
    serp_analyze = subcommands.add_parser("serp:analyze-pages")
    serp_analyze.add_argument("--snapshot-id")
    serp_summary = subcommands.add_parser("serp:summarize-opportunity")
    serp_summary.add_argument("--keyword-id")
    serp_report_parser = subcommands.add_parser("serp:report")
    serp_report_parser.add_argument("--market")

    strategy_create = subcommands.add_parser("strategy:create")
    strategy_create.add_argument("--keyword-id")
    strategy_brief = subcommands.add_parser("strategy:generate-brief")
    strategy_brief.add_argument("--strategy-id")
    post_generate = subcommands.add_parser("post:generate-test")
    post_generate.add_argument("--strategy-id")
    post_publish = subcommands.add_parser("post:publish-test")
    post_publish.add_argument("--article-id")
    post_publish.add_argument("--mode", default="noindex")
    post_promote = subcommands.add_parser("post:promote-index-candidate")
    post_promote.add_argument("--article-id")

    calendar_build = subcommands.add_parser("calendar:build")
    calendar_build.add_argument("--market")
    add_noarg(subcommands, "calendar:build-all")
    calendar_explain = subcommands.add_parser("calendar:explain")
    calendar_explain.add_argument("--market")
    add_noarg(subcommands, "calendar:export")

    add_noarg(subcommands, "performance:import-search-console")
    add_noarg(subcommands, "performance:snapshot")
    add_noarg(subcommands, "performance:recommend-actions")
    performance_report_parser = subcommands.add_parser("performance:report")
    performance_report_parser.add_argument("--market")

    product_import = subcommands.add_parser("products:import-candidates")
    product_import.add_argument("--file", default=str(DATA / "seeds" / "product-candidates.csv"))
    product_discover = subcommands.add_parser("products:discover-candidates")
    product_discover.add_argument("--article-id")
    product_analyze = subcommands.add_parser("products:analyze-candidates")
    product_analyze.add_argument("--article-id")
    product_block = subcommands.add_parser("products:build-analysis-block")
    product_block.add_argument("--article-id")

    monetization_review = subcommands.add_parser("monetization:create-review")
    monetization_review.add_argument("--article-id")
    monetization_draft = subcommands.add_parser("monetization:draft-placements")
    monetization_draft.add_argument("--review-id")
    monetization_apply = subcommands.add_parser("monetization:apply-approved")
    monetization_apply.add_argument("--review-id")

    trend_pipeline = subcommands.add_parser("pipeline:trend-to-post")
    trend_pipeline.add_argument("--trend-signal-file", default=str(DATA / "seeds" / "trend-signals.csv"))
    trend_pipeline.add_argument("--serp-results-file", default=str(DATA / "seeds" / "serp-results.csv"))
    trend_pipeline.add_argument("--continue-on-error", action="store_true")
    product_pipeline = subcommands.add_parser("pipeline:post-to-product-analysis")
    product_pipeline.add_argument("--candidates-file", default=str(DATA / "seeds" / "product-candidates.csv"))
    product_pipeline.add_argument("--article-id")
    product_pipeline.add_argument("--continue-on-error", action="store_true")
    monetization_pipeline = subcommands.add_parser("pipeline:monetization-review")
    monetization_pipeline.add_argument("--article-id")
    monetization_pipeline.add_argument("--continue-on-error", action="store_true")

    legacy_trend_import = subcommands.add_parser("import-trend-signals")
    legacy_trend_import.add_argument("--file", default=str(DATA / "seeds" / "trend-signals.csv"))
    add_noarg(subcommands, "cluster-topics")
    add_noarg(subcommands, "score-topics")
    add_noarg(subcommands, "generate-content-briefs")
    legacy_pipeline = subcommands.add_parser("run-pipeline")
    legacy_pipeline.add_argument("--trend-signal-file", default=str(DATA / "seeds" / "trend-signals.csv"))
    legacy_pipeline.add_argument("--continue-on-error", action="store_true")

    offer_match = subcommands.add_parser("match-affiliate-offers")
    offer_match.add_argument("--topic-id")
    offer_match.add_argument("--article-id")
    offer_match.add_argument("--offers-file", default=str(DATA / "seeds" / "offers.csv"))
    distribution = subcommands.add_parser("generate-distribution-assets")
    distribution.add_argument("--article-id")
    add_noarg(subcommands, "draft-outreach")

    return parser


def add_noarg(subcommands: argparse._SubParsersAction[argparse.ArgumentParser], name: str) -> None:
    subcommands.add_parser(name)
