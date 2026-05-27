from __future__ import annotations

from argparse import Namespace

from workers.python.cli_dispatch_result import NOT_HANDLED, DispatchResult, handled
from workers.python.intelligence.monetization_review import (
    apply_approved_monetization,
    create_monetization_review,
    draft_monetized_placements,
)


def run_monetization_command(args: Namespace) -> DispatchResult:
    if args.command == "monetization:create-review":
        return handled(create_monetization_review(args.article_id))
    if args.command == "monetization:draft-placements":
        return handled(draft_monetized_placements(args.review_id))
    if args.command == "monetization:apply-approved":
        return handled(apply_approved_monetization(args.review_id))
    return NOT_HANDLED
