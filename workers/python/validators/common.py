from __future__ import annotations

from typing import Literal, TypedDict

Severity = Literal["blocker", "warning"]


class ValidationIssue(TypedDict):
    code: str
    message: str
    severity: Severity


def issue(code: str, message: str, severity: Severity = "blocker") -> ValidationIssue:
    return {"code": code, "message": message, "severity": severity}


def has_blocker(issues: list[ValidationIssue]) -> bool:
    return any(item["severity"] == "blocker" for item in issues)

