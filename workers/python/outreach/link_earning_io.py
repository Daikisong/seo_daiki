from __future__ import annotations

from collections.abc import Mapping
from typing import Any


def assets_by_id(rows: list[Any]) -> dict[Any, dict[str, Any]]:
    return {asset.get("id"): asset for asset in rows if isinstance(asset, dict) and asset.get("id")}


def prospects_by_id(rows: list[Any]) -> dict[str, dict[str, Any]]:
    return {str(prospect.get("id")): prospect for prospect in rows if isinstance(prospect, dict) and prospect.get("id")}


def linkable_assets_payload(assets: list[dict[str, Any]], limit: int = 100) -> dict[str, list[dict[str, Any]]]:
    return {"assets": assets[:limit]}


def outreach_send_enabled(env: Mapping[str, str]) -> bool:
    return env.get("ENABLE_OUTREACH_SEND", "false").lower() == "true"


def smtp_adapter_ready(env: Mapping[str, str]) -> bool:
    return bool(env.get("SMTP_HOST") and env.get("OUTREACH_SENDER_EMAIL"))
