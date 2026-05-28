from __future__ import annotations

from collections.abc import Callable
from typing import Any

from workers.python.outreach.link_earning_message_approval import message_prospect, message_recipient_email
from workers.python.outreach.link_earning_rules import is_suppressed, suppression_reason


def outreach_message_is_send_candidate(message: Any) -> bool:
    return isinstance(message, dict) and message.get("status") == "approved" and bool(message.get("approvedByHuman"))


def send_result(
    message: dict[str, Any],
    status: str,
    detail: str,
    now_factory: Callable[[], str],
) -> dict[str, Any]:
    return {"messageId": message.get("id"), "status": status, "detail": detail, "capturedAt": now_factory()}


def send_decision(
    message: dict[str, Any],
    prospect: dict[str, Any],
    suppression: list[dict[str, str]],
    send_enabled: bool,
    smtp_ready: bool,
) -> tuple[str, str]:
    email = message_recipient_email(message, prospect)
    if is_suppressed(prospect.get("domain"), email, suppression):
        return ("blocked_suppressed", suppression_reason(prospect.get("domain"), email, suppression))
    if not send_enabled:
        return ("skipped_disabled", "ENABLE_OUTREACH_SEND is false.")
    if not smtp_ready:
        return ("blocked_missing_smtp", "SMTP_HOST and OUTREACH_SENDER_EMAIL are required.")
    return ("blocked_not_implemented", "SMTP adapter is intentionally disabled in this local implementation.")


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
        if not outreach_message_is_send_candidate(message):
            continue
        prospect = message_prospect(message, prospects_by_id)
        status, detail = send_decision(message, prospect, suppression, send_enabled, smtp_ready)
        results.append(send_result(message, status, detail, now_factory))
    return {"results": results, "sent": 0}
