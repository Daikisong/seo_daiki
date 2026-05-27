from __future__ import annotations

from argparse import Namespace
from pathlib import Path

from workers.python.cli_dispatch_result import NOT_HANDLED, DispatchResult, handled
from workers.python.intelligence.product_candidate_engine import (
    analyze_product_candidates,
    build_product_analysis_block,
    discover_product_candidates,
    import_product_candidates,
)


def run_product_command(args: Namespace) -> DispatchResult:
    if args.command == "products:import-candidates":
        return handled(import_product_candidates(Path(args.file)))
    if args.command == "products:discover-candidates":
        return handled(discover_product_candidates(args.article_id))
    if args.command == "products:analyze-candidates":
        return handled(analyze_product_candidates(args.article_id))
    if args.command == "products:build-analysis-block":
        return handled(build_product_analysis_block(args.article_id))
    return NOT_HANDLED
