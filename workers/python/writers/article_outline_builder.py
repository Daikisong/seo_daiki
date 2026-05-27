from __future__ import annotations

from typing import Any

from workers.python.common import slugify
from workers.python.writers.article_outline_sections import evidence_refs_for_pack, sections_for_article
from workers.python.writers.article_outline_text_rules import (
    h1_candidate,
    internal_link_plan,
    meta_description,
    search_intent,
    target_index_status,
    title_candidate,
    variant_trap_count,
)
from workers.python.writers.article_outline_value_utils import dict_list, dict_value, list_value, string_value


def build_outline_for_pack(pack: dict[str, Any], locale: str, article_type: str) -> dict[str, Any]:
    product = dict_value(pack.get("product"))
    product_title = string_value(product.get("title")) or string_value(pack.get("product_id")) or "import product"
    category = string_value(product.get("category")) or "import-products"
    seller_claims = dict_list(pack.get("seller_claims"))
    verified_claims = dict_list(pack.get("verified_claims"))
    variants = dict_list(pack.get("variants"))
    price_truth = dict_list(pack.get("price_truth"))
    market_risks = dict_list(pack.get("market_risks"))
    review_signals = dict_list(pack.get("review_signals"))
    evidence_refs = evidence_refs_for_pack(seller_claims, verified_claims, variants, price_truth, market_risks, review_signals)

    return {
        "product_id": string_value(pack.get("product_id")),
        "category": category,
        "slug_hint": slugify(f"{product_title} {article_type}"),
        "search_intent": search_intent(article_type, locale, product_title),
        "title_candidate": title_candidate(article_type, locale, product_title),
        "h1_candidate": h1_candidate(article_type, locale, product_title),
        "meta_description_candidate": meta_description(article_type, locale, product_title),
        "target_index_status": target_index_status(seller_claims, verified_claims, variants, market_risks),
        "evidence_summary": {
            "seller_claim_count": len(seller_claims),
            "verified_claim_count": len(verified_claims),
            "variant_trap_count": variant_trap_count(variants),
            "review_signal_count": len(review_signals),
            "market_risk_count": len(market_risks),
            "price_zone": string_value(price_truth[0].get("current_zone")) if price_truth else "unknown",
        },
        "sections": sections_for_article(article_type, locale, evidence_refs),
        "internal_link_plan": internal_link_plan(article_type, category),
        "quality_gate_inputs": {
            "affiliate_disclosure_required": article_type == "review",
            "min_internal_links": 5,
            "locale_risk_required": locale != "en" or article_type in {"review", "risk", "guide"},
            "forbidden_claims": list_value(pack.get("forbidden_claims")),
        },
    }
