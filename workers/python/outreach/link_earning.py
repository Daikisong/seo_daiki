from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path

from workers.python.common import read_csv, read_json, write_json
from workers.python.outreach.link_earning_assets import build_linkable_assets
from workers.python.outreach.link_earning_messages import (
    approve_outreach_messages,
    build_outreach_send_report,
    draft_outreach_messages,
)
from workers.python.outreach.link_earning_paths import (
    LINKABLE_ASSETS_PATH,
    LINK_PROSPECTS_PATH,
    LINK_PROSPECT_SCORES_PATH,
    OUTREACH_MESSAGES_PATH,
    OUTREACH_SEND_REPORT_PATH,
    URL_INVENTORY_PATH,
)
from workers.python.outreach.link_earning_prospects import build_imported_prospects, score_link_prospect_rows
from workers.python.outreach.link_earning_suppression import suppression_entries
from workers.python.outreach.link_earning_rules import (
    is_suppressed,
    suppression_reason,
)

def score_linkable_assets() -> str:
    inventory = read_json(URL_INVENTORY_PATH, [])
    assets = build_linkable_assets(inventory)
    return str(write_json(LINKABLE_ASSETS_PATH, {"assets": assets[:100]}))


def import_link_prospects(path: Path) -> str:
    rows = read_csv(path)
    suppression = suppression_entries()
    prospects = build_imported_prospects(rows, suppression)
    return str(write_json(LINK_PROSPECTS_PATH, {"prospects": prospects}))


def score_link_prospects() -> str:
    assets = read_json(LINKABLE_ASSETS_PATH, {"assets": []}).get("assets", [])
    prospects = read_json(LINK_PROSPECTS_PATH, {"prospects": []}).get("prospects", [])
    suppression = suppression_entries()
    scored = score_link_prospect_rows(prospects, assets, suppression)
    return str(write_json(LINK_PROSPECT_SCORES_PATH, {"prospects": scored}))


def draft_outreach() -> str:
    prospects = read_json(LINK_PROSPECT_SCORES_PATH, {"prospects": []}).get("prospects", [])
    assets = {asset.get("id"): asset for asset in read_json(LINKABLE_ASSETS_PATH, {"assets": []}).get("assets", []) if isinstance(asset, dict)}
    existing = read_json(OUTREACH_MESSAGES_PATH, {"messages": []}).get("messages", [])
    suppression = suppression_entries()
    messages = draft_outreach_messages(prospects, assets, existing, suppression, now)
    return str(write_json(OUTREACH_MESSAGES_PATH, {"messages": messages}))


def approve_outreach_message(message_id: str) -> str:
    payload = read_json(OUTREACH_MESSAGES_PATH, {"messages": []})
    messages = payload.get("messages", [])
    prospects = {
        str(prospect.get("id")): prospect
        for prospect in read_json(LINK_PROSPECT_SCORES_PATH, {"prospects": []}).get("prospects", [])
        if isinstance(prospect, dict)
    }
    suppression = suppression_entries()
    try:
        updated_messages = approve_outreach_messages(messages, prospects, suppression, message_id, now)
    except ValueError:
        write_json(OUTREACH_MESSAGES_PATH, {"messages": messages})
        raise
    return str(write_json(OUTREACH_MESSAGES_PATH, {"messages": updated_messages}))


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
    report = build_outreach_send_report(messages, prospects, suppression, send_enabled, smtp_ready, now)
    return str(write_json(OUTREACH_SEND_REPORT_PATH, report))


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
