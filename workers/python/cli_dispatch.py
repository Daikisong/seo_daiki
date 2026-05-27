from __future__ import annotations

from argparse import Namespace
from typing import Any, Callable

from workers.python.cli_calendar_commands import run_calendar_command
from workers.python.cli_content_commands import run_content_command
from workers.python.cli_dispatch_result import DispatchResult
from workers.python.cli_later_phase_commands import run_later_phase_command
from workers.python.cli_monetization_commands import run_monetization_command
from workers.python.cli_performance_commands import run_performance_command
from workers.python.cli_pipeline_commands import run_pipeline_command
from workers.python.cli_product_commands import run_product_command
from workers.python.cli_serp_commands import run_serp_command
from workers.python.cli_trend_commands import run_trend_command

CommandHandler = Callable[[Namespace], DispatchResult]

COMMAND_HANDLERS: tuple[CommandHandler, ...] = (
    run_trend_command,
    run_serp_command,
    run_content_command,
    run_calendar_command,
    run_performance_command,
    run_product_command,
    run_monetization_command,
    run_pipeline_command,
    run_later_phase_command,
)

def run_command(args: Namespace) -> Any:
    for handler in COMMAND_HANDLERS:
        result = handler(args)
        if result.handled:
            return result.value
    raise ValueError(f"Unsupported command: {args.command}")
