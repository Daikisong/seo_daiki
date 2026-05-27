from __future__ import annotations

from typing import Any


def comparison_rows(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows = []
    for candidate in candidates:
        rows.append(
            {
                "candidateId": candidate.get("id"),
                "title": candidate.get("title"),
                "merchant": candidate.get("sourceMerchant"),
                "matchReason": candidate.get("reason"),
                "verifyBeforeLinking": "; ".join(candidate.get("evidenceNeededJson", [])),
                "riskLevel": "high" if float(candidate.get("riskScore") or 0) >= 60 else "medium",
            }
        )
    return rows


def pros_cons(candidates: list[dict[str, Any]]) -> dict[str, list[str]]:
    return {
        "pros": [f"{candidate.get('title')}: relevant to article problem" for candidate in candidates],
        "cons": ["All candidates require human verification before links or claims."],
    }


def risk_notes(candidates: list[dict[str, Any]]) -> list[str]:
    notes = []
    for candidate in candidates:
        notes.append(f"{candidate.get('title')}: risk score {candidate.get('riskScore')}; verify policy and claims.")
    return notes
