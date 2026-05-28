from __future__ import annotations

from typing import Any
from urllib.parse import urlparse

from workers.python.outreach.link_earning_values import clean


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
