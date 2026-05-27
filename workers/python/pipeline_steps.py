from __future__ import annotations

from collections.abc import Callable
from pathlib import Path

from workers.python.common import DATA
from workers.python.feature_flags import (
    ENABLE_DISTRIBUTION_DRAFTS,
    ENABLE_LINK_EARNING,
    ENABLE_OFFER_MATCHING,
    ENABLE_PRODUCT_CANDIDATE_DISCOVERY,
    ENABLE_SERP_INTELLIGENCE,
    ENABLE_TREND_ENGINE,
)
from workers.python.intelligence.calendar_engine import build_all_market_calendars
from workers.python.intelligence.market_trend_engine import (
    cluster_market_trends,
    generate_trend_keywords,
    import_market_trend_signals,
    init_markets,
    normalize_market_trends,
    score_market_trends,
    trend_report,
)
from workers.python.intelligence.monetization_review import create_monetization_review, draft_monetized_placements
from workers.python.intelligence.product_candidate_engine import (
    analyze_product_candidates,
    build_product_analysis_block,
    discover_product_candidates,
    import_product_candidates,
)
from workers.python.serp.serp_intelligence import (
    analyze_serp_pages,
    fetch_serp_pages,
    import_serp_results,
    serp_report,
    summarize_serp_opportunity,
)
from workers.python.writers.market_content_strategy import (
    create_content_strategy,
    generate_content_brief,
    generate_test_post,
)

PipelineStep = tuple[str, Callable[[], object]]


def trend_to_post_steps(trend_signal_file: Path | None = None, serp_results_file: Path | None = None) -> list[PipelineStep]:
    steps: list[PipelineStep] = []
    if ENABLE_TREND_ENGINE:
        steps.extend(
            [
                ("trend:init-markets", init_markets),
                (
                    "trend:import-signals",
                    lambda: import_market_trend_signals(trend_signal_file or DATA / "seeds" / "trend-signals.csv"),
                ),
                ("trend:normalize", normalize_market_trends),
                ("trend:cluster", cluster_market_trends),
                ("trend:score", score_market_trends),
                ("trend:generate-keywords", generate_trend_keywords),
                ("trend:report", trend_report),
            ]
        )
    if ENABLE_SERP_INTELLIGENCE:
        steps.extend(
            [
                (
                    "serp:import-results",
                    lambda: import_serp_results(serp_results_file or DATA / "seeds" / "serp-results.csv"),
                ),
                ("serp:fetch-pages", fetch_serp_pages),
                ("serp:analyze-pages", analyze_serp_pages),
                ("serp:summarize-opportunity", summarize_serp_opportunity),
                ("serp:report", serp_report),
            ]
        )
    steps.extend(
        [
            ("strategy:create", create_content_strategy),
            ("strategy:generate-brief", generate_content_brief),
            ("post:generate-test", generate_test_post),
            ("calendar:build-all", build_all_market_calendars),
        ]
    )
    return steps


def trend_to_post_extra() -> dict[str, object]:
    return {
        "defaultPipelineRunsMonetization": False,
        "disabledLaterPhases": {
            "offerMatching": not ENABLE_OFFER_MATCHING,
            "distributionDrafts": not ENABLE_DISTRIBUTION_DRAFTS,
            "linkEarning": not ENABLE_LINK_EARNING,
        },
    }


def post_to_product_analysis_steps(candidates_file: Path | None = None, article_id: str | None = None) -> list[PipelineStep]:
    if not ENABLE_PRODUCT_CANDIDATE_DISCOVERY:
        raise RuntimeError("ENABLE_PRODUCT_CANDIDATE_DISCOVERY=false; product candidate analysis is disabled.")
    return [
        (
            "products:import-candidates",
            lambda: import_product_candidates(candidates_file or DATA / "seeds" / "product-candidates.csv"),
        ),
        ("products:discover-candidates", lambda: discover_product_candidates(article_id)),
        ("products:analyze-candidates", lambda: analyze_product_candidates(article_id)),
        ("products:build-analysis-block", lambda: build_product_analysis_block(article_id)),
    ]


def monetization_review_steps(article_id: str | None = None) -> list[PipelineStep]:
    return [
        ("monetization:create-review", lambda: create_monetization_review(article_id)),
        ("monetization:draft-placements", draft_monetized_placements),
    ]
