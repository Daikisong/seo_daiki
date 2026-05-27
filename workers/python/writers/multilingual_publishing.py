from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from workers.python.common import read_json, write_json
from workers.python.writers.multilingual_groups import create_group_record, replace_group, upsert_localized_variant
from workers.python.writers.multilingual_hreflang import (
    article_url_for_variant,
    build_hreflang_groups,
    hreflang_key,
)
from workers.python.writers.multilingual_paths import HREFLANG_GROUPS_PATH, LOCALIZATION_SCORES_PATH, TRANSLATION_GROUPS_PATH
from workers.python.writers.multilingual_scoring import localization_depth_score, number, score_translation_payload


def create_translation_group(article_id: str, topic_id: str | None = None, source_locale: str = "en") -> str:
    payload = read_translation_groups()
    group = create_group_record(article_id, topic_id, source_locale, now)
    groups = replace_group(payload["groups"], group)
    return str(write_json(TRANSLATION_GROUPS_PATH, {"groups": groups}))


def localize_article(article_id: str, locale: str, source_locale: str = "en") -> str:
    payload = read_translation_groups()
    group = find_or_create_group(payload, article_id, source_locale)
    upsert_localized_variant(group, article_id, locale, source_locale, now)
    return str(write_json(TRANSLATION_GROUPS_PATH, payload))


def score_localization() -> str:
    payload = read_translation_groups()
    results = score_translation_payload(payload, now)
    write_json(TRANSLATION_GROUPS_PATH, payload)
    return str(write_json(LOCALIZATION_SCORES_PATH, {"results": results}))


def sync_hreflang_groups() -> str:
    payload = read_translation_groups()
    return str(write_json(HREFLANG_GROUPS_PATH, {"groups": build_hreflang_groups(payload)}))


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


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
