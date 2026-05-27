from __future__ import annotations

from typing import Any

from workers.python.common import slugify


def candidate_score_breakdown(row: dict[str, str]) -> dict[str, float]:
    return {
        "topic_relevance": score(row.get("topic_relevance"), 70),
        "user_problem_fit": score(row.get("user_problem_fit"), 65),
        "market_availability": score(row.get("market_availability"), 60),
        "comparison_value": score(row.get("comparison_value"), 60),
        "evidence_availability": score(row.get("evidence_availability"), 45),
        "price_or_value_hint": score(row.get("price_or_value_hint"), 40),
        "risk_penalty": risk_score(row),
    }


def candidate_score_from_breakdown(score_parts: dict[str, float]) -> float:
    return round(
        score_parts["topic_relevance"] * 0.30
        + score_parts["user_problem_fit"] * 0.20
        + score_parts["market_availability"] * 0.15
        + score_parts["comparison_value"] * 0.15
        + score_parts["evidence_availability"] * 0.10
        + score_parts["price_or_value_hint"] * 0.05
        - score_parts["risk_penalty"] * 0.05,
        2,
    )


def risk_score(row: dict[str, str]) -> float:
    risk = 20
    text = " ".join(str(value).lower() for value in row.values())
    for term in ["health", "supplement", "medical", "counterfeit", "safety", "claims"]:
        if term in text:
            risk += 12
    return min(100, risk)


def evidence_needed(row: dict[str, str]) -> list[str]:
    needs = ["Official product page", "Current price/availability timestamp", "Merchant policy check"]
    text = " ".join(str(value).lower() for value in row.values())
    if any(term in text for term in ["health", "supplement", "magnesium", "gut"]):
        needs.append("Health claim review and supplement disclaimer")
    if any(term in text for term in ["charger", "power bank", "adapter"]):
        needs.append("Safety/certification and spec verification")
    return needs


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


def tokens(value: str) -> list[str]:
    return [token for token in slugify(value).split("-") if len(token) > 3]


def score(value: Any, fallback: float) -> float:
    try:
        return max(0, min(100, float(value)))
    except (TypeError, ValueError):
        return fallback


def clean(value: Any) -> str:
    return str(value or "").strip()
