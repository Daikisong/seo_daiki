from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Any

from workers.python.common import DATA, read_json, write_json
from workers.python.distribution.owned_channel_delivery import distribution_send_decision, distribution_send_result
from workers.python.distribution.owned_channel_paths import DISTRIBUTION_ASSETS_PATH, DISTRIBUTION_SEND_REPORT_PATH
from workers.python.distribution.owned_channel_rules import (
    asset_types_for_platform,
    distribution_asset,
    distribution_asset_priority,
)
from workers.python.distribution.owned_channel_sources import distribution_rules, source_articles


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
        status, message = distribution_send_decision(asset, send_enabled, postiz_ready)
        results.append(distribution_send_result(asset, status, message, now()))

    return str(write_json(DISTRIBUTION_SEND_REPORT_PATH, {"results": results, "sent": 0}))


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


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
