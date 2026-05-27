from __future__ import annotations

from collections import defaultdict
from typing import Any

from workers.python.intelligence.trend_topic_rules import publishing_blockers


def publishing_gate_records(briefs: list[dict[str, Any]], matches: list[dict[str, Any]]) -> list[dict[str, Any]]:
    matches_by_topic: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for match in matches:
        matches_by_topic[str(match.get("topicId"))].append(match)

    results = []
    for brief in briefs:
        blockers = publishing_blockers(brief, matches_by_topic.get(str(brief.get("topicId")), []))
        results.append(
            {
                "briefId": brief["id"],
                "topicId": brief["topicId"],
                "locale": brief["locale"],
                "articleType": brief["articleType"],
                "status": "blocked" if blockers else "ready_for_human_review",
                "blockers": blockers,
            }
        )
    return results
