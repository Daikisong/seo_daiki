from __future__ import annotations

from workers.python.cli_parser_helpers import Subcommands


def add_monetization_commands(subcommands: Subcommands) -> None:
    monetization_review = subcommands.add_parser("monetization:create-review")
    monetization_review.add_argument("--article-id")
    monetization_draft = subcommands.add_parser("monetization:draft-placements")
    monetization_draft.add_argument("--review-id")
    monetization_apply = subcommands.add_parser("monetization:apply-approved")
    monetization_apply.add_argument("--review-id")
