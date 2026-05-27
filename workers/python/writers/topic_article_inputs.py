from __future__ import annotations

from typing import Any

from workers.python.common import DATA, read_json

CONTENT_BRIEFS_PATH = DATA / "briefs" / "content_briefs.json"
PLACEMENT_CANDIDATES_PATH = DATA / "exports" / "affiliate_placement_candidates.json"
TOPIC_ARTICLES_PATH = DATA / "exports" / "topic_articles.json"


def load_content_briefs() -> list[dict[str, Any]]:
    briefs = read_json(CONTENT_BRIEFS_PATH, {"briefs": []}).get("briefs", [])
    return [brief for brief in briefs if isinstance(brief, dict)]


def load_placement_candidates() -> list[dict[str, Any]]:
    placement_payload = read_json(PLACEMENT_CANDIDATES_PATH, {"placementCandidates": []})
    placements = placement_payload.get("placementCandidates", [])
    return [placement for placement in placements if isinstance(placement, dict)]


def filter_briefs(
    briefs: list[dict[str, Any]],
    topic_id: str | None = None,
    brief_id: str | None = None,
    locale: str | None = None,
) -> list[dict[str, Any]]:
    return [
        brief
        for brief in briefs
        if not topic_id or brief.get("topicId") == topic_id
        if not brief_id or brief.get("id") == brief_id
        if not locale or brief.get("locale") == locale
    ]


def placements_for_brief(placements: list[dict[str, Any]], brief: dict[str, Any]) -> list[dict[str, Any]]:
    return [placement for placement in placements if placement.get("briefId") == brief.get("id")]
