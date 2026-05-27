from __future__ import annotations

from workers.python.validators.affiliate_link_validator import validate_affiliate_pack
from workers.python.validators.claim_evidence_validator import validate_claim_evidence
from workers.python.validators.common import ValidationIssue, has_blocker, issue
from workers.python.validators.hallucination_guard import content_text_for_validation, forbidden_claim_issues
from workers.python.validators.locale_depth_validator import validate_locale_depth
from workers.python.validators.schema_validator import validate_evidence_schema
from workers.python.validators.thin_affiliate_validator import validate_thin_affiliate


def validate_quality_pack(pack: dict[str, object], draft_text: str) -> dict[str, object]:
    locale = str(pack.get("locale", ""))
    content_text = content_text_for_validation(draft_text)
    issues: list[ValidationIssue] = [
        *validate_evidence_schema(pack),
        *validate_claim_evidence(pack, content_text),
        *validate_thin_affiliate(pack, content_text),
        *validate_locale_depth(pack),
        *validate_affiliate_pack(pack),
        *validate_hallucinations(pack, content_text),
    ]

    warning_count = len([item for item in issues if item["severity"] == "warning"])
    blocker_count = len([item for item in issues if item["severity"] == "blocker"])
    score = max(0, 100 - blocker_count * 20 - warning_count * 5)
    index_status = "noindex" if has_blocker(issues) else "pending" if warning_count else "index"

    return {
        "product_id": pack.get("product_id"),
        "locale": locale,
        "source_file": pack.get("_source_file"),
        "score": score,
        "index_status": index_status,
        "issues": issues,
    }


def validate_hallucinations(pack: dict[str, object], draft_text: str) -> list[ValidationIssue]:
    forbidden = [str(item) for item in pack.get("forbidden_claims", []) if item]
    return [
        issue("forbidden_claim_in_draft", message)
        for message in forbidden_claim_issues(draft_text, forbidden)
    ]
