from __future__ import annotations

from workers.python.intelligence.search_console_text_rules import _terms

MIN_IMPRESSIONS = 100
LOW_CTR_THRESHOLD = 0.02
MIN_REFRESH_POSITION = 8
MAX_REFRESH_POSITION = 30

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


def _is_refresh_candidate(row: dict[str, object]) -> bool:
    impressions = float(row.get("impressions") or 0)
    ctr = float(row.get("ctr") or 0)
    position = float(row.get("position") or 0)
    return (
        impressions >= MIN_IMPRESSIONS
        and ctr < LOW_CTR_THRESHOLD
        and MIN_REFRESH_POSITION <= position <= MAX_REFRESH_POSITION
    )


def _locale_from_page(page: str) -> str:
    parts = [part for part in page.split("/") if part]
    return parts[0] if parts else "en"


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


def _inventory_row_for_page(page: str, inventory: list[dict[str, object]]) -> dict[str, object]:
    normalized_page = page.rstrip("/") + "/"
    for row in inventory:
        if str(row.get("path") or "").rstrip("/") + "/" == normalized_page:
            return row
    return {}


def _article_type_from_path(page: str) -> str:
    parts = [part for part in page.split("/") if part]
    for article_type in [
        "data",
        "lab",
        "guides",
        "guias",
        "compare",
        "reviews",
        "resenas",
        "analises",
        "trends",
        "tendencias",
        "buyer-guides",
        "guias-de-compra",
        "deals",
        "ofertas",
        "ingredients",
        "ingredientes",
    ]:
        if article_type in parts:
            return {
                "guides": "guide",
                "guias": "guide",
                "reviews": "review",
                "resenas": "review",
                "analises": "review",
                "trends": "trend",
                "tendencias": "trend",
                "buyer-guides": "buyer_guide",
                "guias-de-compra": "buyer_guide",
                "deals": "deal_watch",
                "ofertas": "deal_watch",
                "ingredients": "ingredient_guide",
                "ingredientes": "ingredient_guide",
            }.get(article_type, article_type)
    return "hub"
