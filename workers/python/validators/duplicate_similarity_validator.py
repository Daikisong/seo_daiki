from __future__ import annotations

from difflib import SequenceMatcher
import re

from workers.python.validators.common import ValidationIssue, issue


def validate_duplicate_similarity(packs: list[dict[str, object]]) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    seen_keys: set[tuple[str, str]] = set()

    for pack in packs:
        product_id = str(pack.get("product_id", ""))
        locale = str(pack.get("locale", ""))
        key = (locale, product_id)
        if key in seen_keys:
            issues.append(issue("duplicate_pack", f"Duplicate evidence pack for {locale}/{product_id}."))
        seen_keys.add(key)

    compared_pairs: set[tuple[str, str]] = set()
    for index, left in enumerate(packs):
        left_product = left.get("product") if isinstance(left.get("product"), dict) else {}
        left_title = str(left_product.get("title", ""))
        for right in packs[index + 1 :]:
            if left.get("product_id") == right.get("product_id"):
                continue
            pair = tuple(sorted([str(left.get("product_id")), str(right.get("product_id"))]))
            if pair in compared_pairs:
                continue
            compared_pairs.add(pair)
            right_product = right.get("product") if isinstance(right.get("product"), dict) else {}
            right_title = str(right_product.get("title", ""))
            if not left_title or not right_title:
                continue
            if _numeric_claims(left_title) != _numeric_claims(right_title):
                continue
            similarity = SequenceMatcher(None, left_title.lower(), right_title.lower()).ratio()
            if similarity >= 0.92:
                issues.append(
                    issue(
                        "product_title_too_similar",
                        f"Product titles look near-duplicate: {left.get('product_id')} and {right.get('product_id')}",
                        "warning",
                    )
                )

    return issues


def _numeric_claims(value: str) -> set[str]:
    return set(re.findall(r"\b\d+(?:\.\d+)?\s*(?:w|mah|nm)\b", value.lower()))
