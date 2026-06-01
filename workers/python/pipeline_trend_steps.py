from __future__ import annotations

from pathlib import Path

from workers.python.common import DATA
from workers.python.feature_flags import (
    ENABLE_DISTRIBUTION_DRAFTS,
    ENABLE_LINK_EARNING,
    ENABLE_OFFER_MATCHING,
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
from workers.python.intelligence.trend_monetization_router import route_trend_monetization
from workers.python.pipeline_types import PipelineStep
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
    publish_test_article,
)


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
                ("trend:route-monetization", route_trend_monetization),
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


def api_free_six_steps(trend_signal_file: Path | None = None, serp_results_file: Path | None = None) -> list[PipelineStep]:
    return [
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
        (
            "serp:import-results",
            lambda: import_serp_results(serp_results_file or DATA / "seeds" / "serp-results.csv"),
        ),
        ("serp:fetch-pages", fetch_serp_pages),
        ("serp:analyze-pages", analyze_serp_pages),
        ("serp:summarize-opportunity", summarize_serp_opportunity),
        ("serp:report", serp_report),
        ("trend:route-monetization", route_trend_monetization),
        ("strategy:create", create_content_strategy),
        ("strategy:generate-brief", generate_content_brief),
        ("post:generate-test", generate_test_post),
        ("post:publish-test --mode noindex", lambda: publish_test_article(mode="noindex")),
    ]


def trend_to_post_extra() -> dict[str, object]:
    return {
        "defaultPipelineRunsMonetization": False,
        "disabledLaterPhases": {
            "offerMatching": not ENABLE_OFFER_MATCHING,
            "distributionDrafts": not ENABLE_DISTRIBUTION_DRAFTS,
            "linkEarning": not ENABLE_LINK_EARNING,
        },
    }
