from __future__ import annotations

from argparse import Namespace
from pathlib import Path

from workers.python.cli_dispatch_result import NOT_HANDLED, DispatchResult, handled
from workers.python.serp.serp_intelligence import (
    analyze_serp_pages,
    collect_serp,
    fetch_serp_pages,
    import_serp_results,
    serp_report,
    summarize_serp_opportunity,
)


def run_serp_command(args: Namespace) -> DispatchResult:
    if args.command == "serp:import-results":
        return handled(import_serp_results(Path(args.file)))
    if args.command == "serp:collect":
        return handled(collect_serp(args.keyword_id, args.provider))
    if args.command == "serp:fetch-pages":
        return handled(fetch_serp_pages(args.snapshot_id))
    if args.command == "serp:analyze-pages":
        return handled(analyze_serp_pages(args.snapshot_id))
    if args.command == "serp:summarize-opportunity":
        return handled(summarize_serp_opportunity(args.keyword_id))
    if args.command == "serp:report":
        return handled(serp_report(args.market))
    return NOT_HANDLED
