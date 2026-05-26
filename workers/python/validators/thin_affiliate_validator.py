from __future__ import annotations

from workers.python.validators.common import ValidationIssue, issue


def validate_thin_affiliate(pack: dict[str, object], draft_text: str = "") -> list[ValidationIssue]:
    signals = 0
    signals += 1 if pack.get("seller_claims") else 0
    signals += 1 if pack.get("variants") else 0
    signals += 1 if pack.get("price_snapshots") or pack.get("price_truth") else 0
    signals += 1 if pack.get("market_risks") else 0
    signals += 1 if pack.get("review_signals") else 0
    signals += 1 if pack.get("verified_claims") else 0

    issues: list[ValidationIssue] = []
    if signals < 4:
        issues.append(
            issue(
                "thin_affiliate_risk",
                "Evidence pack needs at least four original-value signals, such as variants, price truth, review signals, and locale risk.",
            )
        )

    product = pack.get("product") if isinstance(pack.get("product"), dict) else {}
    title = str(product.get("title", "")).strip()
    if title and draft_text.lower().count(title.lower()) > 4:
        issues.append(
            issue(
                "seller_title_overused",
                "Draft repeats the seller title too often; rewrite around evidence instead of listing copy.",
                "warning",
            )
        )

    return issues

