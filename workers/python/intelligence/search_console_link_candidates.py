from __future__ import annotations

from workers.python.intelligence.search_console_link_scoring import _link_score, _link_score_breakdown
from workers.python.intelligence.search_console_link_text import _anchor_text, _link_reason


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
