from __future__ import annotations

from workers.python.validators.common import ValidationIssue, issue

REQUIRED_PACK_LISTS = [
    "variants",
    "seller_claims",
    "verified_claims",
    "review_signals",
    "price_snapshots",
    "market_risks",
    "allowed_claims",
    "forbidden_claims",
]

REQUIRED_PRODUCT_FIELDS = ["product_id", "title", "source_url", "price", "currency", "category"]


def validate_evidence_schema(pack: dict[str, object]) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    product = pack.get("product")
    if not isinstance(product, dict):
        return [issue("product_missing", "Evidence pack is missing a product object.")]

    for field in REQUIRED_PRODUCT_FIELDS:
        if product.get(field) in (None, ""):
            issues.append(issue("product_field_missing", f"Product is missing required field: {field}"))

    for field in REQUIRED_PACK_LISTS:
        if not isinstance(pack.get(field), list):
            issues.append(issue("pack_list_invalid", f"Evidence pack field must be a list: {field}"))

    price = product.get("price")
    if not isinstance(price, int | float):
        issues.append(issue("product_price_invalid", "Product price must be numeric."))

    for snapshot in pack.get("price_snapshots", []):
        if not isinstance(snapshot, dict):
            issues.append(issue("price_snapshot_invalid", "Price snapshot rows must be objects."))
            continue
        if not isinstance(snapshot.get("final_price"), int | float):
            issues.append(
                issue(
                    "final_price_missing",
                    "Price snapshot should include a numeric final_price so price-truth pages can compare landed cost.",
                    "warning",
                )
            )

    return issues

