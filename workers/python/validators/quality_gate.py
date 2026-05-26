from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from workers.python.common import DATA, read_json, write_json
from workers.python.validators.affiliate_link_validator import validate_affiliate_pack
from workers.python.validators.claim_evidence_validator import validate_claim_evidence
from workers.python.validators.common import ValidationIssue, has_blocker, issue
from workers.python.validators.duplicate_similarity_validator import validate_duplicate_similarity
from workers.python.validators.hallucination_guard import content_text_for_validation, forbidden_claim_issues
from workers.python.validators.hreflang_validator import validate_hreflang_inventory
from workers.python.validators.internal_link_validator import validate_internal_link_inventory
from workers.python.validators.locale_depth_validator import validate_locale_depth
from workers.python.validators.schema_validator import validate_evidence_schema
from workers.python.validators.thin_affiliate_validator import validate_thin_affiliate


def run_quality_gate() -> str:
    packs = _load_evidence_packs()
    inventory = read_json(DATA / "exports" / "initial_url_inventory.json", [])
    global_issues = [
        *validate_duplicate_similarity(packs),
        *validate_hreflang_inventory(inventory),
        *validate_internal_link_inventory(inventory),
    ]

    evidence_results = [_validate_pack(pack) for pack in packs]
    all_issues = [issue for result in evidence_results for issue in result["issues"]] + global_issues
    blockers = [item for item in all_issues if item["severity"] == "blocker"]
    warnings = [item for item in all_issues if item["severity"] == "warning"]

    output = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "status": "blocked" if blockers else "pass_with_warnings" if warnings else "pass",
        "summary": {
            "evidence_packs": len(packs),
            "inventory_urls": len(inventory),
            "blockers": len(blockers),
            "warnings": len(warnings),
        },
        "global_issues": global_issues,
        "evidence_results": evidence_results,
    }

    path = DATA / "exports" / "quality_gate.json"
    write_json(path, output)
    if blockers:
        print(f"{len(blockers)} quality-gate blockers need work.")
    elif warnings:
        print(f"Quality gate passed with {len(warnings)} warnings.")
    else:
        print("Quality gate passed.")
    return str(path)


def _load_evidence_packs() -> list[dict[str, object]]:
    packs: list[dict[str, object]] = []
    for path in sorted((DATA / "evidence_packs").glob("*.json")):
        for pack in read_json(path, []):
            if isinstance(pack, dict):
                packs.append({**pack, "_source_file": str(path.relative_to(DATA))})
    return packs


def _validate_pack(pack: dict[str, object]) -> dict[str, object]:
    locale = str(pack.get("locale", ""))
    draft_text = _read_draft(locale)
    content_text = content_text_for_validation(draft_text)
    issues: list[ValidationIssue] = [
        *validate_evidence_schema(pack),
        *validate_claim_evidence(pack, content_text),
        *validate_thin_affiliate(pack, content_text),
        *validate_locale_depth(pack),
        *validate_affiliate_pack(pack),
        *_validate_hallucinations(pack, content_text),
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


def _read_draft(locale: str) -> str:
    paths = sorted((DATA / "drafts").glob(f"{locale}-*.md"))
    return "\n\n".join(_read_text(path) for path in paths)


def _read_text(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


def _validate_hallucinations(pack: dict[str, object], draft_text: str) -> list[ValidationIssue]:
    forbidden = [str(item) for item in pack.get("forbidden_claims", []) if item]
    return [
        issue("forbidden_claim_in_draft", message)
        for message in forbidden_claim_issues(draft_text, forbidden)
    ]

