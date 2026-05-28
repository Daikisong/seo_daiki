from __future__ import annotations

from pathlib import Path

from workers.python.common import read_json, write_json
from workers.python.intelligence.offer_matching_inventory import load_offer_inventory, offer_inventory_from_rows
from workers.python.intelligence.offer_matching_paths import (
    CONTENT_BRIEFS_PATH,
    DEFAULT_OFFERS_PATH,
    OFFER_MATCHES_PATH,
    PLACEMENT_CANDIDATES_PATH,
    TOPIC_SCORES_PATH,
)
from workers.python.intelligence.offer_matching_records import (
    brief_matches_article_filter,
    briefs_for_topic,
    match_record,
    offer_match_payload,
    placement_candidate_record,
    placement_limit_for_brief,
    scored_eligible_offers,
    topic_matches_filter,
)


def match_affiliate_offers(topic_id: str | None = None, article_id: str | None = None, offers_file: Path | None = None) -> str:
    topics = read_json(TOPIC_SCORES_PATH, {"topics": []}).get("topics", [])
    briefs = read_json(CONTENT_BRIEFS_PATH, {"briefs": []}).get("briefs", [])
    offers = load_offer_inventory(offers_file or DEFAULT_OFFERS_PATH)
    payload = offer_match_payload(topics, briefs, offers, topic_id, article_id)
    write_json(OFFER_MATCHES_PATH, {"matches": payload["matches"]})
    return str(write_json(PLACEMENT_CANDIDATES_PATH, {"placementCandidates": payload["placementCandidates"]}))
