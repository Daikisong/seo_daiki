from __future__ import annotations

from workers.python.cli_parser_helpers import Subcommands


def add_content_commands(subcommands: Subcommands) -> None:
    strategy_create = subcommands.add_parser("strategy:create")
    strategy_create.add_argument("--keyword-id")
    strategy_brief = subcommands.add_parser("strategy:generate-brief")
    strategy_brief.add_argument("--strategy-id")
    post_generate = subcommands.add_parser("post:generate-test")
    post_generate.add_argument("--strategy-id")
    post_publish = subcommands.add_parser("post:publish-test")
    post_publish.add_argument("--article-id")
    post_publish.add_argument("--mode", default="noindex")
    post_promote = subcommands.add_parser("post:promote-index-candidate")
    post_promote.add_argument("--article-id")
    post_index_status = subcommands.add_parser("post:set-index-status")
    post_index_status.add_argument("--article-id")
    post_index_status.add_argument("--index-status", choices=("index", "noindex", "pending"), default="index")
