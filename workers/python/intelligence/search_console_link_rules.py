from __future__ import annotations

from workers.python.intelligence.search_console_text_rules import (
    CLAIM_TERMS,
    PRICE_TERMS,
    PROBLEM_TERMS,
    RISK_TERMS,
    _expanded_terms,
    _terms,
)


def _internal_link_candidates(
    page: str,
    locale: str,
    query_terms: list[str],
    inventory: list[dict[str, object]],
) -> list[dict[str, object]]:
    rows = [
        row
        for row in inventory
        if row.get("locale") == locale
        and row.get("status") == "index_candidate"
        and row.get("path") != page
    ]
    scored = sorted(
        rows,
        key=lambda row: _link_score(row, query_terms),
        reverse=True,
    )
    diversified = _diversify_link_types(scored)
    return [
        {
            "path": str(row["path"]),
            "href": str(row["path"]),
            "type": str(row["type"]),
            "anchor": _anchor_text(row, query_terms),
            "reason": _link_reason(str(row["type"]), _link_score_breakdown(row, query_terms)),
            "score": _link_score(row, query_terms),
            "score_breakdown": _link_score_breakdown(row, query_terms),
        }
        for row in diversified
        if _link_score(row, query_terms) > 0
    ]


def _diversify_link_types(rows: list[dict[str, object]]) -> list[dict[str, object]]:
    selected: list[dict[str, object]] = []
    seen_types: set[str] = set()
    for row in rows:
        article_type = str(row.get("type") or "")
        if article_type in seen_types:
            continue
        selected.append(row)
        seen_types.add(article_type)
    for row in rows:
        if row not in selected:
            selected.append(row)
    return selected


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


def _link_reason(article_type: str, breakdown: dict[str, int]) -> str:
    base = {
        "hub": "category hub reinforcement",
        "data": "original data support",
        "lab": "test method support",
        "compare": "comparison intent support",
        "guide": "problem intent support",
        "review": "product evidence support",
    }.get(article_type, "related support")
    strongest = max(breakdown, key=lambda key: breakdown[key])
    return f"{base}; strongest signal: {strongest}"


def _anchor_text(row: dict[str, object], query_terms: list[str]) -> str:
    article_type = str(row.get("type") or "page")
    cluster = str(row.get("cluster") or "USB-C charger evidence")
    if article_type == "hub":
        return f"{cluster} buying hub"
    if article_type == "lab":
        return "lab test evidence"
    if article_type == "data":
        return "verified data table"
    if article_type == "compare":
        return "comparison alternatives"
    if query_terms:
        return " ".join(query_terms[:4]) + " evidence"
    return "related product evidence"
