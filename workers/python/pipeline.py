from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timezone
from pathlib import Path
import traceback

from workers.python.common import DATA, ensure_dirs, write_json
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
    generate_trend_keywords,
    import_market_trend_signals,
    init_markets,
    normalize_market_trends,
    cluster_market_trends,
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


def run_worker_pipeline(
    seed_file: Path,
    locales: list[str],
    draft_types: list[str],
    url_plan_file: Path,
    trend_signal_file: Path | None = None,
    keyword: str | None = None,
    page_size: int = 20,
    continue_on_error: bool = False,
    include_search_console: bool = True,
) -> str:
    return run_trend_to_post_pipeline(
        trend_signal_file=trend_signal_file or DATA / "seeds" / "trend-signals.csv",
        serp_results_file=DATA / "seeds" / "serp-results.csv",
        continue_on_error=continue_on_error,
    )


def run_trend_to_post_pipeline(
    trend_signal_file: Path | None = None,
    serp_results_file: Path | None = None,
    continue_on_error: bool = False,
) -> str:
    steps: list[tuple[str, Callable[[], object]]] = []
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
                ("serp:import-results", lambda: import_serp_results(serp_results_file or DATA / "seeds" / "serp-results.csv")),
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
    return run_steps(
        "trend_to_post",
        steps,
        continue_on_error,
        extra={
            "defaultPipelineRunsMonetization": False,
            "disabledLaterPhases": {
                "offerMatching": not ENABLE_OFFER_MATCHING,
                "distributionDrafts": not ENABLE_DISTRIBUTION_DRAFTS,
                "linkEarning": not ENABLE_LINK_EARNING,
            },
        },
    )


def run_post_to_product_analysis_pipeline(
    candidates_file: Path | None = None,
    article_id: str | None = None,
    continue_on_error: bool = False,
) -> str:
    if not ENABLE_PRODUCT_CANDIDATE_DISCOVERY:
        raise RuntimeError("ENABLE_PRODUCT_CANDIDATE_DISCOVERY=false; product candidate analysis is disabled.")
    steps: list[tuple[str, Callable[[], object]]] = [
        ("products:import-candidates", lambda: import_product_candidates(candidates_file or DATA / "seeds" / "product-candidates.csv")),
        ("products:discover-candidates", lambda: discover_product_candidates(article_id)),
        ("products:analyze-candidates", lambda: analyze_product_candidates(article_id)),
        ("products:build-analysis-block", lambda: build_product_analysis_block(article_id)),
    ]
    return run_steps("post_to_product_analysis", steps, continue_on_error, extra={"monetizedLinksInserted": False})


def run_monetization_review_pipeline(article_id: str | None = None, continue_on_error: bool = False) -> str:
    steps: list[tuple[str, Callable[[], object]]] = [
        ("monetization:create-review", lambda: create_monetization_review(article_id)),
        ("monetization:draft-placements", draft_monetized_placements),
    ]
    return run_steps(
        "monetization_review",
        steps,
        continue_on_error,
        extra={"requiresManualApproval": True, "linksAppliedByDefault": False},
    )


def run_steps(name: str, steps: list[tuple[str, Callable[[], object]]], continue_on_error: bool, extra: dict[str, object] | None = None) -> str:
    ensure_dirs()
    started_at = datetime.now(timezone.utc)
    results: list[dict[str, object]] = []
    status = "pass"

    for step_name, action in steps:
        step_started_at = datetime.now(timezone.utc)
        try:
            output = action()
            results.append(
                {
                    "name": step_name,
                    "status": "pass",
                    "output": str(output),
                    "started_at": step_started_at.isoformat(),
                    "finished_at": datetime.now(timezone.utc).isoformat(),
                }
            )
        except Exception as error:  # noqa: BLE001 - pipeline report must capture any failed worker step.
            status = "failed"
            results.append(
                {
                    "name": step_name,
                    "status": "failed",
                    "error": str(error),
                    "traceback": traceback.format_exc(),
                    "started_at": step_started_at.isoformat(),
                    "finished_at": datetime.now(timezone.utc).isoformat(),
                }
            )
            if not continue_on_error:
                break

    report = {
        "pipeline": name,
        "status": status,
        "started_at": started_at.isoformat(),
        "finished_at": datetime.now(timezone.utc).isoformat(),
        "steps": results,
        **(extra or {}),
    }
    path = DATA / "exports" / "pipeline_run.json"
    named_path = DATA / "exports" / f"pipeline_{name}_run.json"
    write_json(named_path, report)
    write_json(path, report)
    if status == "failed":
        raise RuntimeError(f"Worker pipeline failed. See {path}.")
    return str(path)
