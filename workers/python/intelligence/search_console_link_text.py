from __future__ import annotations


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
