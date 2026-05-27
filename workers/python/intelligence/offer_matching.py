from __future__ import annotations

from pathlib import Path
from typing import Any

from workers.python.common import DATA, read_csv, read_json, slugify, write_json
from workers.python.intelligence.offer_matching_rules import (
    PLACEMENT_LIMITS,
    offer_from_row,
    offer_is_eligible,
    placement_type_for,
    score_offer,
    synthetic_brief_for_topic,
)

TOPIC_SCORES_PATH = DATA / "snapshots" / "topic_scores.json"
CONTENT_BRIEFS_PATH = DATA / "briefs" / "content_briefs.json"
OFFER_MATCHES_PATH = DATA / "snapshots" / "affiliate_offer_matches.json"
PLACEMENT_CANDIDATES_PATH = DATA / "exports" / "affiliate_placement_candidates.json"

def match_affiliate_offers(topic_id: str | None = None, article_id: str | None = None, offers_file: Path | None = None) -> str:
    topics = read_json(TOPIC_SCORES_PATH, {"topics": []}).get("topics", [])
    briefs = read_json(CONTENT_BRIEFS_PATH, {"briefs": []}).get("briefs", [])
    offers = load_offer_inventory(offers_file or DATA / "seeds" / "offers.csv")
    matches: list[dict[str, Any]] = []
    placement_candidates: list[dict[str, Any]] = []

    for topic in topics:
        if topic_id and topic["id"] != topic_id:
            continue

        topic_briefs = [brief for brief in briefs if brief.get("topicId") == topic["id"]]
        if not topic_briefs:
            topic_briefs = [synthetic_brief_for_topic(topic)]

        for brief in topic_briefs:
            if article_id and article_id not in {brief.get("articleId"), brief.get("id"), brief.get("topicId")}:
                continue

            scored = sorted(
                (
                    score_offer(topic, brief, offer)
                    for offer in offers
                    if offer_is_eligible(topic, brief, offer)
                ),
                key=lambda row: row["offerScore"],
                reverse=True,
            )
            limit = PLACEMENT_LIMITS.get(str(brief.get("articleType")), 2)

            for rank, row in enumerate(scored[:limit], start=1):
                offer = row["offer"]
                brief_id = str(brief["id"])
                offer_id = str(offer["id"])
                candidate_article_id = article_id or f"draft-article-{slugify(brief_id)}"
                candidate_id = f"placement-candidate-{slugify(f'{brief_id} {offer_id} {rank}')}"
                match = {
                    "topicId": topic["id"],
                    "topicSlug": topic["slug"],
                    "briefId": brief_id,
                    "merchantSlug": offer["merchantSlug"],
                    "offerId": offer_id,
                    "matchScore": row["offerScore"],
                    "scoreBreakdown": row["scoreBreakdown"],
                    "status": "candidate",
                    "reason": row["reason"],
                }
                matches.append(match)
                placement_candidates.append(
                    {
                        "id": candidate_id,
                        "topicId": topic["id"],
                        "briefId": brief_id,
                        "articleId": candidate_article_id,
                        "offerId": offer_id,
                        "merchantSlug": offer["merchantSlug"],
                        "placementType": placement_type_for(str(brief.get("articleType")), rank),
                        "anchorText": offer["title"],
                        "rel": "sponsored nofollow",
                        "disclosureShown": False,
                        "status": "draft",
                        "humanApprovalRequired": True,
                        "offerScore": row["offerScore"],
                        "scoreBreakdown": row["scoreBreakdown"],
                        "reason": row["reason"],
                    }
                )

    matches.sort(key=lambda item: item["matchScore"], reverse=True)
    placement_candidates.sort(key=lambda item: item["offerScore"], reverse=True)
    write_json(OFFER_MATCHES_PATH, {"matches": matches})
    return str(write_json(PLACEMENT_CANDIDATES_PATH, {"placementCandidates": placement_candidates}))


def load_offer_inventory(path: Path) -> list[dict[str, Any]]:
    rows = read_csv(path)
    return [offer_from_row(row) for row in rows]
