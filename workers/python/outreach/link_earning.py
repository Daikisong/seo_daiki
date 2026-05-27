from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from workers.python.common import DATA, read_csv, read_json, slugify, write_json
from workers.python.outreach.link_earning_rules import (
    LINKABLE_TYPES,
    SPAM_RISK_DOMAINS,
    best_asset_for_prospect,
    clean,
    is_suppressed,
    normalize_domain,
    numeric,
    original_data_score_for,
    outreach_body,
    suggested_angle,
    suppression_reason,
    topic_overlap,
    topical_specificity,
)

URL_INVENTORY_PATH = DATA / "exports" / "initial_url_inventory.json"
LINKABLE_ASSETS_PATH = DATA / "exports" / "linkable_assets.json"
LINK_PROSPECTS_PATH = DATA / "snapshots" / "link_prospects.json"
LINK_PROSPECT_SCORES_PATH = DATA / "exports" / "link_prospect_scores.json"
OUTREACH_MESSAGES_PATH = DATA / "exports" / "outreach_messages.json"
OUTREACH_SEND_REPORT_PATH = DATA / "exports" / "outreach_send_report.json"
SUPPRESSION_LIST_PATH = DATA / "seeds" / "suppression-list.csv"

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
    suppression = suppression_entries()
    prospects = []
    for row in rows:
        page_url = clean(row.get("page_url"))
        domain = clean(row.get("domain")) or urlparse(page_url).hostname or ""
        contact_email = clean(row.get("contact_email")) or None
        suppressed = is_suppressed(domain, contact_email, suppression)
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
                "contactEmail": contact_email,
                "contactFormUrl": clean(row.get("contact_form_url")) or None,
                "status": "suppressed" if suppressed else "new",
                "suppressionReason": suppression_reason(domain, contact_email, suppression) if suppressed else None,
                "notes": clean(row.get("notes")),
            }
        )
    return str(write_json(LINK_PROSPECTS_PATH, {"prospects": prospects}))


def score_link_prospects() -> str:
    assets = read_json(LINKABLE_ASSETS_PATH, {"assets": []}).get("assets", [])
    prospects = read_json(LINK_PROSPECTS_PATH, {"prospects": []}).get("prospects", [])
    suppression = suppression_entries()
    scored = []
    for prospect in prospects:
        if not isinstance(prospect, dict):
            continue
        suppressed = is_suppressed(prospect.get("domain"), prospect.get("contactEmail"), suppression)
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
                "prospectScore": 0 if suppressed else score,
                "suppressionReason": suppression_reason(prospect.get("domain"), prospect.get("contactEmail"), suppression) if suppressed else prospect.get("suppressionReason"),
                "status": "suppressed" if suppressed else "qualified" if score >= 60 and spam_risk < 70 else "rejected",
            }
        )
    scored.sort(key=lambda item: item["prospectScore"], reverse=True)
    return str(write_json(LINK_PROSPECT_SCORES_PATH, {"prospects": scored}))


def draft_outreach() -> str:
    prospects = read_json(LINK_PROSPECT_SCORES_PATH, {"prospects": []}).get("prospects", [])
    assets = {asset.get("id"): asset for asset in read_json(LINKABLE_ASSETS_PATH, {"assets": []}).get("assets", []) if isinstance(asset, dict)}
    existing = read_json(OUTREACH_MESSAGES_PATH, {"messages": []}).get("messages", [])
    suppression = suppression_entries()
    by_id = {str(message.get("id")): message for message in existing if isinstance(message, dict)}

    for prospect in prospects:
        if not isinstance(prospect, dict) or prospect.get("status") != "qualified":
            continue
        if is_suppressed(prospect.get("domain"), prospect.get("contactEmail"), suppression):
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
            "recipientEmail": prospect.get("contactEmail"),
            "contactFormUrl": prospect.get("contactFormUrl"),
            "status": "draft",
            "approvedByHuman": False,
            "createdAt": now(),
        }

    return str(write_json(OUTREACH_MESSAGES_PATH, {"messages": list(by_id.values())}))


def approve_outreach_message(message_id: str) -> str:
    payload = read_json(OUTREACH_MESSAGES_PATH, {"messages": []})
    messages = payload.get("messages", [])
    prospects = {
        str(prospect.get("id")): prospect
        for prospect in read_json(LINK_PROSPECT_SCORES_PATH, {"prospects": []}).get("prospects", [])
        if isinstance(prospect, dict)
    }
    suppression = suppression_entries()
    for message in messages:
        if isinstance(message, dict) and message.get("id") == message_id:
            prospect = prospects.get(str(message.get("prospectId")), {})
            email = message.get("recipientEmail") or prospect.get("contactEmail")
            if is_suppressed(prospect.get("domain"), email, suppression):
                message["status"] = "suppressed"
                message["approvedByHuman"] = False
                message["suppressionReason"] = suppression_reason(prospect.get("domain"), email, suppression)
                write_json(OUTREACH_MESSAGES_PATH, {"messages": messages})
                raise ValueError(f"Outreach message {message_id} is suppressed and cannot be approved.")
            message["status"] = "approved"
            message["approvedByHuman"] = True
            message["approvedAt"] = now()
            return str(write_json(OUTREACH_MESSAGES_PATH, {"messages": messages}))
    raise ValueError(f"Outreach message {message_id} was not found.")


def send_approved_outreach() -> str:
    messages = read_json(OUTREACH_MESSAGES_PATH, {"messages": []}).get("messages", [])
    prospects = {
        str(prospect.get("id")): prospect
        for prospect in read_json(LINK_PROSPECT_SCORES_PATH, {"prospects": []}).get("prospects", [])
        if isinstance(prospect, dict)
    }
    suppression = suppression_entries()
    send_enabled = os.getenv("ENABLE_OUTREACH_SEND", "false").lower() == "true"
    smtp_ready = bool(os.getenv("SMTP_HOST") and os.getenv("OUTREACH_SENDER_EMAIL"))
    results = []
    for message in messages:
        if not isinstance(message, dict) or message.get("status") != "approved" or not message.get("approvedByHuman"):
            continue
        prospect = prospects.get(str(message.get("prospectId")), {})
        email = message.get("recipientEmail") or prospect.get("contactEmail")
        if is_suppressed(prospect.get("domain"), email, suppression):
            results.append(send_result(message, "blocked_suppressed", suppression_reason(prospect.get("domain"), email, suppression)))
            continue
        if not send_enabled:
            results.append(send_result(message, "skipped_disabled", "ENABLE_OUTREACH_SEND is false."))
            continue
        if not smtp_ready:
            results.append(send_result(message, "blocked_missing_smtp", "SMTP_HOST and OUTREACH_SENDER_EMAIL are required."))
            continue
        results.append(send_result(message, "blocked_not_implemented", "SMTP adapter is intentionally disabled in this local implementation."))
    return str(write_json(OUTREACH_SEND_REPORT_PATH, {"results": results, "sent": 0}))


def suppression_entries(path: Path = SUPPRESSION_LIST_PATH) -> list[dict[str, str]]:
    if not path.exists():
        return []
    entries = []
    for row in read_csv(path):
        email = clean(row.get("email")).lower()
        domain = normalize_domain(row.get("domain"))
        if not email and not domain:
            continue
        entries.append({"email": email, "domain": domain, "reason": clean(row.get("reason")) or "suppressed"})
    return entries


def send_result(message: dict[str, Any], status: str, detail: str) -> dict[str, Any]:
    return {"messageId": message.get("id"), "status": status, "detail": detail, "capturedAt": now()}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
