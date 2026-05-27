from __future__ import annotations

from workers.python.intelligence.search_console_page_rules import (
    LOW_CTR_THRESHOLD,
    _article_type_from_path,
)
from workers.python.intelligence.search_console_text_rules import (
    CLAIM_TERMS,
    HEALTH_TERMS,
    PRICE_TERMS,
    PROBLEM_TERMS,
    _terms,
)


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


def _title_candidate(page: str, query: str) -> str:
    phrase = " ".join(_title_word(word) for word in query.split())
    suffix = "Evidence, Variant Checks, Safer Picks"
    if _article_type_from_path(page) == "guide":
        suffix = "Fixes, Evidence, Safer Picks"
    return _truncate(f"{phrase}: {suffix}", 68)


def _meta_candidate(query: str, link_candidates: list[dict[str, object]]) -> str:
    link_hint = " Compare linked data, lab, and guide pages before buying." if link_candidates else ""
    return _truncate(
        f"Answer {query} with seller-claim checks, variant traps, price evidence, and local risk notes.{link_hint}",
        154,
    )


def _health_claim_risk(page: str, query_terms: list[str], section_match: dict[str, object]) -> dict[str, object]:
    article_type = str(section_match.get("article_type") or _article_type_from_path(page))
    query_term_set = set(query_terms)
    health_terms = sorted(query_term_set.intersection(HEALTH_TERMS))
    if article_type == "ingredient_guide" or health_terms:
        return {
            "riskLevel": "high" if {"dosage", "dose"}.intersection(query_term_set) else "medium",
            "terms": health_terms,
            "requiredAction": "HealthClaimGuard, disclaimer check, supported/unsupported claim separation, and manual compliance review.",
        }
    return {"riskLevel": "none", "terms": [], "requiredAction": ""}


def _priority(
    row: dict[str, object],
    missing_terms: list[str],
    link_candidates: list[dict[str, object]],
    section_match: dict[str, object],
) -> int:
    impressions = float(row.get("impressions") or 0)
    ctr = float(row.get("ctr") or 0)
    position = float(row.get("position") or 0)
    ctr_gap = max(0, LOW_CTR_THRESHOLD - ctr)
    position_boost = max(0, 31 - position)
    section_gap = 1 - float(section_match.get("score") or 0)
    return round(impressions * ctr_gap + position_boost + len(missing_terms) * 2 + len(link_candidates) + section_gap * 10)


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


def _title_word(word: str) -> str:
    if any(char.isdigit() for char in word):
        return word.upper()
    if word.lower() == "aliexpress":
        return "AliExpress"
    if word.lower() == "usb":
        return "USB"
    small_words = {"a", "an", "and", "for", "in", "of", "or", "the", "to", "vs"}
    lowered = word.lower()
    return lowered if lowered in small_words else lowered.capitalize()


def _truncate(value: str, max_length: int) -> str:
    if len(value) <= max_length:
        return value
    trimmed = value[: max_length - 3].rstrip(" ,.;:-")
    return trimmed + "..."
