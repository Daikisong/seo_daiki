from __future__ import annotations

from pathlib import Path

from workers.python.common import DATA
from workers.python.pipeline_runner import run_steps
from workers.python.pipeline_steps import (
    monetization_review_steps,
    post_to_product_analysis_steps,
    trend_to_post_extra,
    trend_to_post_steps,
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
    return run_steps(
        "trend_to_post",
        trend_to_post_steps(trend_signal_file, serp_results_file),
        continue_on_error,
        extra=trend_to_post_extra(),
    )


def run_post_to_product_analysis_pipeline(
    candidates_file: Path | None = None,
    article_id: str | None = None,
    continue_on_error: bool = False,
) -> str:
    return run_steps(
        "post_to_product_analysis",
        post_to_product_analysis_steps(candidates_file, article_id),
        continue_on_error,
        extra={"monetizedLinksInserted": False},
    )


def run_monetization_review_pipeline(article_id: str | None = None, continue_on_error: bool = False) -> str:
    return run_steps(
        "monetization_review",
        monetization_review_steps(article_id),
        continue_on_error,
        extra={"requiresManualApproval": True, "linksAppliedByDefault": False},
    )
