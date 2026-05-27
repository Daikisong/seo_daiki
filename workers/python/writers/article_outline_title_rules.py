from __future__ import annotations

from workers.python.writers.localizer import localize_label


def title_candidate(article_type: str, locale: str, product_title: str) -> str:
    labels = {
        "review": "Test",
        "guide": "Buying Guide",
        "compare": "Comparison",
        "data": "Evidence Table",
        "lab": "Lab Notes",
        "risk": "Import Risk",
        "hub": "Verification Hub",
    }
    return f"{product_title} {labels.get(article_type, article_type.title())}"


def h1_candidate(article_type: str, locale: str, product_title: str) -> str:
    verdict = localize_label(locale, "verdict")
    if article_type == "review":
        return f"{product_title}: {verdict}"
    return title_candidate(article_type, locale, product_title)


def meta_description(article_type: str, locale: str, product_title: str) -> str:
    if article_type == "risk":
        return f"Local import risks for {product_title}: plug, customs, certification, returns, price, and safer alternatives."
    return f"Evidence-backed {article_type} for {product_title}: seller claims, verified facts, variant traps, price, and buyer risk."
