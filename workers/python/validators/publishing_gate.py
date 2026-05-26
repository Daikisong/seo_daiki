from __future__ import annotations

from workers.python.common import DATA, read_json, write_json

TOPIC_ARTICLES_PATH = DATA / "exports" / "topic_articles.json"
LOCALIZED_TOPIC_ARTICLES_PATH = DATA / "exports" / "localized_topic_articles.json"
PUBLISHING_GATE_PATH = DATA / "exports" / "topic_publishing_gate.json"


def run_topic_publishing_gate(article_id: str | None = None) -> str:
    articles = read_json(TOPIC_ARTICLES_PATH, {"articles": []}).get("articles", [])
    localized = read_json(LOCALIZED_TOPIC_ARTICLES_PATH, {"articles": []}).get("articles", [])
    results = []
    for article in [*articles, *localized]:
        if article_id and article.get("id") != article_id:
            continue
        blockers = publishing_blockers(article)
        results.append(
            {
                "articleId": article.get("id"),
                "locale": article.get("locale"),
                "type": article.get("type"),
                "status": "blocked" if blockers else "ready_for_manual_review",
                "blockers": blockers,
                "publishStatus": article.get("publishStatus"),
                "indexStatus": article.get("indexStatus"),
                "qualityScore": article.get("qualityScore"),
            }
        )
    return str(write_json(PUBLISHING_GATE_PATH, {"results": results}))


def publishing_blockers(article: dict[str, object]) -> list[str]:
    blockers: list[str] = []
    if article.get("publishStatus") != "pending":
        blockers.append("generated_article_must_start_pending")
    if article.get("indexStatus") not in {"pending", "noindex"}:
        blockers.append("generated_article_must_not_auto_index")
    if int(article.get("qualityScore") or 0) >= 80:
        blockers.append("generated_article_quality_score_should_not_auto_publish")
    if article.get("healthSensitivity") in {"medium", "high"} and article.get("complianceStatus") != "passed":
        blockers.append("health_compliance_manual_approval_required")
    if article.get("translationStatus") == "localized" and int(article.get("localizationDepthScore") or 0) < 80:
        blockers.append("localized_article_depth_below_index_threshold")
    if not article.get("requiredEvidence"):
        blockers.append("required_evidence_missing")
    return blockers
