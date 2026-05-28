from __future__ import annotations

from typing import Any


def distribution_send_decision(asset: dict[str, Any], send_enabled: bool, postiz_ready: bool) -> tuple[str, str]:
    if asset.get("platform") == "reddit":
        return ("skipped_reddit_draft_only", "Community auto-posting is disabled.")
    if not send_enabled:
        return ("skipped_disabled", "ENABLE_DISTRIBUTION_SEND is false.")
    if not postiz_ready:
        return ("blocked_missing_adapter", "POSTIZ_API_URL and POSTIZ_API_KEY are required to send.")
    return ("blocked_not_implemented", "Postiz adapter is intentionally disabled in this local implementation.")


def distribution_send_result(asset: dict[str, Any], status: str, message: str, captured_at: str) -> dict[str, Any]:
    return {
        "assetId": asset.get("id"),
        "platform": asset.get("platform"),
        "status": status,
        "message": message,
        "capturedAt": captured_at,
    }
