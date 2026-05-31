from __future__ import annotations

from workers.python.cli_parser_helpers import Subcommands
from workers.python.common import DATA


def add_pipeline_commands(subcommands: Subcommands) -> None:
    api_free_pipeline = subcommands.add_parser("pipeline:api-free-six")
    api_free_pipeline.add_argument("--trend-signal-file", default=str(DATA / "seeds" / "trend-signals.csv"))
    api_free_pipeline.add_argument("--serp-results-file", default=str(DATA / "seeds" / "serp-results.csv"))
    api_free_pipeline.add_argument("--continue-on-error", action="store_true")
    subcommands.add_parser("verify:api-free-six")
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


def add_legacy_pipeline_commands(subcommands: Subcommands) -> None:
    legacy_pipeline = subcommands.add_parser("run-pipeline")
    legacy_pipeline.add_argument("--trend-signal-file", default=str(DATA / "seeds" / "trend-signals.csv"))
    legacy_pipeline.add_argument("--continue-on-error", action="store_true")
