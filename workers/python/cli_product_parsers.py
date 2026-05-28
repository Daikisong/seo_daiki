from __future__ import annotations

from workers.python.cli_parser_helpers import Subcommands
from workers.python.common import DATA


def add_product_commands(subcommands: Subcommands) -> None:
    product_import = subcommands.add_parser("products:import-candidates")
    product_import.add_argument("--file", default=str(DATA / "seeds" / "product-candidates.csv"))
    product_discover = subcommands.add_parser("products:discover-candidates")
    product_discover.add_argument("--article-id")
    product_analyze = subcommands.add_parser("products:analyze-candidates")
    product_analyze.add_argument("--article-id")
    product_block = subcommands.add_parser("products:build-analysis-block")
    product_block.add_argument("--article-id")
