from __future__ import annotations

from argparse import Namespace

from workers.python.cli_dispatch_result import NOT_HANDLED, DispatchResult, handled
from workers.python.writers.market_content_strategy import (
    create_content_strategy,
    generate_content_brief,
    generate_test_post,
    promote_index_candidate,
    publish_test_article,
    set_article_index_status,
)


def run_content_command(args: Namespace) -> DispatchResult:
    if args.command == "strategy:create":
        return handled(create_content_strategy(args.keyword_id))
    if args.command in {"strategy:generate-brief", "generate-content-briefs"}:
        return handled(generate_content_brief(args.strategy_id if hasattr(args, "strategy_id") else None))
    if args.command == "post:generate-test":
        return handled(generate_test_post(args.strategy_id))
    if args.command == "post:publish-test":
        return handled(publish_test_article(args.article_id, args.mode))
    if args.command == "post:promote-index-candidate":
        return handled(promote_index_candidate(args.article_id))
    if args.command == "post:set-index-status":
        return handled(set_article_index_status(args.article_id, args.index_status))
    return NOT_HANDLED
