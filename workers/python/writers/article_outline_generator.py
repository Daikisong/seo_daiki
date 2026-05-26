from __future__ import annotations

from typing import Any

from workers.python.common import DATA, read_json, slugify, write_json
from workers.python.writers.localizer import localize_label


def generate_outline(locale: str, article_type: str, product_id: str | None = None) -> str:
    packs = read_json(DATA / "evidence_packs" / f"{locale}.json", [])
    selected_packs = [
        pack
        for pack in packs
        if isinstance(pack, dict) and (product_id is None or str(pack.get("product_id")) == product_id)
    ]
    outlines = [build_outline_for_pack(pack, locale, article_type) for pack in selected_packs]
    suffix = f"-{slugify(product_id)}" if product_id else ""
    path = DATA / "outlines" / f"{locale}-{article_type}{suffix}.json"
    write_json(
        path,
        {
            "locale": locale,
            "article_type": article_type,
            "product_id": product_id,
            "outline_count": len(outlines),
            "outlines": outlines
        }
    )
    return str(path)


def build_outline_for_pack(pack: dict[str, Any], locale: str, article_type: str) -> dict[str, Any]:
    product = _dict(pack.get("product"))
    product_title = _string(product.get("title")) or _string(pack.get("product_id")) or "import product"
    category = _string(product.get("category")) or "import-products"
    seller_claims = _dicts(pack.get("seller_claims"))
    verified_claims = _dicts(pack.get("verified_claims"))
    variants = _dicts(pack.get("variants"))
    price_truth = _dicts(pack.get("price_truth"))
    market_risks = _dicts(pack.get("market_risks"))
    review_signals = _dicts(pack.get("review_signals"))
    evidence_refs = _evidence_refs(seller_claims, verified_claims, variants, price_truth, market_risks, review_signals)

    return {
        "product_id": _string(pack.get("product_id")),
        "category": category,
        "slug_hint": slugify(f"{product_title} {article_type}"),
        "search_intent": _search_intent(article_type, locale, product_title),
        "title_candidate": _title_candidate(article_type, locale, product_title),
        "h1_candidate": _h1_candidate(article_type, locale, product_title),
        "meta_description_candidate": _meta_description(article_type, locale, product_title),
        "target_index_status": _target_index_status(seller_claims, verified_claims, variants, market_risks),
        "evidence_summary": {
            "seller_claim_count": len(seller_claims),
            "verified_claim_count": len(verified_claims),
            "variant_trap_count": len([variant for variant in variants if _list(variant.get("risk_flags"))]),
            "review_signal_count": len(review_signals),
            "market_risk_count": len(market_risks),
            "price_zone": _string(price_truth[0].get("current_zone")) if price_truth else "unknown"
        },
        "sections": _sections(article_type, locale, evidence_refs),
        "internal_link_plan": _internal_link_plan(article_type, category),
        "quality_gate_inputs": {
            "affiliate_disclosure_required": article_type == "review",
            "min_internal_links": 5,
            "locale_risk_required": locale != "en" or article_type in {"review", "risk", "guide"},
            "forbidden_claims": _list(pack.get("forbidden_claims"))
        }
    }


def _search_intent(article_type: str, locale: str, product_title: str) -> str:
    intents = {
        "review": f"Decide whether {product_title} is worth buying after checking claims, variants, price, and local risk.",
        "guide": f"Solve a buyer problem around {product_title} without inventing unsupported specs.",
        "compare": f"Compare {product_title} against alternatives using evidence, price, and risk.",
        "data": f"Expose the structured evidence table behind {product_title} pages.",
        "lab": f"Show how measured evidence for {product_title} was collected.",
        "risk": f"Explain country-specific import risk for {product_title}.",
        "hub": f"Organize the {product_title} category into evidence-backed paths."
    }
    if locale == "es":
        return intents.get(article_type, intents["review"]).replace("Decide whether", "Decidir si")
    if locale == "pt-br":
        return intents.get(article_type, intents["review"]).replace("Decide whether", "Decidir se")
    return intents.get(article_type, intents["review"])


def _title_candidate(article_type: str, locale: str, product_title: str) -> str:
    labels = {
        "review": "Test",
        "guide": "Buying Guide",
        "compare": "Comparison",
        "data": "Evidence Table",
        "lab": "Lab Notes",
        "risk": "Import Risk",
        "hub": "Verification Hub"
    }
    return f"{product_title} {labels.get(article_type, article_type.title())}"


def _h1_candidate(article_type: str, locale: str, product_title: str) -> str:
    verdict = localize_label(locale, "verdict")
    if article_type == "review":
        return f"{product_title}: {verdict}"
    return _title_candidate(article_type, locale, product_title)


def _meta_description(article_type: str, locale: str, product_title: str) -> str:
    if article_type == "risk":
        return f"Local import risks for {product_title}: plug, customs, certification, returns, price, and safer alternatives."
    return f"Evidence-backed {article_type} for {product_title}: seller claims, verified facts, variant traps, price, and buyer risk."


def _target_index_status(
    seller_claims: list[dict[str, Any]],
    verified_claims: list[dict[str, Any]],
    variants: list[dict[str, Any]],
    market_risks: list[dict[str, Any]]
) -> str:
    if seller_claims and verified_claims and variants and market_risks:
        return "index_ready"
    return "pending_more_evidence"


def _sections(article_type: str, locale: str, evidence_refs: dict[str, list[str]]) -> list[dict[str, Any]]:
    templates = {
        "review": [
            ("Affiliate disclosure and verdict", "Set the buying decision before any outbound affiliate click.", ["seller_claims", "verified_claims", "price_truth"]),
            ("Seller claims vs verified facts", "Separate listing text from measured or confirmed evidence.", ["seller_claims", "verified_claims"]),
            ("Variant trap map", "Show which selected SKU changes the buyer outcome.", ["variants"]),
            ("Price truth and local risk", "Explain the shipped price and country risk together.", ["price_truth", "market_risks"]),
            ("Review signals and alternatives", "Use aggregate signals and internal links, not copied review text.", ["review_signals"]),
            ("Evidence and update log", "List the records that justify the article.", ["seller_claims", "verified_claims", "market_risks"])
        ],
        "risk": [
            ("Local buyer risk summary", "Answer what changes for this country or locale.", ["market_risks", "price_truth"]),
            ("Plug, customs, certification, and returns", "Break risk into concrete buyer checks.", ["market_risks"]),
            ("SKU traps that affect this market", "Tie local risk back to variant selection.", ["variants", "seller_claims"]),
            ("When to choose a local alternative", "Show when warranty, tax, or return friction beats import price.", ["price_truth", "market_risks"]),
            ("Evidence and update log", "List the records that justify the risk page.", ["verified_claims", "market_risks"])
        ],
        "guide": [
            ("Fast answer", "Solve the search problem directly.", ["seller_claims", "verified_claims"]),
            ("Most common causes", "Map the problem to variant, cable, plug, price, or risk evidence.", ["variants", "review_signals"]),
            ("How to check before buying", "Give a repeatable checklist grounded in evidence.", ["seller_claims", "verified_claims", "price_truth"]),
            ("Flagged products", "Point to reviews and alternatives through internal links.", ["variants", "market_risks"]),
            ("Evidence", "Show the source records behind the advice.", ["seller_claims", "verified_claims"])
        ],
        "compare": [
            ("Comparison verdict", "Explain which option wins for which buyer.", ["verified_claims", "price_truth"]),
            ("Claims and measured facts", "Compare seller claims against verified records.", ["seller_claims", "verified_claims"]),
            ("Price and risk tradeoff", "Compare final price bands and local risk.", ["price_truth", "market_risks"]),
            ("Who should avoid each option", "Turn evidence gaps into buyer guidance.", ["variants", "review_signals"]),
            ("Evidence", "List the records behind the comparison.", ["seller_claims", "verified_claims", "market_risks"])
        ],
        "data": [
            ("Dataset scope", "Explain what the table contains and what it does not prove.", ["seller_claims", "verified_claims"]),
            ("Evidence columns", "Define claim, measurement, price, variant, and risk fields.", ["seller_claims", "verified_claims", "price_truth"]),
            ("Known gaps", "Keep unsupported claims out of indexed pages.", ["market_risks"]),
            ("Download and update log", "Make the evidence reusable.", ["verified_claims"])
        ],
        "lab": [
            ("Test method", "Explain how the measurement was captured.", ["verified_claims"]),
            ("Result", "Show the observed value without overstating certification.", ["verified_claims"]),
            ("Variant caveats", "Tie the result to the exact SKU.", ["variants", "seller_claims"]),
            ("Reusable evidence", "Show which pages may cite this lab record.", ["verified_claims"])
        ],
        "hub": [
            ("What this category verifies", "Define the evidence standard for the category.", ["seller_claims", "verified_claims"]),
            ("Top products under watch", "Lead users into reviews and comparisons.", ["seller_claims", "price_truth"]),
            ("Country and variant risks", "Link category decisions to locale risk.", ["variants", "market_risks"]),
            ("Data, lab, and guides", "Route users to the strongest supporting pages.", ["verified_claims"])
        ]
    }
    selected = templates.get(article_type, templates["review"])
    return [
        {
            "heading": heading,
            "why": why,
            "evidence_refs": [ref for key in keys for ref in evidence_refs.get(key, [])[:3]]
        }
        for heading, why, keys in selected
    ]


def _internal_link_plan(article_type: str, category: str) -> list[dict[str, str]]:
    base_plan = [
        {
            "target_type": "hub",
            "anchor_hint": f"{category} hub",
            "reason": "category_hub",
            "score_signal": "same_locale_score + same_category_score"
        },
        {
            "target_type": "data_or_lab",
            "anchor_hint": "measurement table or lab note",
            "reason": "data",
            "score_signal": "same_claim_score"
        },
        {
            "target_type": "risk",
            "anchor_hint": "country import risk",
            "reason": "risk",
            "score_signal": "risk_overlap_score"
        },
        {
            "target_type": "compare",
            "anchor_hint": "similar price-band alternative",
            "reason": "compare",
            "score_signal": "alternative_price_band_score"
        },
        {
            "target_type": "guide",
            "anchor_hint": "buyer problem guide",
            "reason": "guide",
            "score_signal": "same_problem_score"
        }
    ]
    if article_type == "hub":
        return [item for item in base_plan if item["target_type"] != "hub"]
    return base_plan


def _evidence_refs(
    seller_claims: list[dict[str, Any]],
    verified_claims: list[dict[str, Any]],
    variants: list[dict[str, Any]],
    price_truth: list[dict[str, Any]],
    market_risks: list[dict[str, Any]],
    review_signals: list[dict[str, Any]]
) -> dict[str, list[str]]:
    return {
        "seller_claims": [
            f"seller_claim:{_string(claim.get('claim_type'))}:{_string(claim.get('claim_value'))}"
            for claim in seller_claims
        ],
        "verified_claims": [
            f"verified_claim:{_string(claim.get('test_type'))}:{_string(claim.get('result_value'))}"
            for claim in verified_claims
        ],
        "variants": [f"variant:{_string(variant.get('option'))}" for variant in variants],
        "price_truth": [f"price_truth:{_string(row.get('current_zone'))}" for row in price_truth],
        "market_risks": [
            f"market_risk:{_string(risk.get('country')) or _string(risk.get('locale'))}:{_string(risk.get('return_risk'))}"
            for risk in market_risks
        ],
        "review_signals": [
            f"review_signal:{_string(signal.get('topic'))}:{_string(signal.get('sentiment'))}"
            for signal in review_signals
        ]
    }


def _dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def _dicts(value: Any) -> list[dict[str, Any]]:
    return [item for item in _list(value) if isinstance(item, dict)]


def _list(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []


def _string(value: Any) -> str:
    return str(value).strip() if value is not None else ""
