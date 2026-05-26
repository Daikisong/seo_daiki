from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from workers.python.common import DATA, read_json, slugify, write_json

TRANSLATION_GROUPS_PATH = DATA / "exports" / "translation_groups.json"
LOCALIZATION_SCORES_PATH = DATA / "exports" / "localization_scores.json"
HREFLANG_GROUPS_PATH = DATA / "exports" / "hreflang_groups.json"


def create_translation_group(article_id: str, topic_id: str | None = None, source_locale: str = "en") -> str:
    payload = read_translation_groups()
    group_id = f"tg-{slugify(article_id)}"
    groups = [group for group in payload["groups"] if group["id"] != group_id]
    groups.append(
        {
            "id": group_id,
            "canonicalTopicId": topic_id,
            "sourceArticleId": article_id,
            "createdAt": now(),
            "updatedAt": now(),
            "variants": [
                {
                    "id": f"tv-{slugify(article_id)}-{source_locale}",
                    "articleId": article_id,
                    "locale": source_locale,
                    "sourceLocale": None,
                    "localizationDepthScore": 100,
                    "status": "published",
                    "indexStatus": "index",
                }
            ],
        }
    )
    return str(write_json(TRANSLATION_GROUPS_PATH, {"groups": groups}))


def localize_article(article_id: str, locale: str, source_locale: str = "en") -> str:
    payload = read_translation_groups()
    group = find_or_create_group(payload, article_id, source_locale)
    localized_article_id = f"{article_id}-{locale}"
    group["variants"] = [
        variant for variant in group["variants"] if not (variant["articleId"] == localized_article_id or variant["locale"] == locale)
    ]
    group["variants"].append(
        {
            "id": f"tv-{slugify(localized_article_id)}",
            "articleId": localized_article_id,
            "locale": locale,
            "sourceLocale": source_locale,
            "localizationDepthScore": 0,
            "status": "draft",
            "indexStatus": "noindex",
            "translationOnly": True,
            "requiredLocalSignals": [
                "localized title/h1/meta",
                "local search intent",
                "local risk or market notes",
                "local offer availability or explicit no-offer note",
                "non-boilerplate localized examples",
            ],
        }
    )
    group["updatedAt"] = now()
    return str(write_json(TRANSLATION_GROUPS_PATH, payload))


def score_localization() -> str:
    payload = read_translation_groups()
    results = []
    for group in payload["groups"]:
        for variant in group["variants"]:
            score = localization_depth_score(variant)
            index_status = "index" if score >= 80 and not variant.get("translationOnly") else "pending" if score >= 70 else "noindex"
            variant["localizationDepthScore"] = score
            variant["indexStatus"] = index_status
            variant["status"] = "approved" if score >= 80 else "localized" if score >= 70 else "draft"
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
        group["updatedAt"] = now()

    write_json(TRANSLATION_GROUPS_PATH, payload)
    return str(write_json(LOCALIZATION_SCORES_PATH, {"results": results}))


def sync_hreflang_groups() -> str:
    payload = read_translation_groups()
    groups = []
    for group in payload["groups"]:
        alternates = {}
        for variant in group["variants"]:
            alternates[hreflang_key(str(variant["locale"]))] = article_url_for_variant(variant)
        alternates["x-default"] = alternates.get("en") or next(iter(alternates.values()), "https://example.com/")
        groups.append(
            {
                "groupId": group["id"],
                "sourceArticleId": group.get("sourceArticleId"),
                "hreflangMap": alternates,
                "variantCount": len(group["variants"]),
            }
        )

    return str(write_json(HREFLANG_GROUPS_PATH, {"groups": groups}))


def read_translation_groups() -> dict[str, list[dict[str, Any]]]:
    payload = read_json(TRANSLATION_GROUPS_PATH, {"groups": []})
    groups = payload.get("groups", [])
    return {"groups": groups if isinstance(groups, list) else []}


def find_or_create_group(payload: dict[str, list[dict[str, Any]]], article_id: str, source_locale: str) -> dict[str, Any]:
    for group in payload["groups"]:
        if group.get("sourceArticleId") == article_id:
            return group

    create_translation_group(article_id, source_locale=source_locale)
    refreshed = read_translation_groups()
    payload["groups"] = refreshed["groups"]
    return next(group for group in payload["groups"] if group.get("sourceArticleId") == article_id)


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


def article_url_for_variant(variant: dict[str, Any]) -> str:
    locale = str(variant["locale"])
    article_id = slugify(str(variant["articleId"]))
    return f"https://example.com/{locale}/localized/{article_id}/"


def hreflang_key(locale: str) -> str:
    return "pt-BR" if locale == "pt-br" else locale


def number(value: Any, fallback: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
