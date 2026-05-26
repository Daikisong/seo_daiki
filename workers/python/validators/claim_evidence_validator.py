from __future__ import annotations

import re

from workers.python.validators.common import ValidationIssue, issue


DIRECT_TEST_RE = re.compile(r"\b(we tested|our test|lab measured|verified by test)\b", re.IGNORECASE)


def validate_claim_evidence(pack: dict[str, object], draft_text: str = "") -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    seller_claims = pack.get("seller_claims") or []
    verified_claims = pack.get("verified_claims") or []
    variants = pack.get("variants") or []
    if len(seller_claims) + len(verified_claims) < 1:
        issues.append(issue("claim_ledger_missing", "No seller or verified claim ledger exists for this product."))
    if not variants:
        issues.append(issue("variant_evidence_missing", "No variant-trap evidence exists for this product."))
    if draft_text and DIRECT_TEST_RE.search(draft_text) and not verified_claims:
        issues.append(
            issue(
                "direct_test_claim_without_evidence",
                "Draft uses direct testing language, but the evidence pack has no verified claims.",
            )
        )
    if not verified_claims:
        issues.append(
            issue(
                "verified_claims_missing",
                "No verified claims are attached yet; keep direct-test wording out of generated content.",
                "warning",
            )
        )
    return issues
