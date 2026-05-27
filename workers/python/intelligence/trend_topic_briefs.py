from __future__ import annotations

from typing import Any


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
