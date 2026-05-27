from __future__ import annotations

from collections.abc import Callable
from typing import Any


def score_translation_payload(payload: dict[str, list[dict[str, Any]]], now_factory: Callable[[], str]) -> list[dict[str, Any]]:
    results = []
    for group in payload["groups"]:
        for variant in group["variants"]:
            score = localization_depth_score(variant)
            index_status = index_status_for_localization(score, bool(variant.get("translationOnly")))
            variant["localizationDepthScore"] = score
            variant["indexStatus"] = index_status
            variant["status"] = localization_status_for_score(score)
            results.append(
                {
                    "groupId": group["id"],
                    "articleId": variant["articleId"],
                    "locale": variant["locale"],
                    "localizationDepthScore": score,
                    "indexStatus": index_status,
                    "translationOnly": bool(variant.get("translationOnly")),
                }
            )
        group["updatedAt"] = now_factory()
    return results


def localization_depth_score(variant: dict[str, Any]) -> float:
    if variant.get("sourceLocale") is None:
        return 100

    # Translation-only drafts intentionally score below the index threshold until local notes and offers are added.
    if variant.get("translationOnly"):
        return 45

    scores = {
        "localizedQueryFit": number(variant.get("localizedQueryFit"), 75),
        "localRiskCoverage": number(variant.get("localRiskCoverage"), 70),
        "localOfferFit": number(variant.get("localOfferFit"), 70),
        "languageQuality": number(variant.get("languageQuality"), 80),
        "nonBoilerplateScore": number(variant.get("nonBoilerplateScore"), 70),
        "localExamples": number(variant.get("localExamples"), 65),
    }
    return round(
        scores["localizedQueryFit"] * 0.25
        + scores["localRiskCoverage"] * 0.20
        + scores["localOfferFit"] * 0.20
        + scores["languageQuality"] * 0.15
        + scores["nonBoilerplateScore"] * 0.10
        + scores["localExamples"] * 0.10,
        2,
    )


def index_status_for_localization(score: float, translation_only: bool) -> str:
    if score >= 80 and not translation_only:
        return "index"
    if score >= 70:
        return "pending"
    return "noindex"


def localization_status_for_score(score: float) -> str:
    return "approved" if score >= 80 else "localized" if score >= 70 else "draft"


def number(value: Any, fallback: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback
