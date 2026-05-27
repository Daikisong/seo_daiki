from __future__ import annotations

from typing import Any

from workers.python.writers.article_outline_value_utils import string_value


def evidence_refs_for_pack(
    seller_claims: list[dict[str, Any]],
    verified_claims: list[dict[str, Any]],
    variants: list[dict[str, Any]],
    price_truth: list[dict[str, Any]],
    market_risks: list[dict[str, Any]],
    review_signals: list[dict[str, Any]],
) -> dict[str, list[str]]:
    return {
        "seller_claims": [
            f"seller_claim:{string_value(claim.get('claim_type'))}:{string_value(claim.get('claim_value'))}"
            for claim in seller_claims
        ],
        "verified_claims": [
            f"verified_claim:{string_value(claim.get('test_type'))}:{string_value(claim.get('result_value'))}"
            for claim in verified_claims
        ],
        "variants": [f"variant:{string_value(variant.get('option'))}" for variant in variants],
        "price_truth": [f"price_truth:{string_value(row.get('current_zone'))}" for row in price_truth],
        "market_risks": [
            f"market_risk:{string_value(risk.get('country')) or string_value(risk.get('locale'))}:{string_value(risk.get('return_risk'))}"
            for risk in market_risks
        ],
        "review_signals": [
            f"review_signal:{string_value(signal.get('topic'))}:{string_value(signal.get('sentiment'))}"
            for signal in review_signals
        ],
    }
