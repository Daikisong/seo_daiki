from __future__ import annotations

import argparse
from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from workers.python.common import DATA, ensure_dirs
from workers.python.collectors.aliexpress_api import search_aliexpress_products
from workers.python.collectors.manual_seed_import import seed_products
from workers.python.collectors.price_snapshot import snapshot_prices
from workers.python.collectors.search_console import import_search_console
from workers.python.evidence.evidence_pack_builder import build_evidence_pack
from workers.python.intelligence.locale_risk_matrix import build_locale_risk
from workers.python.intelligence.price_truth_engine import build_price_truth
from workers.python.intelligence.product_identity_graph import build_identity_graph
from workers.python.intelligence.review_signal_extractor import extract_review_signals
from workers.python.intelligence.search_console_feedback import build_search_console_suggestions
from workers.python.intelligence.seller_claim_extractor import extract_seller_claims
from workers.python.intelligence.variant_trap_detector import detect_variant_traps
from workers.python.intelligence.verified_claim_builder import build_verified_claims
from workers.python.pipeline import run_worker_pipeline
from workers.python.validators.quality_gate import run_quality_gate
from workers.python.writers.article_draft_generator import generate_draft
from workers.python.writers.article_outline_generator import generate_outline
from workers.python.writers.url_inventory import generate_url_inventory


def main() -> None:
    parser = argparse.ArgumentParser(description="Global Import Lab worker CLI")
    subcommands = parser.add_subparsers(dest="command", required=True)

    seed = subcommands.add_parser("seed-products")
    seed.add_argument("--file", default=str(DATA / "seeds" / "usb-c-chargers.csv"))
    search_aliexpress = subcommands.add_parser("search-aliexpress-products")
    search_aliexpress.add_argument("--keyword", required=True)
    search_aliexpress.add_argument("--page-size", default=20, type=int)

    subcommands.add_parser("build-identity-graph")
    subcommands.add_parser("detect-variant-traps")
    subcommands.add_parser("extract-seller-claims")
    subcommands.add_parser("snapshot-prices")
    subcommands.add_parser("build-price-truth")
    subcommands.add_parser("build-locale-risk")
    subcommands.add_parser("extract-review-signals")
    subcommands.add_parser("build-verified-claims")
    search_console = subcommands.add_parser("import-search-console")
    search_console.add_argument("--start-date")
    search_console.add_argument("--end-date")
    subcommands.add_parser("suggest-refreshes")
    inventory = subcommands.add_parser("generate-url-inventory")
    inventory.add_argument("--file", default=str(DATA / "seeds" / "initial-url-plan.csv"))

    pack = subcommands.add_parser("build-evidence-pack")
    pack.add_argument("--locale", default="en")

    outline = subcommands.add_parser("generate-outline")
    outline.add_argument("--locale", default="en")
    outline.add_argument("--type", default="review")
    outline.add_argument("--product-id")

    draft = subcommands.add_parser("generate-draft")
    draft.add_argument("--locale", default="en")
    draft.add_argument("--type", default="review")

    subcommands.add_parser("run-quality-gate")

    pipeline = subcommands.add_parser("run-pipeline")
    pipeline.add_argument("--seed-file", default=str(DATA / "seeds" / "usb-c-chargers.csv"))
    pipeline.add_argument("--keyword")
    pipeline.add_argument("--page-size", default=20, type=int)
    pipeline.add_argument("--locale", action="append", dest="locales", default=None)
    pipeline.add_argument("--draft-type", action="append", dest="draft_types", default=None)
    pipeline.add_argument("--url-plan-file", default=str(DATA / "seeds" / "initial-url-plan.csv"))
    pipeline.add_argument("--continue-on-error", action="store_true")
    pipeline.add_argument("--skip-search-console", action="store_true")

    args = parser.parse_args()
    ensure_dirs()

    if args.command == "seed-products":
        print(seed_products(Path(args.file)))
    elif args.command == "search-aliexpress-products":
        print(search_aliexpress_products(args.keyword, args.page_size))
    elif args.command == "build-identity-graph":
        print(build_identity_graph())
    elif args.command == "detect-variant-traps":
        print(detect_variant_traps())
    elif args.command == "extract-seller-claims":
        print(extract_seller_claims())
    elif args.command == "snapshot-prices":
        print(snapshot_prices())
    elif args.command == "build-price-truth":
        print(build_price_truth())
    elif args.command == "build-locale-risk":
        print(build_locale_risk())
    elif args.command == "extract-review-signals":
        print(extract_review_signals())
    elif args.command == "build-verified-claims":
        print(build_verified_claims())
    elif args.command == "import-search-console":
        print(import_search_console(args.start_date, args.end_date))
    elif args.command == "suggest-refreshes":
        print(build_search_console_suggestions())
    elif args.command == "generate-url-inventory":
        print(generate_url_inventory(Path(args.file)))
    elif args.command == "build-evidence-pack":
        print(build_evidence_pack(args.locale))
    elif args.command == "generate-outline":
        print(generate_outline(args.locale, args.type, args.product_id))
    elif args.command == "generate-draft":
        print(generate_draft(args.locale, args.type))
    elif args.command == "run-quality-gate":
        print(run_quality_gate())
    elif args.command == "run-pipeline":
        print(
            run_worker_pipeline(
                seed_file=Path(args.seed_file),
                locales=args.locales or ["en", "es", "pt-br"],
                draft_types=args.draft_types or ["review", "risk"],
                url_plan_file=Path(args.url_plan_file),
                keyword=args.keyword,
                page_size=args.page_size,
                continue_on_error=args.continue_on_error,
                include_search_console=not args.skip_search_console,
            )
        )


if __name__ == "__main__":
    main()
