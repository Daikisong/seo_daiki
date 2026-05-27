from __future__ import annotations

from workers.python.intelligence.search_console_localization_candidates import localization_improvement_candidates
from workers.python.intelligence.search_console_offer_candidates import offer_replacement_candidates
from workers.python.intelligence.search_console_rules import (
    _health_claim_risk,
    _internal_link_candidates,
    _locale_from_page,
    _match_query_to_page_sections,
    _meta_candidate,
    _missing_section,
    _needs_comparison_table,
    _priority,
    _terms,
    _title_candidate,
)


def suggest_for_row(row: dict[str, object], inventory: list[dict[str, object]]) -> dict[str, object]:
    page = str(row.get("page") or "")
    query = str(row.get("query") or "")
    query_terms = _terms(query)
    section_match = _match_query_to_page_sections(page, query_terms, inventory)
    missing_terms = section_match["missing_terms"]
    locale = _locale_from_page(page)
    link_candidates = _internal_link_candidates(page, locale, query_terms, inventory)
    missing_section = _missing_section(query, missing_terms, section_match)
    title_candidate = _title_candidate(page, query)
    meta_candidate = _meta_candidate(query, link_candidates)
    offer_candidates = offer_replacement_candidates(query_terms)
    localization_candidates = localization_improvement_candidates(page, locale)
    health_risk = _health_claim_risk(page, query_terms, section_match)
    priority = _priority(row, missing_terms, link_candidates, section_match)

    actions = [
        f'Add a section titled "{missing_section["heading"]}" that answers "{query}" directly.',
        f'Rewrite the title candidate to: "{title_candidate}".',
        f'Rewrite the meta description candidate to: "{meta_candidate}".',
    ]
    if link_candidates:
        actions.append(
            "Add internal links from: "
            + ", ".join(f"{candidate['path']} as \"{candidate['anchor']}\"" for candidate in link_candidates[:3])
            + "."
        )
    if _needs_comparison_table(query_terms):
        actions.append("Add a comparison table with flagged products because the query implies a buyer decision.")
    if offer_candidates:
        actions.append("Review offer replacements: " + ", ".join(candidate["anchorText"] for candidate in offer_candidates[:3]) + ".")
    if localization_candidates:
        actions.append("Improve localized variants: " + ", ".join(candidate["locale"] for candidate in localization_candidates[:3]) + ".")
    if health_risk["riskLevel"] != "none":
        actions.append("Run HealthClaimGuard review before applying health or supplement edits.")

    return {
        "page": page,
        "query": query,
        "country": row.get("country"),
        "device": row.get("device"),
        "reason": "high_impressions_low_ctr_mid_position",
        "priority": priority,
        "diagnostics": {
            "impressions": row.get("impressions", 0),
            "ctr": row.get("ctr", 0),
            "position": row.get("position", 0),
            "query_terms": query_terms,
            "matched_query_terms": section_match["matched_terms"],
            "missing_query_terms_in_existing_sections": missing_terms,
            "section_match_score": section_match["score"],
            "estimated_existing_sections": section_match["estimated_sections"],
        },
        "missing_sections": [missing_section],
        "title_candidate": title_candidate,
        "meta_description_candidate": meta_candidate,
        "internal_link_candidates": link_candidates[:5],
        "offer_replacement_candidates": offer_candidates,
        "localization_improvement_candidates": localization_candidates,
        "health_claim_risk": health_risk,
        "action": actions,
    }
