from __future__ import annotations

import argparse

from workers.python.cli_calendar_parsers import add_calendar_commands
from workers.python.cli_content_parsers import add_content_commands
from workers.python.cli_later_phase_parsers import add_later_phase_commands
from workers.python.cli_monetization_parsers import add_monetization_commands
from workers.python.cli_parser_helpers import CommandRegistrar, Subcommands, add_noarg
from workers.python.cli_performance_parsers import add_performance_commands
from workers.python.cli_pipeline_parsers import add_legacy_pipeline_commands, add_pipeline_commands
from workers.python.cli_product_parsers import add_product_commands
from workers.python.cli_serp_parsers import add_serp_commands
from workers.python.cli_trend_parsers import add_legacy_trend_commands, add_trend_commands

PARSER_REGISTRARS: tuple[CommandRegistrar, ...] = (
    add_trend_commands,
    add_serp_commands,
    add_content_commands,
    add_calendar_commands,
    add_performance_commands,
    add_product_commands,
    add_monetization_commands,
    add_pipeline_commands,
    add_legacy_trend_commands,
    add_legacy_pipeline_commands,
    add_later_phase_commands,
)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Global trend-to-content worker CLI")
    subcommands = parser.add_subparsers(dest="command", required=True)
    for add_commands in PARSER_REGISTRARS:
        add_commands(subcommands)

    return parser
