from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
import re
from statistics import mean
from typing import Any

from workers.python.common import DATA, read_csv, read_json, slugify, write_json

TREND_SIGNALS_PATH = DATA / "snapshots" / "trend_signals.json"
TOPIC_CLUSTERS_PATH = DATA / "snapshots" / "topic_clusters.json"
TOPIC_SCORES_PATH = DATA / "snapshots" / "topic_scores.json"
CONTENT_BRIEFS_PATH = DATA / "briefs" / "content_briefs.json"
OFFER_MATCHES_PATH = DATA / "snapshots" / "affiliate_offer_matches.json"


def collect_trend_signals(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "trend-signals.csv"
    return import_trend_signals(seed_path)


def import_trend_signals(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "trend-signals.csv"
    rows = read_csv(seed_path)
    sources: dict[str, dict[str, Any]] = {}
    signals: list[dict[str, Any]] = []

    for index, row in enumerate(rows, start=1):
        source_slug = clean(row.get("source_slug")) or "manual-csv"
        source = sources.setdefault(
            source_slug,
            {
                "id": f"trend-source-{source_slug}",
                "name": clean(row.get("source_name")) or source_slug.replace("-", " ").title(),
                "slug": source_slug,
                "sourceType": clean(row.get("source_type")) or "manual_csv",
                "locale": clean(row.get("source_locale")) or clean(row.get("locale")) or None,
                "country": clean(row.get("source_country")) or clean(row.get("country")) or None,
                "enabled": True,
                "configJson": {"import_file": str(seed_path)}
            },
        )
        locale = clean(row.get("locale")) or source.get("locale") or "en"
        query = clean(row.get("query"))
        topic_raw = clean(row.get("topic_raw")) or query
        captured_at = clean(row.get("captured_at")) or datetime.now(timezone.utc).isoformat()
        signal_id = f"trend-signal-{slugify(f'{source_slug} {locale} {query} {index}')}"

        signals.append(
            {
                "id": signal_id,
                "sourceId": source["id"],
                "locale": locale,
                "country": clean(row.get("country")) or source.get("country"),
                "query": query,
                "topicRaw": topic_raw,
                "url": clean(row.get("url")) or None,
                "volumeScore": score(row.get("volume_score")),
                "growthScore": score(row.get("growth_score")),
                "competitionScore": score(row.get("competition_score")),
                "commercialScore": score(row.get("commercial_score")),
                "freshnessScore": score(row.get("freshness_score")),
                "evidenceFitScore": score(row.get("evidence_fit_score")),
                "affiliateFitScore": score(row.get("affiliate_fit_score")),
                "capturedAt": captured_at,
            }
        )

    return str(write_json(TREND_SIGNALS_PATH, {"sources": list(sources.values()), "signals": signals}))


def cluster_topics() -> str:
    payload = read_json(TREND_SIGNALS_PATH, {"signals": []})
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for signal in payload.get("signals", []):
        key = cluster_key(signal)
        grouped[key].append(signal)

    topics: list[dict[str, Any]] = []
    topic_signals: list[dict[str, Any]] = []
    for key, signals in sorted(grouped.items()):
        canonical_topic = canonical_topic_for(signals)
        slug = slugify(canonical_topic)
        topic_id = f"topic-{slug}"
        intent = infer_intent(" ".join(str(item.get("query", "")) for item in signals))
        health_sensitive = intent == "health" or any(looks_health_related(str(item.get("topicRaw", ""))) for item in signals)
        locale_counts = Counter(str(item.get("locale", "en")) for item in signals)

        topics.append(
            {
                "id": topic_id,
                "canonicalTopic": canonical_topic,
                "slug": slug,
                "cluster": key,
                "primaryLocale": locale_counts.most_common(1)[0][0],
                "intent": intent,
                "healthSensitive": health_sensitive,
                "status": "candidate",
                "score": 0,
                "scoreBreakdown": {},
                "signalCount": len(signals),
            }
        )
        for signal in signals:
            signal_id = signal["id"]
            topic_signals.append(
                {
                    "id": f"topic-signal-{slugify(f'{topic_id} {signal_id}')}",
                    "topicId": topic_id,
                    "trendSignalId": signal_id,
                    "weight": signal_weight(signal),
                }
            )

    return str(write_json(TOPIC_CLUSTERS_PATH, {"topics": topics, "topicSignals": topic_signals}))


def score_topics() -> str:
    cluster_payload = read_json(TOPIC_CLUSTERS_PATH, {"topics": [], "topicSignals": []})
    signal_payload = read_json(TREND_SIGNALS_PATH, {"signals": []})
    signal_by_id = {signal["id"]: signal for signal in signal_payload.get("signals", [])}
    signals_by_topic: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for link in cluster_payload.get("topicSignals", []):
        signal = signal_by_id.get(link["trendSignalId"])
        if signal:
            signals_by_topic[link["topicId"]].append(signal)

    scored_topics = []
    for topic in cluster_payload.get("topics", []):
        signals = signals_by_topic.get(topic["id"], [])
        breakdown = score_breakdown(signals)
        score_value = round(
            breakdown["growthScore"] * 0.25
            + breakdown["commercialScore"] * 0.20
            + breakdown["evidenceFitScore"] * 0.20
            + breakdown["affiliateFitScore"] * 0.15
            + breakdown["lowCompetitionScore"] * 0.10
            + breakdown["freshnessScore"] * 0.10,
            2,
        )
        scored_topics.append({**topic, "score": score_value, "scoreBreakdown": breakdown})

    scored_topics.sort(key=lambda item: item["score"], reverse=True)
    return str(write_json(TOPIC_SCORES_PATH, {"topics": scored_topics, "topicSignals": cluster_payload.get("topicSignals", [])}))


def generate_content_briefs() -> str:
    payload = read_json(TOPIC_SCORES_PATH, {"topics": []})
    briefs = []
    for topic in payload.get("topics", []):
        article_type = article_type_for_intent(topic["intent"])
        health_sensitivity = health_sensitivity_for(topic)
        briefs.append(
            {
                "id": f"brief-{topic['slug']}-{topic['primaryLocale']}",
                "topicId": topic["id"],
                "locale": topic["primaryLocale"],
                "articleType": article_type,
                "titleCandidate": title_candidate(topic, article_type),
                "h1Candidate": title_candidate(topic, article_type),
                "searchIntent": topic["intent"],
                "outlineJson": outline_for(topic, article_type),
                "requiredEvidence": required_evidence_for(topic),
                "merchantFitJson": merchant_fit_for(topic),
                "localizationNotes": localization_notes_for(topic),
                "healthSensitivity": health_sensitivity,
                "status": "draft",
                "score": topic["score"],
            }
        )
    return str(write_json(CONTENT_BRIEFS_PATH, {"briefs": briefs}))


def match_affiliate_offers() -> str:
    payload = read_json(TOPIC_SCORES_PATH, {"topics": []})
    matches = []
    for topic in payload.get("topics", []):
        merchants = ["iherb"] if topic.get("healthSensitive") else ["aliexpress"]
        if topic["intent"] in {"comparison", "deal", "commercial"} and "aliexpress" not in merchants:
            merchants.append("aliexpress")
        for merchant in merchants:
            matches.append(
                {
                    "topicId": topic["id"],
                    "topicSlug": topic["slug"],
                    "merchantSlug": merchant,
                    "matchScore": affiliate_match_score(topic, merchant),
                    "status": "candidate",
                    "reason": match_reason(topic, merchant),
                }
            )
    matches.sort(key=lambda item: item["matchScore"], reverse=True)
    return str(write_json(OFFER_MATCHES_PATH, {"matches": matches}))


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
