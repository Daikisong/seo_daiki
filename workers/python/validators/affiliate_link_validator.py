from __future__ import annotations

from workers.python.validators.common import ValidationIssue, issue


def validate_affiliate_pack(pack: dict[str, object]) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    affiliate_urls: list[str] = []

    product = pack.get("product")
    if isinstance(product, dict) and product.get("affiliate_url"):
        affiliate_urls.append(str(product["affiliate_url"]))

    for variant in pack.get("variants", []):
        if isinstance(variant, dict) and variant.get("affiliate_url"):
            affiliate_urls.append(str(variant["affiliate_url"]))

    if not affiliate_urls:
        issues.append(
            issue(
                "affiliate_url_missing",
                "No affiliate URL is attached to this evidence pack yet; web pages can still use placeholders, but production review pages need tracked outbound links.",
                "warning",
            )
        )

    for url in affiliate_urls:
        if not url.startswith(("https://", "http://")):
            issues.append(issue("affiliate_url_invalid", f"Affiliate URL must be absolute: {url}"))

    return issues

