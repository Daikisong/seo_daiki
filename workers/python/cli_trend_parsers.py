from __future__ import annotations

from workers.python.cli_parser_helpers import Subcommands, add_noarg
from workers.python.common import DATA


def add_trend_commands(subcommands: Subcommands) -> None:
    add_noarg(subcommands, "trend:init-markets")
    trend_import = subcommands.add_parser("trend:import-signals")
    trend_import.add_argument("--file", default=str(DATA / "seeds" / "trend-signals.csv"))
    trend_collect = subcommands.add_parser("trend:collect")
    trend_collect.add_argument("--market")
    trend_collect.add_argument("--source", default="manual_csv")
    add_noarg(subcommands, "trend:normalize")
    add_noarg(subcommands, "trend:cluster")
    add_noarg(subcommands, "trend:score")
    trend_report_parser = subcommands.add_parser("trend:report")
    trend_report_parser.add_argument("--market")
    trend_keywords = subcommands.add_parser("trend:generate-keywords")
    trend_keywords.add_argument("--cluster-id")
    trend_route = subcommands.add_parser("trend:route-monetization")
    trend_route.add_argument("--article-id")


def add_legacy_trend_commands(subcommands: Subcommands) -> None:
    legacy_trend_import = subcommands.add_parser("import-trend-signals")
    legacy_trend_import.add_argument("--file", default=str(DATA / "seeds" / "trend-signals.csv"))
    add_noarg(subcommands, "cluster-topics")
    add_noarg(subcommands, "score-topics")
    add_noarg(subcommands, "generate-content-briefs")
