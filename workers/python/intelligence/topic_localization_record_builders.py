from __future__ import annotations

from typing import Any

from workers.python.intelligence.trend_topic_rules import localized_title


def topic_localization_records(briefs: list[dict[str, Any]], locales: list[str]) -> list[dict[str, Any]]:
    localized = []
    for brief in briefs:
        for locale in locales:
            if locale == brief.get("locale"):
                continue
            localized.append(
                {
                    "sourceBriefId": brief["id"],
                    "targetLocale": locale,
                    "status": "draft",
                    "titleCandidate": localized_title(str(brief["titleCandidate"]), locale),
                    "localizationNotes": {
                        **brief.get("localizationNotes", {}),
                        "targetLocale": locale,
                        "requiresHumanReview": True,
                    },
                }
            )
    return localized
