from __future__ import annotations

from workers.python.cli_parser_helpers import Subcommands, add_noarg


def add_performance_commands(subcommands: Subcommands) -> None:
    add_noarg(subcommands, "performance:import-search-console")
    add_noarg(subcommands, "performance:snapshot")
    add_noarg(subcommands, "performance:recommend-actions")
    performance_report_parser = subcommands.add_parser("performance:report")
    performance_report_parser.add_argument("--market")
