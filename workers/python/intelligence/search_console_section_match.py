from __future__ import annotations

from workers.python.intelligence.search_console_page_inventory import _article_type_from_path, _inventory_row_for_page
from workers.python.intelligence.search_console_text_rules import _terms

TYPE_BASE_TERMS = {
    "hub": {"category", "compare", "best", "risk", "evidence", "guide", "review"},
    "data": {"data", "table", "price", "claim", "verified", "evidence"},
    "lab": {"lab", "test", "measurement", "output", "temperature", "verified"},
    "guide": {"problem", "symptom", "seller", "claim", "variant", "evidence", "fix", "alternative"},
    "compare": {"compare", "alternative", "price", "risk", "evidence", "variant"},
    "review": {"review", "seller", "claim", "verified", "variant", "price", "risk", "alternative"},
    "trend": {"trend", "rising", "why", "source", "signal", "freshness", "buyer", "problem"},
    "buyer_guide": {"decision", "buy", "avoid", "compare", "evidence", "risk", "offer", "alternative"},
    "deal_watch": {"deal", "price", "history", "checked", "buy", "wait", "avoid", "offer"},
    "ingredient_guide": {"ingredient", "supported", "unsupported", "safety", "warning", "disclaimer", "iherb"},
}


def _match_query_to_page_sections(
    page: str,
    query_terms: list[str],
    inventory: list[dict[str, object]],
) -> dict[str, object]:
    inventory_row = _inventory_row_for_page(page, inventory)
    article_type = str(inventory_row.get("type") or _article_type_from_path(page))
    estimated_sections = sorted(TYPE_BASE_TERMS.get(article_type, set()))
    section_terms = set(estimated_sections)
    section_terms.update(_terms(page))
    section_terms.update(_terms(str(inventory_row.get("cluster") or "")))

    matched_terms = [term for term in query_terms if term in section_terms]
    missing_terms = [term for term in query_terms if term not in section_terms]
    score = round(len(matched_terms) / max(len(query_terms), 1), 2)
    return {
        "article_type": article_type,
        "estimated_sections": estimated_sections,
        "matched_terms": matched_terms,
        "missing_terms": missing_terms,
        "score": score,
    }
