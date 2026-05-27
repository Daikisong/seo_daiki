from __future__ import annotations

from workers.python.intelligence.search_console_recommendation_intent_rules import (
    _intent_for_query,
    _recommended_details,
)
from workers.python.intelligence.search_console_text_rules import _terms


def _missing_section(
    query: str,
    missing_terms: list[str],
    section_match: dict[str, object],
) -> dict[str, object]:
    lowered = query.lower()
    if "not" in lowered and any(term.endswith("w") for term in _terms(query)):
        heading = "Why this charger may not deliver the advertised wattage"
    elif "fake" in lowered or "watt" in lowered:
        heading = "How to spot fake wattage claims before buying"
    elif "cable" in lowered:
        heading = "How to confirm the cable and selected variant"
    elif "laptop" in lowered or "charging" in lowered:
        heading = "Laptop charging checks by selected SKU"
    elif missing_terms:
        heading = "How to check " + " ".join(missing_terms[:5])
    else:
        heading = "Direct answer for this search query"

    why = (
        "The query contains terms that are not covered by the estimated page sections: "
        + ", ".join(missing_terms)
        + "."
        if missing_terms
        else "The page appears related, but it should answer the exact wording near the top."
    )
    intent = _intent_for_query(_terms(query))
    details = _recommended_details(intent, section_match)
    return {
        "heading": heading,
        "why": why,
        "intent": intent,
        "recommended_details": details,
    }
