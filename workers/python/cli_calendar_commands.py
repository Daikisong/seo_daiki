from __future__ import annotations

from argparse import Namespace

from workers.python.cli_dispatch_result import NOT_HANDLED, DispatchResult, handled
from workers.python.intelligence.calendar_engine import (
    build_all_market_calendars,
    build_market_calendar,
    explain_market_calendar,
    export_market_calendars,
)


def run_calendar_command(args: Namespace) -> DispatchResult:
    if args.command == "calendar:build":
        return handled(build_market_calendar(args.market))
    if args.command == "calendar:build-all":
        return handled(build_all_market_calendars())
    if args.command == "calendar:explain":
        return handled(explain_market_calendar(args.market))
    if args.command == "calendar:export":
        return handled(export_market_calendars())
    return NOT_HANDLED
