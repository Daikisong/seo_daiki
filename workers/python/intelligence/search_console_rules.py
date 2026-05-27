from __future__ import annotations

MIN_IMPRESSIONS = 100
LOW_CTR_THRESHOLD = 0.02
MIN_REFRESH_POSITION = 8
MAX_REFRESH_POSITION = 30

STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "best",
    "for",
    "how",
    "is",
    "it",
    "of",
    "on",
    "or",
    "the",
    "to",
    "vs",
    "what",
    "when",
    "why",
    "with",
}

CLAIM_TERMS = {"45w", "60w", "65w", "67w", "100w", "120w", "pd", "pps", "watt", "watts", "mah", "wh"}
PROBLEM_TERMS = {"fake", "not", "trap", "variant", "plug", "cable", "charging", "laptop", "overheat", "return"}
RISK_TERMS = {"customs", "certification", "return", "plug", "shipping", "country", "risk", "warranty"}
PRICE_TERMS = {"cheap", "price", "coupon", "deal", "alternative", "budget", "premium"}
TERM_ALIASES = {
    "aliexpress": {"ali", "express"},
    "charger": {"charging", "usb", "c"},
    "charging": {"charger", "charge"},
    "watt": {"watts"},
    "watts": {"watt"},
}
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
HEALTH_TERMS = {"iherb", "supplement", "magnesium", "probiotic", "vitamin", "sleep", "gut", "dosage", "dose", "ingredient"}


def _is_refresh_candidate(row: dict[str, object]) -> bool:
    impressions = float(row.get("impressions") or 0)
    ctr = float(row.get("ctr") or 0)
    position = float(row.get("position") or 0)
    return (
        impressions >= MIN_IMPRESSIONS
        and ctr < LOW_CTR_THRESHOLD
        and MIN_REFRESH_POSITION <= position <= MAX_REFRESH_POSITION
    )


def _terms(value: str) -> list[str]:
    cleaned = "".join(char.lower() if char.isalnum() else " " for char in value)
    return [term for term in cleaned.split() if (len(term) > 2 or any(char.isdigit() for char in term)) and term not in STOPWORDS]


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


def _missing_section(
    query: str,
    missing_terms: list[str],
    section_match: dict[str, object],
) -> dict[str, object]:
    lowered = query.lower()
    if "not" in lowered and any(term.endswith("w") for term in _terms(query)):
        heading = "Why this charger may not deliver the advertised wattage"
    elif "fake" in lowered or "watt" in lowered:
        heading = "How to spot fake wattage claims before buying"
    elif "cable" in lowered:
        heading = "How to confirm the cable and selected variant"
    elif "laptop" in lowered or "charging" in lowered:
        heading = "Laptop charging checks by selected SKU"
    elif missing_terms:
        heading = "How to check " + " ".join(missing_terms[:5])
    else:
        heading = "Direct answer for this search query"

    why = (
        "The query contains terms that are not covered by the estimated page sections: "
        + ", ".join(missing_terms)
        + "."
        if missing_terms
        else "The page appears related, but it should answer the exact wording near the top."
    )
    intent = _intent_for_query(_terms(query))
    details = _recommended_details(intent, section_match)
    return {
        "heading": heading,
        "why": why,
        "intent": intent,
        "recommended_details": details,
    }


def _title_candidate(page: str, query: str) -> str:
    phrase = " ".join(_title_word(word) for word in query.split())
    suffix = "Evidence, Variant Checks, Safer Picks"
    if _article_type_from_path(page) == "guide":
        suffix = "Fixes, Evidence, Safer Picks"
    return _truncate(f"{phrase}: {suffix}", 68)


def _meta_candidate(query: str, link_candidates: list[dict[str, object]]) -> str:
    link_hint = " Compare linked data, lab, and guide pages before buying." if link_candidates else ""
    return _truncate(
        f"Answer {query} with seller-claim checks, variant traps, price evidence, and local risk notes.{link_hint}",
        154,
    )


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


def _priority(
    row: dict[str, object],
    missing_terms: list[str],
    link_candidates: list[dict[str, object]],
    section_match: dict[str, object],
) -> int:
    impressions = float(row.get("impressions") or 0)
    ctr = float(row.get("ctr") or 0)
    position = float(row.get("position") or 0)
    ctr_gap = max(0, LOW_CTR_THRESHOLD - ctr)
    position_boost = max(0, 31 - position)
    section_gap = 1 - float(section_match.get("score") or 0)
    return round(impressions * ctr_gap + position_boost + len(missing_terms) * 2 + len(link_candidates) + section_gap * 10)


def _intent_for_query(query_terms: list[str]) -> str:
    term_set = set(query_terms)
    if term_set.intersection(PROBLEM_TERMS):
        return "problem_check"
    if term_set.intersection(CLAIM_TERMS):
        return "claim_verification"
    if term_set.intersection(PRICE_TERMS):
        return "buyer_comparison"
    return "direct_answer"


def _recommended_details(intent: str, section_match: dict[str, object]) -> list[str]:
    base = {
        "problem_check": [
            "state the likely failure mode in the first paragraph",
            "show the seller claim versus verified evidence",
            "list the exact SKU or variant trap to avoid",
        ],
        "claim_verification": [
            "quote the advertised claim",
            "show the measured or checked result",
            "explain when the claim is true and when it is not",
        ],
        "buyer_comparison": [
            "add a compact comparison table",
            "show safer alternatives by price band",
            "include local shipping or return risk",
        ],
        "direct_answer": [
            "answer the query in one sentence",
            "link to supporting evidence",
            "add the next action for the buyer",
        ],
    }[intent]
    if float(section_match.get("score") or 0) < 0.5:
        return [*base, "move this answer above lower-priority background sections"]
    return base


def _needs_comparison_table(query_terms: list[str]) -> bool:
    term_set = set(query_terms)
    return bool(term_set.intersection(PROBLEM_TERMS | PRICE_TERMS | CLAIM_TERMS))


def _title_word(word: str) -> str:
    if any(char.isdigit() for char in word):
        return word.upper()
    if word.lower() == "aliexpress":
        return "AliExpress"
    if word.lower() == "usb":
        return "USB"
    small_words = {"a", "an", "and", "for", "in", "of", "or", "the", "to", "vs"}
    lowered = word.lower()
    return lowered if lowered in small_words else lowered.capitalize()


def _expanded_terms(terms: list[str]) -> set[str]:
    expanded = set(terms)
    for term in terms:
        expanded.update(TERM_ALIASES.get(term, set()))
    return expanded


def _truncate(value: str, max_length: int) -> str:
    if len(value) <= max_length:
        return value
    trimmed = value[: max_length - 3].rstrip(" ,.;:-")
    return trimmed + "..."
