from __future__ import annotations

from typing import Any

from workers.python.intelligence.offer_matching_constants import EVIDENCE_LEVEL_SCORE, MERCHANT_TRUST
from workers.python.intelligence.offer_matching_fit import (
    compliance_fit,
    conversion_fit,
    locale_fit,
    price_freshness,
    topical_fit,
)
from workers.python.intelligence.offer_matching_policy import match_reason


def score_offer(topic: dict[str, Any], brief: dict[str, Any], offer: dict[str, Any]) -> dict[str, Any]:
    breakdown = {
        "topicalFit": topical_fit(topic, brief, offer),
        "localeFit": locale_fit(brief, offer),
        "merchantTrust": MERCHANT_TRUST.get(str(offer["merchantSlug"]), 50),
        "evidenceLevel": EVIDENCE_LEVEL_SCORE.get(str(offer["evidenceLevel"]), 45),
        "priceFreshness": price_freshness(offer),
        "conversionFit": conversion_fit(topic, brief, offer),
        "complianceFit": compliance_fit(topic, brief, offer),
    }
    score = round(
        breakdown["topicalFit"] * 0.25
        + breakdown["localeFit"] * 0.15
        + breakdown["merchantTrust"] * 0.15
        + breakdown["evidenceLevel"] * 0.15
        + breakdown["priceFreshness"] * 0.10
        + breakdown["conversionFit"] * 0.10
        + breakdown["complianceFit"] * 0.10,
        2,
    )
    return {
        "offer": offer,
        "offerScore": score,
        "scoreBreakdown": breakdown,
        "reason": match_reason(topic, brief, offer),
    }
