from __future__ import annotations

from collections.abc import Callable
from typing import Any

from workers.python.common import slugify
from workers.python.outreach.link_earning_rules import is_suppressed, outreach_body, suppression_reason


def draft_outreach_messages(
    prospects: list[Any],
    assets: dict[Any, Any],
    existing: list[Any],
    suppression: list[dict[str, str]],
    now_factory: Callable[[], str],
) -> list[dict[str, Any]]:
    by_id = {str(message.get("id")): message for message in existing if isinstance(message, dict)}

    for prospect in prospects:
        if not isinstance(prospect, dict) or prospect.get("status") != "qualified":
            continue
        if is_suppressed(prospect.get("domain"), prospect.get("contactEmail"), suppression):
            continue
        if not prospect.get("contactEmail") and not prospect.get("contactFormUrl"):
            continue
        asset = assets.get(prospect.get("suggestedAssetId"))
        if not isinstance(asset, dict):
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
            "createdAt": now_factory(),
        }

    return list(by_id.values())


def approve_outreach_messages(
    messages: list[Any],
    prospects_by_id: dict[str, Any],
    suppression: list[dict[str, str]],
    message_id: str,
    now_factory: Callable[[], str],
) -> list[Any]:
    for message in messages:
        if isinstance(message, dict) and message.get("id") == message_id:
            prospect = prospects_by_id.get(str(message.get("prospectId")), {})
            email = message.get("recipientEmail") or prospect.get("contactEmail")
            if is_suppressed(prospect.get("domain"), email, suppression):
                message["status"] = "suppressed"
                message["approvedByHuman"] = False
                message["suppressionReason"] = suppression_reason(prospect.get("domain"), email, suppression)
                raise ValueError(f"Outreach message {message_id} is suppressed and cannot be approved.")
            message["status"] = "approved"
            message["approvedByHuman"] = True
            message["approvedAt"] = now_factory()
            return messages
    raise ValueError(f"Outreach message {message_id} was not found.")


def build_outreach_send_report(
    messages: list[Any],
    prospects_by_id: dict[str, Any],
    suppression: list[dict[str, str]],
    send_enabled: bool,
    smtp_ready: bool,
    now_factory: Callable[[], str],
) -> dict[str, Any]:
    results = []
    for message in messages:
        if not isinstance(message, dict) or message.get("status") != "approved" or not message.get("approvedByHuman"):
            continue
        prospect = prospects_by_id.get(str(message.get("prospectId")), {})
        email = message.get("recipientEmail") or prospect.get("contactEmail")
        if is_suppressed(prospect.get("domain"), email, suppression):
            results.append(send_result(message, "blocked_suppressed", suppression_reason(prospect.get("domain"), email, suppression), now_factory))
            continue
        if not send_enabled:
            results.append(send_result(message, "skipped_disabled", "ENABLE_OUTREACH_SEND is false.", now_factory))
            continue
        if not smtp_ready:
            results.append(send_result(message, "blocked_missing_smtp", "SMTP_HOST and OUTREACH_SENDER_EMAIL are required.", now_factory))
            continue
        results.append(
            send_result(
                message,
                "blocked_not_implemented",
                "SMTP adapter is intentionally disabled in this local implementation.",
                now_factory,
            )
        )
    return {"results": results, "sent": 0}


def send_result(
    message: dict[str, Any],
    status: str,
    detail: str,
    now_factory: Callable[[], str],
) -> dict[str, Any]:
    return {"messageId": message.get("id"), "status": status, "detail": detail, "capturedAt": now_factory()}
