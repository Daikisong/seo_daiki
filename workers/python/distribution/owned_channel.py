from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from workers.python.common import DATA, read_csv, read_json, slugify, write_json

DISTRIBUTION_ASSETS_PATH = DATA / "exports" / "distribution_assets.json"
DISTRIBUTION_SEND_REPORT_PATH = DATA / "exports" / "distribution_send_report.json"
TOPIC_ARTICLES_PATH = DATA / "exports" / "topic_articles.json"
LOCALIZED_TOPIC_ARTICLES_PATH = DATA / "exports" / "localized_topic_articles.json"
URL_INVENTORY_PATH = DATA / "exports" / "initial_url_inventory.json"

PREFERRED_DISTRIBUTION_TYPES = {"data", "lab", "methodology", "guide", "compare", "hub"}
AFFILIATE_HEAVY_TYPES = {"review", "deal_watch", "buyer_guide"}

DEFAULT_RULES = [
    {"platform": "x", "locale": "en", "maxPostsPerDay": 2, "requiresHumanApproval": True, "allowDirectLink": True, "requireDisclosure": True, "enabled": True},
    {"platform": "linkedin", "locale": "en", "maxPostsPerDay": 1, "requiresHumanApproval": True, "allowDirectLink": True, "requireDisclosure": True, "enabled": True},
    {"platform": "pinterest", "locale": "en", "maxPostsPerDay": 2, "requiresHumanApproval": True, "allowDirectLink": True, "requireDisclosure": True, "enabled": True},
    {"platform": "reddit", "locale": "en", "maxPostsPerDay": 0, "requiresHumanApproval": True, "allowDirectLink": False, "requireDisclosure": True, "enabled": False},
]


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
                asset = distribution_asset(article, rule, asset_type)
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


def normalize_article(article: dict[str, Any]) -> dict[str, Any]:
    article_type = article.get("type", "guide")
    return {
        "id": article.get("id"),
        "locale": article.get("locale", "en"),
        "type": article_type,
        "slug": article.get("slug", article.get("id", "")),
        "title": article.get("title", article.get("id", "")),
        "summary": article.get("summary", ""),
        "path": f"/{article.get('locale', 'en')}/{article.get('slug', article.get('id', 'draft'))}/",
        "hasAffiliate": bool(article.get("affiliatePlacementCandidates")) or article_type in AFFILIATE_HEAVY_TYPES,
    }


def dedupe_articles(articles: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_id = {}
    for article in sorted(articles, key=distribution_priority):
        key = str(article.get("path") or article.get("id"))
        if key and key not in by_id:
            by_id[key] = article
    return list(by_id.values())


def distribution_priority(article: dict[str, Any]) -> tuple[int, str]:
    article_type = str(article.get("type", ""))
    if article_type in {"data", "lab", "methodology"}:
        group = 0
    elif article_type in {"guide", "compare", "hub"}:
        group = 1
    elif article.get("hasAffiliate"):
        group = 3
    else:
        group = 2
    return (group, str(article.get("id") or article.get("path")))


def distribution_asset_priority(asset: dict[str, Any]) -> tuple[int, str, str]:
    target_url = str(asset.get("targetUrl") or "")
    article_id = str(asset.get("articleId") or "")
    disclosure = str(asset.get("disclosure") or "")
    if "/data/" in target_url or "/lab/" in target_url or "/methodology/" in target_url:
        group = 0
    elif "guide" in target_url or "compare" in target_url or "hub" in target_url:
        group = 1
    elif "affiliate" in disclosure.lower():
        group = 3
    else:
        group = 2
    return (group, article_id, str(asset.get("platform") or ""))


def distribution_rules(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return DEFAULT_RULES
    rows = read_csv(path)
    return [
        {
            "platform": clean(row.get("platform")),
            "locale": clean(row.get("locale")) or "en",
            "maxPostsPerDay": int(float(clean(row.get("max_posts_per_day")) or 0)),
            "requiresHumanApproval": clean(row.get("requires_human_approval")).lower() != "false",
            "allowDirectLink": clean(row.get("allow_direct_link")).lower() != "false",
            "requireDisclosure": clean(row.get("require_disclosure")).lower() != "false",
            "enabled": clean(row.get("enabled")).lower() != "false",
        }
        for row in rows
    ]


def distribution_asset(article: dict[str, Any], rule: dict[str, Any], asset_type: str) -> dict[str, Any]:
    platform = rule["platform"]
    article_id = str(article.get("id"))
    target_url = article.get("path") if rule["allowDirectLink"] else None
    disclosure = "Contains affiliate links; editorial review required." if article.get("hasAffiliate") else "Editorial draft; human approval required."
    body = body_for_platform(platform, str(article.get("title")), str(article.get("summary")), target_url)
    return {
        "id": f"distribution-{slugify(f'{article_id} {platform} {asset_type}')}",
        "articleId": article_id,
        "locale": article.get("locale", "en"),
        "assetType": asset_type,
        "platform": platform,
        "title": str(article.get("title"))[:120],
        "body": body,
        "mediaUrls": [],
        "targetUrl": target_url,
        "disclosure": disclosure if rule["requireDisclosure"] else None,
        "status": "draft",
        "requiresHumanApproval": rule["requiresHumanApproval"],
        "createdAt": now(),
    }


def asset_types_for_platform(platform: str) -> list[str]:
    if platform == "x":
        return ["x_post"]
    if platform == "linkedin":
        return ["linkedin_post"]
    if platform == "pinterest":
        return ["pinterest_pin"]
    if platform == "youtube":
        return ["youtube_short_script"]
    if platform == "discord":
        return ["discord_announcement"]
    if platform == "reddit":
        return ["reddit_draft"]
    return [f"{platform}_draft"]


def body_for_platform(platform: str, title: str, summary: str, target_url: str | None) -> str:
    link = f"\n{target_url}" if target_url else ""
    if platform == "youtube":
        return f"Short script: open with the buyer problem, show the evidence checklist, end with '{title}'.{link}"
    if platform == "pinterest":
        return f"{title}\nEvidence-first checklist, saved as an owned-channel pin draft.{link}"
    return f"{title}\n{summary}\nReview before posting; no direct affiliate link in the draft.{link}"


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


def clean(value: Any) -> str:
    return str(value or "").strip()
