from __future__ import annotations

from collections.abc import Callable
from typing import Any

from workers.python.outreach.link_earning_rules import is_suppressed, suppression_reason


def message_prospect(message: dict[str, Any], prospects_by_id: dict[str, Any]) -> dict[str, Any]:
    prospect = prospects_by_id.get(str(message.get("prospectId")), {})
    return prospect if isinstance(prospect, dict) else {}


def message_recipient_email(message: dict[str, Any], prospect: dict[str, Any]) -> Any:
    return message.get("recipientEmail") or prospect.get("contactEmail")


def suppress_message(message: dict[str, Any], prospect: dict[str, Any], email: Any, suppression: list[dict[str, str]]) -> None:
    message["status"] = "suppressed"
    message["approvedByHuman"] = False
    message["suppressionReason"] = suppression_reason(prospect.get("domain"), email, suppression)


def approve_message_record(message: dict[str, Any], now_factory: Callable[[], str]) -> None:
    message["status"] = "approved"
    message["approvedByHuman"] = True
    message["approvedAt"] = now_factory()


def approve_outreach_messages(
    messages: list[Any],
    prospects_by_id: dict[str, Any],
    suppression: list[dict[str, str]],
    message_id: str,
    now_factory: Callable[[], str],
) -> list[Any]:
    for message in messages:
        if isinstance(message, dict) and message.get("id") == message_id:
            prospect = message_prospect(message, prospects_by_id)
            email = message_recipient_email(message, prospect)
            if is_suppressed(prospect.get("domain"), email, suppression):
                suppress_message(message, prospect, email, suppression)
                raise ValueError(f"Outreach message {message_id} is suppressed and cannot be approved.")
            approve_message_record(message, now_factory)
            return messages
    raise ValueError(f"Outreach message {message_id} was not found.")
