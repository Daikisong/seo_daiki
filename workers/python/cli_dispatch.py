from __future__ import annotations

from argparse import Namespace
from pathlib import Path
from typing import Any

from workers.python.common import DATA
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


def run_command(args: Namespace) -> Any:
    if args.command == "trend:init-markets":
        return init_markets()
    if args.command in {"trend:import-signals", "import-trend-signals"}:
        return import_market_trend_signals(Path(args.file))
    if args.command == "trend:collect":
        return collect_market_trends(args.market, args.source)
    if args.command == "trend:normalize":
        return normalize_market_trends()
    if args.command in {"trend:cluster", "cluster-topics"}:
        return cluster_market_trends()
    if args.command in {"trend:score", "score-topics"}:
        return score_market_trends()
    if args.command == "trend:report":
        return trend_report(args.market)
    if args.command == "trend:generate-keywords":
        return generate_trend_keywords(args.cluster_id)
    if args.command == "serp:import-results":
        return import_serp_results(Path(args.file))
    if args.command == "serp:collect":
        return collect_serp(args.keyword_id, args.provider)
    if args.command == "serp:fetch-pages":
        return fetch_serp_pages(args.snapshot_id)
    if args.command == "serp:analyze-pages":
        return analyze_serp_pages(args.snapshot_id)
    if args.command == "serp:summarize-opportunity":
        return summarize_serp_opportunity(args.keyword_id)
    if args.command == "serp:report":
        return serp_report(args.market)
    if args.command == "strategy:create":
        return create_content_strategy(args.keyword_id)
    if args.command in {"strategy:generate-brief", "generate-content-briefs"}:
        return generate_content_brief(args.strategy_id if hasattr(args, "strategy_id") else None)
    if args.command == "post:generate-test":
        return generate_test_post(args.strategy_id)
    if args.command == "post:publish-test":
        return publish_test_article(args.article_id, args.mode)
    if args.command == "post:promote-index-candidate":
        return promote_index_candidate(args.article_id)
    if args.command == "calendar:build":
        return build_market_calendar(args.market)
    if args.command == "calendar:build-all":
        return build_all_market_calendars()
    if args.command == "calendar:explain":
        return explain_market_calendar(args.market)
    if args.command == "calendar:export":
        return export_market_calendars()
    if args.command == "performance:import-search-console":
        return import_search_console_performance()
    if args.command == "performance:snapshot":
        return snapshot_performance()
    if args.command == "performance:recommend-actions":
        return recommend_performance_actions()
    if args.command == "performance:report":
        return performance_report(args.market)
    if args.command == "products:import-candidates":
        return import_product_candidates(Path(args.file))
    if args.command == "products:discover-candidates":
        return discover_product_candidates(args.article_id)
    if args.command == "products:analyze-candidates":
        return analyze_product_candidates(args.article_id)
    if args.command == "products:build-analysis-block":
        return build_product_analysis_block(args.article_id)
    if args.command == "monetization:create-review":
        return create_monetization_review(args.article_id)
    if args.command == "monetization:draft-placements":
        return draft_monetized_placements(args.review_id)
    if args.command == "monetization:apply-approved":
        return apply_approved_monetization(args.review_id)
    if args.command == "pipeline:trend-to-post":
        return run_trend_to_post_pipeline(
            Path(args.trend_signal_file),
            Path(args.serp_results_file),
            continue_on_error=args.continue_on_error,
        )
    if args.command == "pipeline:post-to-product-analysis":
        return run_post_to_product_analysis_pipeline(Path(args.candidates_file), args.article_id, args.continue_on_error)
    if args.command == "pipeline:monetization-review":
        return run_monetization_review_pipeline(args.article_id, args.continue_on_error)
    if args.command == "run-pipeline":
        return run_worker_pipeline(
            seed_file=DATA / "seeds" / "usb-c-chargers.csv",
            locales=["en", "es", "pt-br"],
            draft_types=["review"],
            url_plan_file=DATA / "seeds" / "initial-url-plan.csv",
            trend_signal_file=Path(args.trend_signal_file),
            continue_on_error=args.continue_on_error,
        )
    if args.command == "match-affiliate-offers":
        if not ENABLE_OFFER_MATCHING:
            return "match-affiliate-offers is disabled by ENABLE_OFFER_MATCHING=false; use product candidate analysis first."

        from workers.python.intelligence.offer_matching import match_affiliate_offers

        return match_affiliate_offers(args.topic_id, args.article_id, Path(args.offers_file))
    if args.command == "generate-distribution-assets":
        if not ENABLE_DISTRIBUTION_DRAFTS:
            return "generate-distribution-assets is disabled by ENABLE_DISTRIBUTION_DRAFTS=false."

        from workers.python.distribution.owned_channel import generate_distribution_assets

        return generate_distribution_assets(args.article_id)
    if args.command == "draft-outreach":
        if not ENABLE_LINK_EARNING:
            return "draft-outreach is disabled by ENABLE_LINK_EARNING=false."

        from workers.python.outreach.link_earning import draft_outreach

        return draft_outreach()

    raise ValueError(f"Unsupported command: {args.command}")
