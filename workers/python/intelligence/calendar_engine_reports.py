from __future__ import annotations

from typing import Any


def filter_calendars(calendars: list[dict[str, Any]], market: str | None = None) -> list[dict[str, Any]]:
    return [item for item in calendars if not market or item.get("market") == market]


def calendar_explanations(calendars: list[dict[str, Any]]) -> list[dict[str, Any]]:
    explanations = []
    for calendar in calendars:
        explanations.append(
            {
                "market": calendar.get("market"),
                "language": calendar.get("language"),
                "reason": "Queue is market-local. It ranks this market's own trend keywords and does not import unrelated trends from other countries.",
                "topicalBalance": calendar.get("summaryJson", {}).get("topicalBalance", {}),
            }
        )
    return explanations
