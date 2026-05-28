from __future__ import annotations

from workers.python.cli_parser_helpers import Subcommands, add_noarg


def add_calendar_commands(subcommands: Subcommands) -> None:
    calendar_build = subcommands.add_parser("calendar:build")
    calendar_build.add_argument("--market")
    add_noarg(subcommands, "calendar:build-all")
    calendar_explain = subcommands.add_parser("calendar:explain")
    calendar_explain.add_argument("--market")
    add_noarg(subcommands, "calendar:export")
