from __future__ import annotations

from workers.python.intelligence.product_candidate_risk_evidence import risk_score
from workers.python.intelligence.product_candidate_values import score


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
