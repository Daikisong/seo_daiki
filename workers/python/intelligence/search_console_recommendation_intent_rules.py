from __future__ import annotations

from workers.python.intelligence.search_console_text_rules import (
    CLAIM_TERMS,
    PRICE_TERMS,
    PROBLEM_TERMS,
)


def _intent_for_query(query_terms: list[str]) -> str:
    term_set = set(query_terms)
    if term_set.intersection(PROBLEM_TERMS):
        return "problem_check"
    if term_set.intersection(CLAIM_TERMS):
        return "claim_verification"
    if term_set.intersection(PRICE_TERMS):
        return "buyer_comparison"
    return "direct_answer"


def _recommended_details(intent: str, section_match: dict[str, object]) -> list[str]:
    base = {
        "problem_check": [
            "state the likely failure mode in the first paragraph",
            "show the seller claim versus verified evidence",
            "list the exact SKU or variant trap to avoid",
        ],
        "claim_verification": [
            "quote the advertised claim",
            "show the measured or checked result",
            "explain when the claim is true and when it is not",
        ],
        "buyer_comparison": [
            "add a compact comparison table",
            "show safer alternatives by price band",
            "include local shipping or return risk",
        ],
        "direct_answer": [
            "answer the query in one sentence",
            "link to supporting evidence",
            "add the next action for the buyer",
        ],
    }[intent]
    if float(section_match.get("score") or 0) < 0.5:
        return [*base, "move this answer above lower-priority background sections"]
    return base


def _needs_comparison_table(query_terms: list[str]) -> bool:
    term_set = set(query_terms)
    return bool(term_set.intersection(PROBLEM_TERMS | PRICE_TERMS | CLAIM_TERMS))
