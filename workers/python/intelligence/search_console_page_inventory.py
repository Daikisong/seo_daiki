from __future__ import annotations


def _locale_from_page(page: str) -> str:
    parts = [part for part in page.split("/") if part]
    return parts[0] if parts else "en"


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
