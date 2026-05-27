from __future__ import annotations

from argparse import Namespace

from workers.python.cli_dispatch_result import NOT_HANDLED, DispatchResult, handled
from workers.python.intelligence.performance_feedback import (
    import_search_console_performance,
    performance_report,
    recommend_performance_actions,
    snapshot_performance,
)


def run_performance_command(args: Namespace) -> DispatchResult:
    if args.command == "performance:import-search-console":
        return handled(import_search_console_performance())
    if args.command == "performance:snapshot":
        return handled(snapshot_performance())
    if args.command == "performance:recommend-actions":
        return handled(recommend_performance_actions())
    if args.command == "performance:report":
        return handled(performance_report(args.market))
    return NOT_HANDLED
