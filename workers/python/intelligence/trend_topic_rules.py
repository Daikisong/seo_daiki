from __future__ import annotations

from collections import Counter
import re
from statistics import mean
from typing import Any

from workers.python.common import slugify


def clean(value: Any) -> str:
    return str(value or "").strip()


def score(value: Any) -> float:
    try:
        return max(0.0, min(100.0, float(value)))
    except (TypeError, ValueError):
        return 0.0


def cluster_key(signal: dict[str, Any]) -> str:
    topic = clean(signal.get("topicRaw")) or clean(signal.get("query"))
    stop_words = {"best", "review", "reviews", "buy", "price", "deal", "deals", "vs", "2026"}
    words = [word for word in re.findall(r"[a-z0-9]+", topic.lower()) if word not in stop_words]
    return slugify(" ".join(words)) or slugify(topic)


def canonical_topic_for(signals: list[dict[str, Any]]) -> str:
    names = [clean(signal.get("topicRaw")) or clean(signal.get("query")) for signal in signals]
    return Counter(names).most_common(1)[0][0]


def infer_intent(text: str) -> str:
    normalized = text.lower()
    if looks_health_related(normalized):
        return "health"
    if any(token in normalized for token in [" vs ", "compare", "comparison", "alternative"]):
        return "comparison"
    if any(token in normalized for token in ["deal", "coupon", "discount", "price drop"]):
        return "deal"
    if any(token in normalized for token in ["fake", "risk", "avoid", "safe", "problem"]):
        return "problem"
    if any(token in normalized for token in ["best", "buy", "review"]):
        return "commercial"
    return "informational"


def looks_health_related(text: str) -> bool:
    return any(token in text.lower() for token in ["iherb", "supplement", "vitamin", "probiotic", "magnesium", "sleep", "gut health"])


def signal_weight(signal: dict[str, Any]) -> float:
    return round((score(signal.get("growthScore")) + score(signal.get("commercialScore")) + score(signal.get("affiliateFitScore"))) / 300, 3)


def score_breakdown(signals: list[dict[str, Any]]) -> dict[str, float]:
    if not signals:
        return {
            "growthScore": 0,
            "commercialScore": 0,
            "evidenceFitScore": 0,
            "affiliateFitScore": 0,
            "lowCompetitionScore": 0,
            "freshnessScore": 0,
        }

    return {
        "growthScore": round(mean(score(item.get("growthScore")) for item in signals), 2),
        "commercialScore": round(mean(score(item.get("commercialScore")) for item in signals), 2),
        "evidenceFitScore": round(mean(score(item.get("evidenceFitScore")) for item in signals), 2),
        "affiliateFitScore": round(mean(score(item.get("affiliateFitScore")) for item in signals), 2),
        "lowCompetitionScore": round(100 - mean(score(item.get("competitionScore")) for item in signals), 2),
        "freshnessScore": round(mean(score(item.get("freshnessScore")) for item in signals), 2),
    }


def article_type_for_intent(intent: str) -> str:
    return {
        "comparison": "compare",
        "deal": "deal_watch",
        "health": "ingredient_guide",
        "problem": "guide",
        "commercial": "buyer_guide",
    }.get(intent, "trend")


def health_sensitivity_for(topic: dict[str, Any]) -> str:
    if topic.get("healthSensitive"):
        return "high" if topic["score"] >= 70 else "medium"
    return "none"


def title_candidate(topic: dict[str, Any], article_type: str) -> str:
    prefix = {
        "buyer_guide": "Evidence-first buyer guide",
        "deal_watch": "Deal watch",
        "ingredient_guide": "Safety-first ingredient guide",
        "compare": "Comparison guide",
        "guide": "Risk-aware guide",
    }.get(article_type, "Trend brief")
    return f"{prefix}: {topic['canonicalTopic']}"


def outline_for(topic: dict[str, Any], article_type: str) -> list[dict[str, str]]:
    base = [
        {"heading": "Search intent", "purpose": "Explain the user problem and what must be answered."},
        {"heading": "Evidence needed", "purpose": "List claims, product data, and source checks required before drafting."},
        {"heading": "Affiliate fit", "purpose": "Identify merchant categories that can be matched without thin affiliate content."},
        {"heading": "Localization notes", "purpose": "Capture country, language, shipping, compliance, and risk differences."},
    ]
    if article_type == "ingredient_guide":
        base.append({"heading": "Health guardrails", "purpose": "Add disclaimer, avoid medical claims, and require manual approval before indexing."})
    return base


def required_evidence_for(topic: dict[str, Any]) -> list[str]:
    evidence = ["search intent source", "merchant offer data", "internal link targets"]
    if topic["intent"] in {"commercial", "comparison", "deal"}:
        evidence.extend(["price snapshot", "seller claim check", "review signal summary"])
    if topic.get("healthSensitive"):
        evidence.extend(["ingredient label source", "health disclaimer", "manual compliance approval"])
    return evidence


def merchant_fit_for(topic: dict[str, Any]) -> dict[str, Any]:
    if topic.get("healthSensitive"):
        return {"preferred": ["iherb"], "requiresHealthClaimGuard": True}
    return {"preferred": ["aliexpress"], "requiresHealthClaimGuard": False}


def localization_notes_for(topic: dict[str, Any]) -> dict[str, Any]:
    return {
        "primaryLocale": topic["primaryLocale"],
        "countrySpecificRisks": ["shipping", "returns", "customs", "local availability"],
        "translationGroupNeeded": True,
    }


def affiliate_match_score(topic: dict[str, Any], merchant: str) -> float:
    base = float(topic.get("score", 0))
    if merchant == "iherb" and topic.get("healthSensitive"):
        return round(min(100, base + 10), 2)
    if merchant == "aliexpress" and topic["intent"] in {"commercial", "comparison", "deal", "problem"}:
        return round(min(100, base + 8), 2)
    return round(base * 0.8, 2)


def match_reason(topic: dict[str, Any], merchant: str) -> str:
    if merchant == "iherb":
        return "Health-sensitive topic; route through iHerb offers only after HealthClaimGuard and manual approval."
    return "Commerce-oriented topic with marketplace offer fit; avoid thin affiliate content by requiring evidence."


def localized_title(title: str, locale: str) -> str:
    prefix = {"en": "Localized draft", "es": "Borrador localizado", "pt-br": "Rascunho localizado"}.get(locale, "Localized draft")
    return f"{prefix}: {title}"


def publishing_blockers(brief: dict[str, Any], matches: list[dict[str, Any]]) -> list[str]:
    blockers = []
    if not brief.get("requiredEvidence"):
        blockers.append("required_evidence_missing")
    if not brief.get("outlineJson"):
        blockers.append("outline_missing")
    if brief.get("articleType") in {"buyer_guide", "deal_watch", "ingredient_guide"} and not matches:
        blockers.append("affiliate_offer_match_missing")
    if (brief.get("healthSensitivity") or "none") != "none":
        required = " ".join(str(item).lower() for item in brief.get("requiredEvidence", []))
        merchant_fit = brief.get("merchantFitJson", {})
        if "health disclaimer" not in required:
            blockers.append("health_disclaimer_requirement_missing")
        if not isinstance(merchant_fit, dict) or not merchant_fit.get("requiresHealthClaimGuard"):
            blockers.append("health_claim_guard_requirement_missing")
    return blockers
