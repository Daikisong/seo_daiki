from __future__ import annotations

from workers.python.cli_parser_helpers import Subcommands
from workers.python.common import DATA


def add_serp_commands(subcommands: Subcommands) -> None:
    serp_import = subcommands.add_parser("serp:import-results")
    serp_import.add_argument("--file", default=str(DATA / "seeds" / "serp-results.csv"))
    serp_collect = subcommands.add_parser("serp:collect")
    serp_collect.add_argument("--keyword-id")
    serp_collect.add_argument("--provider", default="manual_csv")
    serp_fetch = subcommands.add_parser("serp:fetch-pages")
    serp_fetch.add_argument("--snapshot-id")
    serp_analyze = subcommands.add_parser("serp:analyze-pages")
    serp_analyze.add_argument("--snapshot-id")
    serp_summary = subcommands.add_parser("serp:summarize-opportunity")
    serp_summary.add_argument("--keyword-id")
    serp_report_parser = subcommands.add_parser("serp:report")
    serp_report_parser.add_argument("--market")
