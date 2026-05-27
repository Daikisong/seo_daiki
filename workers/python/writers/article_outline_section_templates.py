from __future__ import annotations

from typing import Any


SECTION_TEMPLATES: dict[str, list[tuple[str, str, list[str]]]] = {
    "review": [
        ("Affiliate disclosure and verdict", "Set the buying decision before any outbound affiliate click.", ["seller_claims", "verified_claims", "price_truth"]),
        ("Seller claims vs verified facts", "Separate listing text from measured or confirmed evidence.", ["seller_claims", "verified_claims"]),
        ("Variant trap map", "Show which selected SKU changes the buyer outcome.", ["variants"]),
        ("Price truth and local risk", "Explain the shipped price and country risk together.", ["price_truth", "market_risks"]),
        ("Review signals and alternatives", "Use aggregate signals and internal links, not copied review text.", ["review_signals"]),
        ("Evidence and update log", "List the records that justify the article.", ["seller_claims", "verified_claims", "market_risks"]),
    ],
    "risk": [
        ("Local buyer risk summary", "Answer what changes for this country or locale.", ["market_risks", "price_truth"]),
        ("Plug, customs, certification, and returns", "Break risk into concrete buyer checks.", ["market_risks"]),
        ("SKU traps that affect this market", "Tie local risk back to variant selection.", ["variants", "seller_claims"]),
        ("When to choose a local alternative", "Show when warranty, tax, or return friction beats import price.", ["price_truth", "market_risks"]),
        ("Evidence and update log", "List the records that justify the risk page.", ["verified_claims", "market_risks"]),
    ],
    "guide": [
        ("Fast answer", "Solve the search problem directly.", ["seller_claims", "verified_claims"]),
        ("Most common causes", "Map the problem to variant, cable, plug, price, or risk evidence.", ["variants", "review_signals"]),
        ("How to check before buying", "Give a repeatable checklist grounded in evidence.", ["seller_claims", "verified_claims", "price_truth"]),
        ("Flagged products", "Point to reviews and alternatives through internal links.", ["variants", "market_risks"]),
        ("Evidence", "Show the source records behind the advice.", ["seller_claims", "verified_claims"]),
    ],
    "compare": [
        ("Comparison verdict", "Explain which option wins for which buyer.", ["verified_claims", "price_truth"]),
        ("Claims and measured facts", "Compare seller claims against verified records.", ["seller_claims", "verified_claims"]),
        ("Price and risk tradeoff", "Compare final price bands and local risk.", ["price_truth", "market_risks"]),
        ("Who should avoid each option", "Turn evidence gaps into buyer guidance.", ["variants", "review_signals"]),
        ("Evidence", "List the records behind the comparison.", ["seller_claims", "verified_claims", "market_risks"]),
    ],
    "data": [
        ("Dataset scope", "Explain what the table contains and what it does not prove.", ["seller_claims", "verified_claims"]),
        ("Evidence columns", "Define claim, measurement, price, variant, and risk fields.", ["seller_claims", "verified_claims", "price_truth"]),
        ("Known gaps", "Keep unsupported claims out of indexed pages.", ["market_risks"]),
        ("Download and update log", "Make the evidence reusable.", ["verified_claims"]),
    ],
    "lab": [
        ("Test method", "Explain how the measurement was captured.", ["verified_claims"]),
        ("Result", "Show the observed value without overstating certification.", ["verified_claims"]),
        ("Variant caveats", "Tie the result to the exact SKU.", ["variants", "seller_claims"]),
        ("Reusable evidence", "Show which pages may cite this lab record.", ["verified_claims"]),
    ],
    "hub": [
        ("What this category verifies", "Define the evidence standard for the category.", ["seller_claims", "verified_claims"]),
        ("Top products under watch", "Lead users into reviews and comparisons.", ["seller_claims", "price_truth"]),
        ("Country and variant risks", "Link category decisions to locale risk.", ["variants", "market_risks"]),
        ("Data, lab, and guides", "Route users to the strongest supporting pages.", ["verified_claims"]),
    ],
}


def sections_for_article(article_type: str, locale: str, evidence_refs: dict[str, list[str]]) -> list[dict[str, Any]]:
    selected = SECTION_TEMPLATES.get(article_type, SECTION_TEMPLATES["review"])
    return [
        {
            "heading": heading,
            "why": why,
            "evidence_refs": [ref for key in keys for ref in evidence_refs.get(key, [])[:3]],
        }
        for heading, why, keys in selected
    ]
