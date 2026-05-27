from __future__ import annotations

from datetime import datetime, timezone


def split_issues_by_severity(issues: list[dict[str, object]]) -> tuple[list[dict[str, object]], list[dict[str, object]]]:
    blockers = [item for item in issues if item.get("severity") == "blocker"]
    warnings = [item for item in issues if item.get("severity") == "warning"]
    return blockers, warnings


def quality_gate_status(blockers: list[dict[str, object]], warnings: list[dict[str, object]]) -> str:
    if blockers:
        return "blocked"
    if warnings:
        return "pass_with_warnings"
    return "pass"


def build_quality_gate_output(
    packs: list[dict[str, object]],
    inventory: list[object],
    global_issues: list[dict[str, object]],
    evidence_results: list[dict[str, object]],
    generated_at: str | None = None,
) -> dict[str, object]:
    evidence_issues = [issue for result in evidence_results for issue in result.get("issues", [])]
    all_issues = evidence_issues + global_issues
    blockers, warnings = split_issues_by_severity(all_issues)

    return {
        "generated_at": generated_at or datetime.now(timezone.utc).isoformat(),
        "status": quality_gate_status(blockers, warnings),
        "summary": {
            "evidence_packs": len(packs),
            "inventory_urls": len(inventory),
            "blockers": len(blockers),
            "warnings": len(warnings),
        },
        "global_issues": global_issues,
        "evidence_results": evidence_results,
    }


def print_quality_gate_result(output: dict[str, object]) -> None:
    summary = output.get("summary", {})
    blockers = summary.get("blockers", 0) if isinstance(summary, dict) else 0
    warnings = summary.get("warnings", 0) if isinstance(summary, dict) else 0
    if blockers:
        print(f"{blockers} quality-gate blockers need work.")
    elif warnings:
        print(f"Quality gate passed with {warnings} warnings.")
    else:
        print("Quality gate passed.")
