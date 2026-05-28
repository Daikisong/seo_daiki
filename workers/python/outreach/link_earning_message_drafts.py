from __future__ import annotations

from collections.abc import Callable
from typing import Any

from workers.python.common import slugify
from workers.python.outreach.link_earning_rules import is_suppressed, outreach_body


def outreach_message_id(prospect: dict[str, Any], asset: dict[str, Any]) -> str:
    return f"outreach-{slugify(str(prospect.get('id')) + ' ' + str(asset.get('id')))}"


def prospect_can_receive_outreach(prospect: dict[str, Any], suppression: list[dict[str, str]]) -> bool:
    if prospect.get("status") != "qualified":
        return False
    if is_suppressed(prospect.get("domain"), prospect.get("contactEmail"), suppression):
        return False
    return bool(prospect.get("contactEmail") or prospect.get("contactFormUrl"))


def outreach_message_record(prospect: dict[str, Any], asset: dict[str, Any], now_factory: Callable[[], str]) -> dict[str, Any]:
    message_id = outreach_message_id(prospect, asset)
    return {
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
        "createdAt": now_factory(),
    }


def draft_outreach_messages(
    prospects: list[Any],
    assets: dict[Any, Any],
    existing: list[Any],
    suppression: list[dict[str, str]],
    now_factory: Callable[[], str],
) -> list[dict[str, Any]]:
    by_id = {str(message.get("id")): message for message in existing if isinstance(message, dict)}

    for prospect in prospects:
        if not isinstance(prospect, dict) or not prospect_can_receive_outreach(prospect, suppression):
            continue
        asset = assets.get(prospect.get("suggestedAssetId"))
        if not isinstance(asset, dict):
            continue
        by_id[outreach_message_id(prospect, asset)] = outreach_message_record(prospect, asset, now_factory)

    return list(by_id.values())
