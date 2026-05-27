from __future__ import annotations

from workers.python.intelligence.search_console_page_rules import _article_type_from_path
from workers.python.intelligence.search_console_text_rules import HEALTH_TERMS


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
