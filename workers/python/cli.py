from __future__ import annotations

import argparse
from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from workers.python.common import DATA, ensure_dirs
from workers.python.feature_flags import ENABLE_DISTRIBUTION_DRAFTS, ENABLE_LINK_EARNING, ENABLE_OFFER_MATCHING
from workers.python.intelligence.calendar_engine import (
    build_all_market_calendars,
    build_market_calendar,
    explain_market_calendar,
    export_market_calendars,
)
from workers.python.intelligence.market_trend_engine import (
    cluster_market_trends,
    collect_market_trends,
    generate_trend_keywords,
    import_market_trend_signals,
    init_markets,
    normalize_market_trends,
    score_market_trends,
    trend_report,
)
from workers.python.intelligence.monetization_review import (
    apply_approved_monetization,
    create_monetization_review,
    draft_monetized_placements,
)
from workers.python.intelligence.performance_feedback import (
    import_search_console_performance,
    performance_report,
    recommend_performance_actions,
    snapshot_performance,
)
from workers.python.intelligence.product_candidate_engine import (
    analyze_product_candidates,
    build_product_analysis_block,
    discover_product_candidates,
    import_product_candidates,
)
from workers.python.pipeline import (
    run_monetization_review_pipeline,
    run_post_to_product_analysis_pipeline,
    run_trend_to_post_pipeline,
    run_worker_pipeline,
)
from workers.python.serp.serp_intelligence import (
    analyze_serp_pages,
    collect_serp,
    fetch_serp_pages,
    import_serp_results,
    serp_report,
    summarize_serp_opportunity,
)
from workers.python.writers.market_content_strategy import (
    create_content_strategy,
    generate_content_brief,
    generate_test_post,
    promote_index_candidate,
    publish_test_article,
)


def main() -> None:
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

    args = parser.parse_args()
    ensure_dirs()

    if args.command == "trend:init-markets":
        print(init_markets())
    elif args.command in {"trend:import-signals", "import-trend-signals"}:
        print(import_market_trend_signals(Path(args.file)))
    elif args.command == "trend:collect":
        print(collect_market_trends(args.market, args.source))
    elif args.command == "trend:normalize":
        print(normalize_market_trends())
    elif args.command in {"trend:cluster", "cluster-topics"}:
        print(cluster_market_trends())
    elif args.command in {"trend:score", "score-topics"}:
        print(score_market_trends())
    elif args.command == "trend:report":
        print(trend_report(args.market))
    elif args.command == "trend:generate-keywords":
        print(generate_trend_keywords(args.cluster_id))
    elif args.command == "serp:import-results":
        print(import_serp_results(Path(args.file)))
    elif args.command == "serp:collect":
        print(collect_serp(args.keyword_id, args.provider))
    elif args.command == "serp:fetch-pages":
        print(fetch_serp_pages(args.snapshot_id))
    elif args.command == "serp:analyze-pages":
        print(analyze_serp_pages(args.snapshot_id))
    elif args.command == "serp:summarize-opportunity":
        print(summarize_serp_opportunity(args.keyword_id))
    elif args.command == "serp:report":
        print(serp_report(args.market))
    elif args.command == "strategy:create":
        print(create_content_strategy(args.keyword_id))
    elif args.command in {"strategy:generate-brief", "generate-content-briefs"}:
        print(generate_content_brief(args.strategy_id if hasattr(args, "strategy_id") else None))
    elif args.command == "post:generate-test":
        print(generate_test_post(args.strategy_id))
    elif args.command == "post:publish-test":
        print(publish_test_article(args.article_id, args.mode))
    elif args.command == "post:promote-index-candidate":
        print(promote_index_candidate(args.article_id))
    elif args.command == "calendar:build":
        print(build_market_calendar(args.market))
    elif args.command == "calendar:build-all":
        print(build_all_market_calendars())
    elif args.command == "calendar:explain":
        print(explain_market_calendar(args.market))
    elif args.command == "calendar:export":
        print(export_market_calendars())
    elif args.command == "performance:import-search-console":
        print(import_search_console_performance())
    elif args.command == "performance:snapshot":
        print(snapshot_performance())
    elif args.command == "performance:recommend-actions":
        print(recommend_performance_actions())
    elif args.command == "performance:report":
        print(performance_report(args.market))
    elif args.command == "products:import-candidates":
        print(import_product_candidates(Path(args.file)))
    elif args.command == "products:discover-candidates":
        print(discover_product_candidates(args.article_id))
    elif args.command == "products:analyze-candidates":
        print(analyze_product_candidates(args.article_id))
    elif args.command == "products:build-analysis-block":
        print(build_product_analysis_block(args.article_id))
    elif args.command == "monetization:create-review":
        print(create_monetization_review(args.article_id))
    elif args.command == "monetization:draft-placements":
        print(draft_monetized_placements(args.review_id))
    elif args.command == "monetization:apply-approved":
        print(apply_approved_monetization(args.review_id))
    elif args.command == "pipeline:trend-to-post":
        print(
            run_trend_to_post_pipeline(
                Path(args.trend_signal_file),
                Path(args.serp_results_file),
                continue_on_error=args.continue_on_error,
            )
        )
    elif args.command == "pipeline:post-to-product-analysis":
        print(run_post_to_product_analysis_pipeline(Path(args.candidates_file), args.article_id, args.continue_on_error))
    elif args.command == "pipeline:monetization-review":
        print(run_monetization_review_pipeline(args.article_id, args.continue_on_error))
    elif args.command == "run-pipeline":
        print(
            run_worker_pipeline(
                seed_file=DATA / "seeds" / "usb-c-chargers.csv",
                locales=["en", "es", "pt-br"],
                draft_types=["review"],
                url_plan_file=DATA / "seeds" / "initial-url-plan.csv",
                trend_signal_file=Path(args.trend_signal_file),
                continue_on_error=args.continue_on_error,
            )
        )
    elif args.command == "match-affiliate-offers":
        if not ENABLE_OFFER_MATCHING:
            print("match-affiliate-offers is disabled by ENABLE_OFFER_MATCHING=false; use product candidate analysis first.")
        else:
            from workers.python.intelligence.offer_matching import match_affiliate_offers

            print(match_affiliate_offers(args.topic_id, args.article_id, Path(args.offers_file)))
    elif args.command == "generate-distribution-assets":
        if not ENABLE_DISTRIBUTION_DRAFTS:
            print("generate-distribution-assets is disabled by ENABLE_DISTRIBUTION_DRAFTS=false.")
        else:
            from workers.python.distribution.owned_channel import generate_distribution_assets

            print(generate_distribution_assets(args.article_id))
    elif args.command == "draft-outreach":
        if not ENABLE_LINK_EARNING:
            print("draft-outreach is disabled by ENABLE_LINK_EARNING=false.")
        else:
            from workers.python.outreach.link_earning import draft_outreach

            print(draft_outreach())


def add_noarg(subcommands: argparse._SubParsersAction[argparse.ArgumentParser], name: str) -> None:
    subcommands.add_parser(name)


if __name__ == "__main__":
    main()
