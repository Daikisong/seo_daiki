from __future__ import annotations

import os
from typing import Any
from urllib.parse import urlparse

LINKABLE_TYPES = {"data", "lab", "methodology", "guide", "compare", "hub", "buyer_guide"}
SPAM_RISK_DOMAINS = {"example-spam.test", "paid-links.test", "directory-submit.test"}


def best_asset_for_prospect(prospect: dict[str, Any], assets: list[dict[str, Any]]) -> dict[str, Any] | None:
    topic = str(prospect.get("topic", ""))
    candidates = [asset for asset in assets if isinstance(asset, dict)]
    if prospect.get("suggestedAssetId"):
        for asset in candidates:
            if asset.get("id") == prospect.get("suggestedAssetId"):
                return asset
    return max(
        candidates,
        key=lambda asset: topic_overlap(topic, str(asset.get("topic", ""))) + float(asset.get("linkableScore") or 0) / 10,
        default=None,
    )


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
    address = os.getenv("OUTREACH_PHYSICAL_ADDRESS", "Physical address must be configured before real sends.")
    return (
        f"Hi,\n\n"
        f"I found your page about {prospect.get('topic')}. We maintain an evidence-focused resource that may help as a source:\n"
        f"{asset.get('url')}\n\n"
        "No paid placement or anchor text request is intended. If it is not useful, please ignore this note.\n"
        "To opt out, reply with 'opt out' and this domain/email will be added to the suppression list.\n"
        f"{address}\n\n"
        "Thanks."
    )


def is_suppressed(domain: Any, email: Any, entries: list[dict[str, str]]) -> bool:
    return bool(suppression_reason(domain, email, entries))


def suppression_reason(domain: Any, email: Any, entries: list[dict[str, str]]) -> str:
    normalized_domain = normalize_domain(domain)
    normalized_email = clean(email).lower()
    for entry in entries:
        if entry["email"] and normalized_email == entry["email"]:
            return entry["reason"]
        if entry["domain"] and domain_matches(normalized_domain, entry["domain"]):
            return entry["reason"]
    return ""


def normalize_domain(value: Any) -> str:
    raw = clean(value).lower()
    if not raw:
        return ""
    parsed = urlparse(raw if "://" in raw else f"https://{raw}")
    return (parsed.hostname or raw).removeprefix("www.")


def domain_matches(domain: str, suppressed_domain: str) -> bool:
    return domain == suppressed_domain or domain.endswith(f".{suppressed_domain}")


def words(value: str) -> list[str]:
    return [part for part in value.lower().replace("-", " ").split() if len(part) > 3]


def numeric(value: Any, fallback: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback


def clean(value: Any) -> str:
    return str(value or "").strip()
