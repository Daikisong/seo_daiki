from __future__ import annotations

from typing import Any

from workers.python.intelligence.trend_topic_rules import affiliate_match_score, match_reason


def affiliate_offer_match_records(topics: list[dict[str, Any]]) -> list[dict[str, Any]]:
    matches = []
    for topic in topics:
        merchants = ["iherb"] if topic.get("healthSensitive") else ["aliexpress"]
        if topic["intent"] in {"comparison", "deal", "commercial"} and "aliexpress" not in merchants:
            merchants.append("aliexpress")
        for merchant in merchants:
            matches.append(
                {
                    "topicId": topic["id"],
                    "topicSlug": topic["slug"],
                    "merchantSlug": merchant,
                    "matchScore": affiliate_match_score(topic, merchant),
                    "status": "candidate",
                    "reason": match_reason(topic, merchant),
                }
            )
    return sorted(matches, key=lambda item: item["matchScore"], reverse=True)
