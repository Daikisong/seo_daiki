from __future__ import annotations

from workers.python.common import DATA, read_json
from workers.python.intelligence.search_console_rules import HEALTH_TERMS, _terms

AFFILIATE_PLACEMENT_CANDIDATES_PATH = DATA / "exports" / "affiliate_placement_candidates.json"


def offer_replacement_candidates(
    query_terms: list[str],
    placement_candidates: list[dict[str, object]] | None = None,
) -> list[dict[str, object]]:
    candidates = placement_candidates if placement_candidates is not None else _placement_candidates()
    scored = []
    query_term_set = set(query_terms)
    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue
        terms = set(_terms(" ".join([str(candidate.get("anchorText", "")), str(candidate.get("merchantSlug", "")), str(candidate.get("offerId", ""))])))
        overlap = len(query_term_set.intersection(terms))
        merchant = str(candidate.get("merchantSlug") or "")
        base_score = float(candidate.get("offerScore") or 0)
        if overlap == 0 and not (merchant == "iherb" and query_term_set.intersection(HEALTH_TERMS)):
            continue
        scored.append(
            {
                "placementCandidateId": candidate.get("id"),
                "offerId": candidate.get("offerId"),
                "merchantSlug": merchant,
                "anchorText": candidate.get("anchorText"),
                "offerScore": base_score,
                "status": candidate.get("status"),
                "reason": candidate.get("reason"),
                "refreshScore": round(base_score + overlap * 5, 2),
            }
        )
    return sorted(scored, key=lambda row: row["refreshScore"], reverse=True)[:5]


def _placement_candidates() -> list[dict[str, object]]:
    payload = read_json(AFFILIATE_PLACEMENT_CANDIDATES_PATH, {"placementCandidates": []})
    return payload.get("placementCandidates", [])
