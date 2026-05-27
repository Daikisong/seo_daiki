from __future__ import annotations

from typing import Any

from workers.python.common import slugify

PREFERRED_DISTRIBUTION_TYPES = {"data", "lab", "methodology", "guide", "compare", "hub"}
AFFILIATE_HEAVY_TYPES = {"review", "deal_watch", "buyer_guide"}

DEFAULT_RULES = [
    {"platform": "x", "locale": "en", "maxPostsPerDay": 2, "requiresHumanApproval": True, "allowDirectLink": True, "requireDisclosure": True, "enabled": True},
    {"platform": "linkedin", "locale": "en", "maxPostsPerDay": 1, "requiresHumanApproval": True, "allowDirectLink": True, "requireDisclosure": True, "enabled": True},
    {"platform": "pinterest", "locale": "en", "maxPostsPerDay": 2, "requiresHumanApproval": True, "allowDirectLink": True, "requireDisclosure": True, "enabled": True},
    {"platform": "reddit", "locale": "en", "maxPostsPerDay": 0, "requiresHumanApproval": True, "allowDirectLink": False, "requireDisclosure": True, "enabled": False},
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


def distribution_rule_from_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "platform": clean(row.get("platform")),
        "locale": clean(row.get("locale")) or "en",
        "maxPostsPerDay": int(float(clean(row.get("max_posts_per_day")) or 0)),
        "requiresHumanApproval": clean(row.get("requires_human_approval")).lower() != "false",
        "allowDirectLink": clean(row.get("allow_direct_link")).lower() != "false",
        "requireDisclosure": clean(row.get("require_disclosure")).lower() != "false",
        "enabled": clean(row.get("enabled")).lower() != "false",
    }


def distribution_asset(article: dict[str, Any], rule: dict[str, Any], asset_type: str, created_at: str) -> dict[str, Any]:
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
        "createdAt": created_at,
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


def clean(value: Any) -> str:
    return str(value or "").strip()
