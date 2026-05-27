from __future__ import annotations

from argparse import Namespace
from pathlib import Path

from workers.python.cli_dispatch_result import NOT_HANDLED, DispatchResult, handled
from workers.python.common import DATA
from workers.python.pipeline import (
    run_monetization_review_pipeline,
    run_post_to_product_analysis_pipeline,
    run_trend_to_post_pipeline,
    run_worker_pipeline,
)


def run_pipeline_command(args: Namespace) -> DispatchResult:
    if args.command == "pipeline:trend-to-post":
        return handled(
            run_trend_to_post_pipeline(
                Path(args.trend_signal_file),
                Path(args.serp_results_file),
                continue_on_error=args.continue_on_error,
            )
        )
    if args.command == "pipeline:post-to-product-analysis":
        return handled(run_post_to_product_analysis_pipeline(Path(args.candidates_file), args.article_id, args.continue_on_error))
    if args.command == "pipeline:monetization-review":
        return handled(run_monetization_review_pipeline(args.article_id, args.continue_on_error))
    if args.command == "run-pipeline":
        return handled(
            run_worker_pipeline(
                seed_file=DATA / "seeds" / "usb-c-chargers.csv",
                locales=["en", "es", "pt-br"],
                draft_types=["review"],
                url_plan_file=DATA / "seeds" / "initial-url-plan.csv",
                trend_signal_file=Path(args.trend_signal_file),
                continue_on_error=args.continue_on_error,
            )
        )
    return NOT_HANDLED
