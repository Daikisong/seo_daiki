from __future__ import annotations

from typing import Any

from workers.python.common import slugify
from workers.python.intelligence.offer_matching_constants import PLACEMENT_LIMITS
from workers.python.intelligence.offer_matching_normalization import synthetic_brief_for_topic
from workers.python.intelligence.offer_matching_policy import offer_is_eligible, placement_type_for
from workers.python.intelligence.offer_matching_scoring import score_offer


def topic_matches_filter(topic: dict[str, Any], topic_id: str | None) -> bool:
    return not topic_id or topic["id"] == topic_id


def brief_matches_article_filter(brief: dict[str, Any], article_id: str | None) -> bool:
    return not article_id or article_id in {brief.get("articleId"), brief.get("id"), brief.get("topicId")}


def briefs_for_topic(topic: dict[str, Any], briefs: list[Any]) -> list[dict[str, Any]]:
    topic_briefs = [brief for brief in briefs if isinstance(brief, dict) and brief.get("topicId") == topic["id"]]
    return topic_briefs or [synthetic_brief_for_topic(topic)]


def scored_eligible_offers(topic: dict[str, Any], brief: dict[str, Any], offers: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(
        (
            score_offer(topic, brief, offer)
            for offer in offers
            if offer_is_eligible(topic, brief, offer)
        ),
        key=lambda row: row["offerScore"],
        reverse=True,
    )


def placement_limit_for_brief(brief: dict[str, Any]) -> int:
    return PLACEMENT_LIMITS.get(str(brief.get("articleType")), 2)


def match_record(topic: dict[str, Any], brief: dict[str, Any], scored_offer: dict[str, Any]) -> dict[str, Any]:
    offer = scored_offer["offer"]
    return {
        "topicId": topic["id"],
        "topicSlug": topic["slug"],
        "briefId": str(brief["id"]),
        "merchantSlug": offer["merchantSlug"],
        "offerId": str(offer["id"]),
        "matchScore": scored_offer["offerScore"],
        "scoreBreakdown": scored_offer["scoreBreakdown"],
        "status": "candidate",
        "reason": scored_offer["reason"],
    }


def placement_candidate_record(
    topic: dict[str, Any],
    brief: dict[str, Any],
    scored_offer: dict[str, Any],
    rank: int,
    article_id: str | None,
) -> dict[str, Any]:
    offer = scored_offer["offer"]
    brief_id = str(brief["id"])
    offer_id = str(offer["id"])
    candidate_article_id = article_id or f"draft-article-{slugify(brief_id)}"
    candidate_id = f"placement-candidate-{slugify(f'{brief_id} {offer_id} {rank}')}"
    return {
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
        "offerScore": scored_offer["offerScore"],
        "scoreBreakdown": scored_offer["scoreBreakdown"],
        "reason": scored_offer["reason"],
    }


def offer_match_payload(
    topics: list[Any],
    briefs: list[Any],
    offers: list[dict[str, Any]],
    topic_id: str | None = None,
    article_id: str | None = None,
) -> dict[str, list[dict[str, Any]]]:
    matches: list[dict[str, Any]] = []
    placement_candidates: list[dict[str, Any]] = []

    for topic in topics:
        if not isinstance(topic, dict) or not topic_matches_filter(topic, topic_id):
            continue
        for brief in briefs_for_topic(topic, briefs):
            if not brief_matches_article_filter(brief, article_id):
                continue
            for rank, scored_offer in enumerate(scored_eligible_offers(topic, brief, offers)[:placement_limit_for_brief(brief)], start=1):
                matches.append(match_record(topic, brief, scored_offer))
                placement_candidates.append(placement_candidate_record(topic, brief, scored_offer, rank, article_id))

    matches.sort(key=lambda item: item["matchScore"], reverse=True)
    placement_candidates.sort(key=lambda item: item["offerScore"], reverse=True)
    return {"matches": matches, "placementCandidates": placement_candidates}
