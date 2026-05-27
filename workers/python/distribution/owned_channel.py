from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from workers.python.common import DATA, read_csv, read_json, slugify, write_json
from workers.python.distribution.owned_channel_rules import (
    AFFILIATE_HEAVY_TYPES,
    DEFAULT_RULES,
    PREFERRED_DISTRIBUTION_TYPES,
    asset_types_for_platform,
    dedupe_articles,
    distribution_asset,
    distribution_asset_priority,
    distribution_priority,
    distribution_rule_from_row,
    normalize_article,
)

DISTRIBUTION_ASSETS_PATH = DATA / "exports" / "distribution_assets.json"
DISTRIBUTION_SEND_REPORT_PATH = DATA / "exports" / "distribution_send_report.json"
TOPIC_ARTICLES_PATH = DATA / "exports" / "topic_articles.json"
LOCALIZED_TOPIC_ARTICLES_PATH = DATA / "exports" / "localized_topic_articles.json"
URL_INVENTORY_PATH = DATA / "exports" / "initial_url_inventory.json"

def generate_distribution_assets(article_id: str | None = None) -> str:
    articles = source_articles()
    if not article_id:
        articles = articles[:40]
    rules = distribution_rules(DATA / "seeds" / "distribution-rules.csv")
    existing = read_json(DISTRIBUTION_ASSETS_PATH, {"assets": []}).get("assets", [])
    by_id = {str(asset.get("id")): asset for asset in existing if isinstance(asset, dict)}

    for article in articles:
        if article_id and article.get("id") != article_id:
            continue
        for rule in rules:
            if not rule["enabled"] or rule["locale"] != article.get("locale", "en"):
                continue
            for asset_type in asset_types_for_platform(rule["platform"]):
                asset = distribution_asset(article, rule, asset_type, now())
                by_id[asset["id"]] = asset

    assets = sorted(by_id.values(), key=distribution_asset_priority)
    return str(write_json(DISTRIBUTION_ASSETS_PATH, {"assets": assets}))


def approve_distribution_asset(asset_id: str) -> str:
    return update_asset(asset_id, {"status": "approved", "approvedAt": now()})


def schedule_distribution_asset(asset_id: str, scheduled_at: str | None = None) -> str:
    scheduled = scheduled_at or (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    return update_asset(asset_id, {"status": "scheduled", "scheduledAt": scheduled})


def send_approved_distribution_assets() -> str:
    payload = read_json(DISTRIBUTION_ASSETS_PATH, {"assets": []})
    assets = payload.get("assets", [])
    send_enabled = os.getenv("ENABLE_DISTRIBUTION_SEND", "false").lower() == "true"
    postiz_ready = bool(os.getenv("POSTIZ_API_URL") and os.getenv("POSTIZ_API_KEY"))
    results = []

    for asset in assets:
        if not isinstance(asset, dict) or asset.get("status") not in {"approved", "scheduled"}:
            continue
        if asset.get("platform") == "reddit":
            results.append(result(asset, "skipped_reddit_draft_only", "Community auto-posting is disabled."))
            continue
        if not send_enabled:
            results.append(result(asset, "skipped_disabled", "ENABLE_DISTRIBUTION_SEND is false."))
            continue
        if not postiz_ready:
            results.append(result(asset, "blocked_missing_adapter", "POSTIZ_API_URL and POSTIZ_API_KEY are required to send."))
            continue
        results.append(result(asset, "blocked_not_implemented", "Postiz adapter is intentionally disabled in this local implementation."))

    return str(write_json(DISTRIBUTION_SEND_REPORT_PATH, {"results": results, "sent": 0}))


def source_articles() -> list[dict[str, Any]]:
    topic_articles = read_json(TOPIC_ARTICLES_PATH, {"articles": []}).get("articles", [])
    localized = read_json(LOCALIZED_TOPIC_ARTICLES_PATH, {"articles": []}).get("articles", [])
    inventory = inventory_articles()
    preferred_inventory = [article for article in inventory if article.get("type") in PREFERRED_DISTRIBUTION_TYPES]
    generated_articles = [normalize_article(article) for article in [*topic_articles, *localized] if isinstance(article, dict)]
    if topic_articles or localized:
        return dedupe_articles([*preferred_inventory, *generated_articles, *inventory])
    return inventory


def inventory_articles() -> list[dict[str, Any]]:
    inventory = read_json(URL_INVENTORY_PATH, [])
    return [
        {
            "id": f"url-{slugify(str(row.get('path', row.get('slug', 'article'))))}",
            "locale": row.get("locale", "en"),
            "type": row.get("type", "guide"),
            "slug": row.get("slug", ""),
            "title": f"{row.get('type', 'guide')} {row.get('slug', '')}".strip(),
            "summary": row.get("cluster", ""),
            "path": row.get("path"),
            "hasAffiliate": row.get("type") in AFFILIATE_HEAVY_TYPES,
        }
        for row in inventory
        if isinstance(row, dict) and row.get("status") == "index_candidate"
    ]


def distribution_rules(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return DEFAULT_RULES
    rows = read_csv(path)
    return [distribution_rule_from_row(row) for row in rows]


def update_asset(asset_id: str, patch: dict[str, Any]) -> str:
    payload = read_json(DISTRIBUTION_ASSETS_PATH, {"assets": []})
    assets = payload.get("assets", [])
    updated = False
    for asset in assets:
        if isinstance(asset, dict) and asset.get("id") == asset_id:
            asset.update(patch)
            updated = True
            break
    if not updated:
        raise ValueError(f"Distribution asset {asset_id} was not found.")
    return str(write_json(DISTRIBUTION_ASSETS_PATH, {"assets": assets}))


def result(asset: dict[str, Any], status: str, message: str) -> dict[str, Any]:
    return {"assetId": asset.get("id"), "platform": asset.get("platform"), "status": status, "message": message, "capturedAt": now()}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
