from __future__ import annotations

from typing import Any

from workers.python.common import slugify


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
