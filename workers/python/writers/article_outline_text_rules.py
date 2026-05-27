from __future__ import annotations

from typing import Any

from workers.python.writers.article_outline_value_utils import list_value
from workers.python.writers.localizer import localize_label


def search_intent(article_type: str, locale: str, product_title: str) -> str:
    intents = {
        "review": f"Decide whether {product_title} is worth buying after checking claims, variants, price, and local risk.",
        "guide": f"Solve a buyer problem around {product_title} without inventing unsupported specs.",
        "compare": f"Compare {product_title} against alternatives using evidence, price, and risk.",
        "data": f"Expose the structured evidence table behind {product_title} pages.",
        "lab": f"Show how measured evidence for {product_title} was collected.",
        "risk": f"Explain country-specific import risk for {product_title}.",
        "hub": f"Organize the {product_title} category into evidence-backed paths.",
    }
    if locale == "es":
        return intents.get(article_type, intents["review"]).replace("Decide whether", "Decidir si")
    if locale == "pt-br":
        return intents.get(article_type, intents["review"]).replace("Decide whether", "Decidir se")
    return intents.get(article_type, intents["review"])


def title_candidate(article_type: str, locale: str, product_title: str) -> str:
    labels = {
        "review": "Test",
        "guide": "Buying Guide",
        "compare": "Comparison",
        "data": "Evidence Table",
        "lab": "Lab Notes",
        "risk": "Import Risk",
        "hub": "Verification Hub",
    }
    return f"{product_title} {labels.get(article_type, article_type.title())}"


def h1_candidate(article_type: str, locale: str, product_title: str) -> str:
    verdict = localize_label(locale, "verdict")
    if article_type == "review":
        return f"{product_title}: {verdict}"
    return title_candidate(article_type, locale, product_title)


def meta_description(article_type: str, locale: str, product_title: str) -> str:
    if article_type == "risk":
        return f"Local import risks for {product_title}: plug, customs, certification, returns, price, and safer alternatives."
    return f"Evidence-backed {article_type} for {product_title}: seller claims, verified facts, variant traps, price, and buyer risk."


def target_index_status(
    seller_claims: list[dict[str, Any]],
    verified_claims: list[dict[str, Any]],
    variants: list[dict[str, Any]],
    market_risks: list[dict[str, Any]],
) -> str:
    if seller_claims and verified_claims and variants and market_risks:
        return "index_ready"
    return "pending_more_evidence"


def internal_link_plan(article_type: str, category: str) -> list[dict[str, str]]:
    base_plan = [
        {
            "target_type": "hub",
            "anchor_hint": f"{category} hub",
            "reason": "category_hub",
            "score_signal": "same_locale_score + same_category_score",
        },
        {
            "target_type": "data_or_lab",
            "anchor_hint": "measurement table or lab note",
            "reason": "data",
            "score_signal": "same_claim_score",
        },
        {
            "target_type": "risk",
            "anchor_hint": "country import risk",
            "reason": "risk",
            "score_signal": "risk_overlap_score",
        },
        {
            "target_type": "compare",
            "anchor_hint": "similar price-band alternative",
            "reason": "compare",
            "score_signal": "alternative_price_band_score",
        },
        {
            "target_type": "guide",
            "anchor_hint": "buyer problem guide",
            "reason": "guide",
            "score_signal": "same_problem_score",
        },
    ]
    if article_type == "hub":
        return [item for item in base_plan if item["target_type"] != "hub"]
    return base_plan


def variant_trap_count(variants: list[dict[str, Any]]) -> int:
    return len([variant for variant in variants if list_value(variant.get("risk_flags"))])
