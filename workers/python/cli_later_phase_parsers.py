from __future__ import annotations

from workers.python.cli_parser_helpers import Subcommands, add_noarg
from workers.python.common import DATA


def add_later_phase_commands(subcommands: Subcommands) -> None:
    offer_match = subcommands.add_parser("match-affiliate-offers")
    offer_match.add_argument("--topic-id")
    offer_match.add_argument("--article-id")
    offer_match.add_argument("--offers-file", default=str(DATA / "seeds" / "offers.csv"))
    distribution = subcommands.add_parser("generate-distribution-assets")
    distribution.add_argument("--article-id")
    add_noarg(subcommands, "draft-outreach")
