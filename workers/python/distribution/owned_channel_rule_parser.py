from __future__ import annotations

from typing import Any

DEFAULT_RULES = [
    {"platform": "x", "locale": "en", "maxPostsPerDay": 2, "requiresHumanApproval": True, "allowDirectLink": True, "requireDisclosure": True, "enabled": True},
    {"platform": "linkedin", "locale": "en", "maxPostsPerDay": 1, "requiresHumanApproval": True, "allowDirectLink": True, "requireDisclosure": True, "enabled": True},
    {"platform": "pinterest", "locale": "en", "maxPostsPerDay": 2, "requiresHumanApproval": True, "allowDirectLink": True, "requireDisclosure": True, "enabled": True},
    {"platform": "reddit", "locale": "en", "maxPostsPerDay": 0, "requiresHumanApproval": True, "allowDirectLink": False, "requireDisclosure": True, "enabled": False},
]


def distribution_rule_from_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "platform": clean(row.get("platform")),
        "locale": clean(row.get("locale")) or "en",
        "maxPostsPerDay": int(float(clean(row.get("max_posts_per_day")) or 0)),
        "requiresHumanApproval": clean(row.get("requires_human_approval")).lower() != "false",
        "allowDirectLink": clean(row.get("allow_direct_link")).lower() != "false",
        "requireDisclosure": clean(row.get("require_disclosure")).lower() != "false",
        "enabled": clean(row.get("enabled")).lower() != "false",
    }


def clean(value: Any) -> str:
    return str(value or "").strip()
