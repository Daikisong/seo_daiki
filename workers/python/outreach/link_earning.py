from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from workers.python.common import DATA, read_csv, read_json, slugify, write_json

URL_INVENTORY_PATH = DATA / "exports" / "initial_url_inventory.json"
LINKABLE_ASSETS_PATH = DATA / "exports" / "linkable_assets.json"
LINK_PROSPECTS_PATH = DATA / "snapshots" / "link_prospects.json"
LINK_PROSPECT_SCORES_PATH = DATA / "exports" / "link_prospect_scores.json"
OUTREACH_MESSAGES_PATH = DATA / "exports" / "outreach_messages.json"
OUTREACH_SEND_REPORT_PATH = DATA / "exports" / "outreach_send_report.json"

LINKABLE_TYPES = {"data", "lab", "methodology", "guide", "compare", "hub", "buyer_guide"}
SPAM_RISK_DOMAINS = {"example-spam.test", "paid-links.test", "directory-submit.test"}


def score_linkable_assets() -> str:
    inventory = read_json(URL_INVENTORY_PATH, [])
    assets = []
    for row in inventory:
        if not isinstance(row, dict) or row.get("type") not in LINKABLE_TYPES:
            continue
        url = str(row.get("path") or "")
        original_data_score = original_data_score_for(str(row.get("type")), str(row.get("cluster", "")))
        linkable_score = round(original_data_score * 0.55 + topical_specificity(str(row.get("slug"))) * 0.25 + 20, 2)
        assets.append(
            {
                "id": f"linkable-{slugify(url)}",
                "articleId": None,
                "url": url,
                "locale": row.get("locale", "en"),
                "topic": row.get("cluster", ""),
                "assetType": row.get("type"),
                "title": f"{row.get('type')} {row.get('slug')}".strip(),
                "summary": f"Evidence-first {row.get('type')} page for {row.get('cluster')}.",
                "originalDataScore": original_data_score,
                "linkableScore": linkable_score,
                "status": "active",
            }
        )

    assets.sort(key=lambda item: item["linkableScore"], reverse=True)
    return str(write_json(LINKABLE_ASSETS_PATH, {"assets": assets[:100]}))


def import_link_prospects(path: Path) -> str:
    rows = read_csv(path)
    prospects = []
    for row in rows:
        page_url = clean(row.get("page_url"))
        domain = clean(row.get("domain")) or urlparse(page_url).hostname or ""
        prospects.append(
            {
                "id": clean(row.get("id")) or f"prospect-{slugify(domain + ' ' + page_url)}",
                "domain": domain.lower(),
                "pageUrl": page_url,
                "pageTitle": clean(row.get("page_title")),
                "locale": clean(row.get("locale")) or None,
                "topic": clean(row.get("topic")),
                "opportunityType": clean(row.get("opportunity_type")) or "data_citation",
                "suggestedAssetId": clean(row.get("suggested_asset_id")) or None,
                "suggestedAngle": clean(row.get("suggested_angle")),
                "topicalRelevance": numeric(row.get("topical_relevance"), 0),
                "pageQuality": numeric(row.get("page_quality"), 0),
                "spamRisk": numeric(row.get("spam_risk"), 0),
                "prospectScore": 0,
                "contactEmail": clean(row.get("contact_email")) or None,
                "contactFormUrl": clean(row.get("contact_form_url")) or None,
                "status": "new",
                "notes": clean(row.get("notes")),
            }
        )
    return str(write_json(LINK_PROSPECTS_PATH, {"prospects": prospects}))


def score_link_prospects() -> str:
    assets = read_json(LINKABLE_ASSETS_PATH, {"assets": []}).get("assets", [])
    prospects = read_json(LINK_PROSPECTS_PATH, {"prospects": []}).get("prospects", [])
    scored = []
    for prospect in prospects:
        if not isinstance(prospect, dict):
            continue
        asset = best_asset_for_prospect(prospect, assets)
        spam_risk = max(float(prospect.get("spamRisk") or 0), 95 if prospect.get("domain") in SPAM_RISK_DOMAINS else 0)
        topical = float(prospect.get("topicalRelevance") or topic_overlap(str(prospect.get("topic")), str(asset.get("topic") if asset else "")))
        page_quality = float(prospect.get("pageQuality") or 50)
        score = round(topical * 0.45 + page_quality * 0.35 + (100 - spam_risk) * 0.20, 2)
        scored.append(
            {
                **prospect,
                "suggestedAssetId": prospect.get("suggestedAssetId") or (asset.get("id") if asset else None),
                "suggestedAngle": prospect.get("suggestedAngle") or suggested_angle(prospect, asset),
                "topicalRelevance": topical,
                "pageQuality": page_quality,
                "spamRisk": spam_risk,
                "prospectScore": score,
                "status": "qualified" if score >= 60 and spam_risk < 70 else "rejected",
            }
        )
    scored.sort(key=lambda item: item["prospectScore"], reverse=True)
    return str(write_json(LINK_PROSPECT_SCORES_PATH, {"prospects": scored}))


def draft_outreach() -> str:
    prospects = read_json(LINK_PROSPECT_SCORES_PATH, {"prospects": []}).get("prospects", [])
    assets = {asset.get("id"): asset for asset in read_json(LINKABLE_ASSETS_PATH, {"assets": []}).get("assets", []) if isinstance(asset, dict)}
    existing = read_json(OUTREACH_MESSAGES_PATH, {"messages": []}).get("messages", [])
    by_id = {str(message.get("id")): message for message in existing if isinstance(message, dict)}

    for prospect in prospects:
        if not isinstance(prospect, dict) or prospect.get("status") != "qualified":
            continue
        if not prospect.get("contactEmail") and not prospect.get("contactFormUrl"):
            continue
        asset = assets.get(prospect.get("suggestedAssetId"))
        if not asset:
            continue
        message_id = f"outreach-{slugify(str(prospect.get('id')) + ' ' + str(asset.get('id')))}"
        by_id[message_id] = {
            "id": message_id,
            "campaignId": f"campaign-{slugify(str(asset.get('id')))}",
            "prospectId": prospect.get("id"),
            "assetId": asset.get("id"),
            "subject": f"Possible source for {prospect.get('topic') or asset.get('topic')}",
            "body": outreach_body(prospect, asset),
            "status": "draft",
            "approvedByHuman": False,
            "createdAt": now(),
        }

    return str(write_json(OUTREACH_MESSAGES_PATH, {"messages": list(by_id.values())}))


def approve_outreach_message(message_id: str) -> str:
    payload = read_json(OUTREACH_MESSAGES_PATH, {"messages": []})
    messages = payload.get("messages", [])
    for message in messages:
        if isinstance(message, dict) and message.get("id") == message_id:
            message["status"] = "approved"
            message["approvedByHuman"] = True
            message["approvedAt"] = now()
            return str(write_json(OUTREACH_MESSAGES_PATH, {"messages": messages}))
    raise ValueError(f"Outreach message {message_id} was not found.")


def send_approved_outreach() -> str:
    messages = read_json(OUTREACH_MESSAGES_PATH, {"messages": []}).get("messages", [])
    send_enabled = os.getenv("ENABLE_OUTREACH_SEND", "false").lower() == "true"
    smtp_ready = bool(os.getenv("SMTP_HOST") and os.getenv("OUTREACH_SENDER_EMAIL"))
    results = []
    for message in messages:
        if not isinstance(message, dict) or message.get("status") != "approved" or not message.get("approvedByHuman"):
            continue
        if not send_enabled:
            results.append(send_result(message, "skipped_disabled", "ENABLE_OUTREACH_SEND is false."))
            continue
        if not smtp_ready:
            results.append(send_result(message, "blocked_missing_smtp", "SMTP_HOST and OUTREACH_SENDER_EMAIL are required."))
            continue
        results.append(send_result(message, "blocked_not_implemented", "SMTP adapter is intentionally disabled in this local implementation."))
    return str(write_json(OUTREACH_SEND_REPORT_PATH, {"results": results, "sent": 0}))


def best_asset_for_prospect(prospect: dict[str, Any], assets: list[dict[str, Any]]) -> dict[str, Any] | None:
    topic = str(prospect.get("topic", ""))
    candidates = [asset for asset in assets if isinstance(asset, dict)]
    if prospect.get("suggestedAssetId"):
        for asset in candidates:
            if asset.get("id") == prospect.get("suggestedAssetId"):
                return asset
    return max(candidates, key=lambda asset: topic_overlap(topic, str(asset.get("topic", ""))) + float(asset.get("linkableScore") or 0) / 10, default=None)


def original_data_score_for(asset_type: str, topic: str) -> float:
    if asset_type in {"data", "lab", "methodology"}:
        return 90
    if asset_type in {"guide", "compare"} and topic:
        return 72
    return 55


def topical_specificity(value: str) -> float:
    return min(100, max(20, len([part for part in value.split("-") if part]) * 12))


def topic_overlap(left: str, right: str) -> float:
    left_terms = set(words(left))
    right_terms = set(words(right))
    if not left_terms or not right_terms:
        return 35
    return min(100, 40 + len(left_terms & right_terms) * 20)


def suggested_angle(prospect: dict[str, Any], asset: dict[str, Any] | None) -> str:
    if not asset:
        return "Manual review required before drafting."
    return f"Suggest the {asset.get('assetType')} page as a citation; do not ask for optimized anchor text."


def outreach_body(prospect: dict[str, Any], asset: dict[str, Any]) -> str:
    return (
        f"Hi,\n\n"
        f"I found your page about {prospect.get('topic')}. We maintain an evidence-focused resource that may help as a source:\n"
        f"{asset.get('url')}\n\n"
        "No paid placement or anchor text request is intended. If it is not useful, please ignore this note.\n\n"
        "Thanks."
    )


def send_result(message: dict[str, Any], status: str, detail: str) -> dict[str, Any]:
    return {"messageId": message.get("id"), "status": status, "detail": detail, "capturedAt": now()}


def words(value: str) -> list[str]:
    return [part for part in value.lower().replace("-", " ").split() if len(part) > 3]


def numeric(value: Any, fallback: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def clean(value: Any) -> str:
    return str(value or "").strip()
