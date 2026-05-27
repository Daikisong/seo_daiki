from __future__ import annotations


def internal_link_plan(article_type: str, category: str) -> list[dict[str, str]]:
    base_plan = [
        {
            "target_type": "hub",
            "anchor_hint": f"{category} hub",
            "reason": "category_hub",
            "score_signal": "same_locale_score + same_category_score",
        },
        {
            "target_type": "data_or_lab",
            "anchor_hint": "measurement table or lab note",
            "reason": "data",
            "score_signal": "same_claim_score",
        },
        {
            "target_type": "risk",
            "anchor_hint": "country import risk",
            "reason": "risk",
            "score_signal": "risk_overlap_score",
        },
        {
            "target_type": "compare",
            "anchor_hint": "similar price-band alternative",
            "reason": "compare",
            "score_signal": "alternative_price_band_score",
        },
        {
            "target_type": "guide",
            "anchor_hint": "buyer problem guide",
            "reason": "guide",
            "score_signal": "same_problem_score",
        },
    ]
    if article_type == "hub":
        return [item for item in base_plan if item["target_type"] != "hub"]
    return base_plan
