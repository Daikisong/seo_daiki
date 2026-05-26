from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timezone
from pathlib import Path
import traceback

from workers.python.common import DATA, ensure_dirs, write_json
from workers.python.collectors.aliexpress_api import search_aliexpress_products
from workers.python.collectors.manual_seed_import import seed_products
from workers.python.collectors.search_console import import_search_console
from workers.python.distribution.owned_channel import generate_distribution_assets
from workers.python.evidence.evidence_pack_builder import build_evidence_pack
from workers.python.intelligence.locale_risk_matrix import build_locale_risk
from workers.python.intelligence.offer_matching import match_affiliate_offers
from workers.python.intelligence.price_truth_engine import build_price_truth
from workers.python.intelligence.product_identity_graph import build_identity_graph
from workers.python.intelligence.review_signal_extractor import extract_review_signals
from workers.python.intelligence.search_console_feedback import build_search_console_suggestions
from workers.python.intelligence.seller_claim_extractor import extract_seller_claims
from workers.python.intelligence.trend_topic_engine import (
    cluster_topics,
    import_trend_signals,
    score_topics,
)
from workers.python.intelligence.variant_trap_detector import detect_variant_traps
from workers.python.intelligence.verified_claim_builder import build_verified_claims
from workers.python.outreach.link_earning import draft_outreach, import_link_prospects, score_link_prospects, score_linkable_assets
from workers.python.collectors.price_snapshot import snapshot_prices
from workers.python.validators.quality_gate import run_quality_gate
from workers.python.validators.publishing_gate import run_topic_publishing_gate
from workers.python.writers.article_draft_generator import generate_draft
from workers.python.writers.article_outline_generator import generate_outline
from workers.python.writers.multilingual_publishing import score_localization, sync_hreflang_groups
from workers.python.writers.topic_article_generator import generate_topic_article
from workers.python.writers.topic_brief_generator import generate_topic_briefs
from workers.python.writers.topic_localizer import localize_topic_article
from workers.python.writers.url_inventory import generate_url_inventory


def run_worker_pipeline(
    seed_file: Path,
    locales: list[str],
    draft_types: list[str],
    url_plan_file: Path,
    trend_signal_file: Path | None = None,
    keyword: str | None = None,
    page_size: int = 20,
    continue_on_error: bool = False,
    include_search_console: bool = True,
) -> str:
    ensure_dirs()
    steps: list[tuple[str, Callable[[], object]]] = [
        ("seed-products", lambda: seed_products(seed_file)),
    ]

    if keyword:
        steps.append(("search-aliexpress-products", lambda: search_aliexpress_products(keyword, page_size)))

    steps.extend(
        [
            ("build-identity-graph", build_identity_graph),
            ("detect-variant-traps", detect_variant_traps),
            ("extract-seller-claims", extract_seller_claims),
            ("snapshot-prices", snapshot_prices),
            ("build-price-truth", build_price_truth),
            ("build-locale-risk", build_locale_risk),
            ("extract-review-signals", extract_review_signals),
            ("build-verified-claims", build_verified_claims),
        ]
    )

    for locale in locales:
        steps.append((f"build-evidence-pack:{locale}", lambda locale=locale: build_evidence_pack(locale)))

    for locale in locales:
        for draft_type in draft_types:
            steps.append((f"generate-outline:{locale}:{draft_type}", lambda locale=locale, draft_type=draft_type: generate_outline(locale, draft_type)))
            steps.append((f"generate-draft:{locale}:{draft_type}", lambda locale=locale, draft_type=draft_type: generate_draft(locale, draft_type)))

    if include_search_console:
        steps.append(("import-search-console", lambda: import_search_console(None, None)))
        steps.append(("suggest-refreshes", build_search_console_suggestions))

    steps.extend(
        [
            (
                "import-trend-signals",
                lambda: import_trend_signals(trend_signal_file or DATA / "seeds" / "trend-signals.csv"),
            ),
            ("cluster-topics", cluster_topics),
            ("score-topics", score_topics),
            ("generate-content-briefs", generate_topic_briefs),
            ("match-affiliate-offers", match_affiliate_offers),
            ("generate-topic-draft", generate_topic_article),
            ("localize-topic-draft", localize_topic_article),
            ("run-publishing-gate", run_topic_publishing_gate),
            ("score-localization", score_localization),
            ("sync-hreflang-groups", sync_hreflang_groups),
            ("generate-distribution-assets", generate_distribution_assets),
            ("score-linkable-assets", score_linkable_assets),
            ("import-link-prospects", lambda: import_link_prospects(DATA / "seeds" / "link-prospects.csv")),
            ("score-link-prospects", score_link_prospects),
            ("draft-outreach", draft_outreach),
        ]
    )

    steps.extend(
        [
            ("generate-url-inventory", lambda: generate_url_inventory(url_plan_file)),
            ("run-quality-gate", run_quality_gate),
        ]
    )

    started_at = datetime.now(timezone.utc)
    results: list[dict[str, object]] = []
    status = "pass"

    for name, action in steps:
        step_started_at = datetime.now(timezone.utc)
        try:
            output = action()
            results.append(
                {
                    "name": name,
                    "status": "pass",
                    "output": str(output),
                    "started_at": step_started_at.isoformat(),
                    "finished_at": datetime.now(timezone.utc).isoformat(),
                }
            )
        except Exception as error:  # noqa: BLE001 - pipeline report must capture any failed worker step.
            status = "failed"
            results.append(
                {
                    "name": name,
                    "status": "failed",
                    "error": str(error),
                    "traceback": traceback.format_exc(),
                    "started_at": step_started_at.isoformat(),
                    "finished_at": datetime.now(timezone.utc).isoformat(),
                }
            )
            if not continue_on_error:
                break

    report = {
        "status": status,
        "started_at": started_at.isoformat(),
        "finished_at": datetime.now(timezone.utc).isoformat(),
        "inputs": {
            "seed_file": str(seed_file),
            "keyword": keyword,
            "page_size": page_size,
            "locales": locales,
            "draft_types": draft_types,
            "url_plan_file": str(url_plan_file),
            "trend_signal_file": str(trend_signal_file or DATA / "seeds" / "trend-signals.csv"),
            "continue_on_error": continue_on_error,
            "include_search_console": include_search_console,
        },
        "steps": results,
    }
    path = DATA / "exports" / "pipeline_run.json"
    write_json(path, report)
    if status == "failed":
        raise RuntimeError(f"Worker pipeline failed. See {path}.")
    return str(path)
