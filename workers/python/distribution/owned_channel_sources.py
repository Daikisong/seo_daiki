from __future__ import annotations

from pathlib import Path
from typing import Any

from workers.python.common import read_csv, read_json, slugify
from workers.python.distribution.owned_channel_paths import (
    LOCALIZED_TOPIC_ARTICLES_PATH,
    TOPIC_ARTICLES_PATH,
    URL_INVENTORY_PATH,
)
from workers.python.distribution.owned_channel_rules import (
    AFFILIATE_HEAVY_TYPES,
    DEFAULT_RULES,
    PREFERRED_DISTRIBUTION_TYPES,
    dedupe_articles,
    distribution_rule_from_row,
    normalize_article,
)


def source_articles(
    topic_articles_path: Path = TOPIC_ARTICLES_PATH,
    localized_topic_articles_path: Path = LOCALIZED_TOPIC_ARTICLES_PATH,
    url_inventory_path: Path = URL_INVENTORY_PATH,
) -> list[dict[str, Any]]:
    topic_articles = read_json(topic_articles_path, {"articles": []}).get("articles", [])
    localized = read_json(localized_topic_articles_path, {"articles": []}).get("articles", [])
    inventory = read_json(url_inventory_path, [])
    return source_articles_from_payloads(topic_articles, localized, inventory)


def source_articles_from_payloads(
    topic_articles: object,
    localized_topic_articles: object,
    inventory: object,
) -> list[dict[str, Any]]:
    inventory_rows = inventory_articles_from_rows(inventory)
    generated_rows = [*_dict_rows(topic_articles), *_dict_rows(localized_topic_articles)]
    generated_articles = [normalize_article(article) for article in generated_rows]

    if generated_rows:
        preferred_inventory = [article for article in inventory_rows if article.get("type") in PREFERRED_DISTRIBUTION_TYPES]
        return dedupe_articles([*preferred_inventory, *generated_articles, *inventory_rows])
    return inventory_rows


def inventory_articles_from_rows(rows: object) -> list[dict[str, Any]]:
    return [inventory_article_from_row(row) for row in _dict_rows(rows) if row.get("status") == "index_candidate"]


def inventory_article_from_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": f"url-{slugify(str(row.get('path', row.get('slug', 'article'))))}",
        "locale": row.get("locale", "en"),
        "type": row.get("type", "guide"),
        "slug": row.get("slug", ""),
        "title": f"{row.get('type', 'guide')} {row.get('slug', '')}".strip(),
        "summary": row.get("cluster", ""),
        "path": row.get("path"),
        "hasAffiliate": row.get("type") in AFFILIATE_HEAVY_TYPES,
    }


def distribution_rules(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return DEFAULT_RULES
    return distribution_rules_from_rows(read_csv(path))


def distribution_rules_from_rows(rows: object) -> list[dict[str, Any]]:
    return [distribution_rule_from_row(row) for row in _dict_rows(rows)]


def _dict_rows(rows: object) -> list[dict[str, Any]]:
    if not isinstance(rows, list):
        return []
    return [row for row in rows if isinstance(row, dict)]
