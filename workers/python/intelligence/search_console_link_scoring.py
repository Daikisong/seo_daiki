from __future__ import annotations

from workers.python.intelligence.search_console_text_rules import (
    CLAIM_TERMS,
    PRICE_TERMS,
    PROBLEM_TERMS,
    RISK_TERMS,
    _expanded_terms,
    _terms,
)


def _link_score(row: dict[str, object], query_terms: list[str]) -> int:
    return sum(_link_score_breakdown(row, query_terms).values())


def _link_score_breakdown(row: dict[str, object], query_terms: list[str]) -> dict[str, int]:
    path_terms = _expanded_terms(_terms(str(row.get("path") or "")))
    cluster_terms = _expanded_terms(_terms(str(row.get("cluster") or "")))
    query_term_set = _expanded_terms(query_terms)
    raw_query_terms = set(query_terms)
    article_type = str(row.get("type") or "")
    return {
        "same_locale_score": 8,
        "same_category_score": 16
        if path_terms.intersection(query_term_set) or cluster_terms.intersection(query_term_set)
        else 0,
        "same_claim_score": 14 if path_terms.intersection(raw_query_terms.intersection(CLAIM_TERMS)) else 0,
        "same_problem_score": 14 if path_terms.intersection(raw_query_terms.intersection(PROBLEM_TERMS)) else 0,
        "alternative_price_band_score": 8
        if article_type in {"compare", "review", "data"} and raw_query_terms.intersection(PRICE_TERMS)
        else 0,
        "risk_overlap_score": 8 if article_type in {"guide", "hub", "review"} and raw_query_terms.intersection(RISK_TERMS) else 0,
        "page_type_score": {"hub": 8, "data": 7, "lab": 7, "compare": 6, "guide": 5, "review": 3}.get(article_type, 0),
    }
