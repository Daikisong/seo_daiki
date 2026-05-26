from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from workers.python.common import DATA, read_json, slugify, write_json
from workers.python.writers.llm_provider import get_provider

CONTENT_BRIEFS_PATH = DATA / "briefs" / "content_briefs.json"
PLACEMENT_CANDIDATES_PATH = DATA / "exports" / "affiliate_placement_candidates.json"
TOPIC_ARTICLES_PATH = DATA / "exports" / "topic_articles.json"


def generate_topic_article(topic_id: str | None = None, brief_id: str | None = None, locale: str | None = None) -> str:
    briefs = read_json(CONTENT_BRIEFS_PATH, {"briefs": []}).get("briefs", [])
    placement_payload = read_json(PLACEMENT_CANDIDATES_PATH, {"placementCandidates": []})
    placements = placement_payload.get("placementCandidates", [])
    provider = get_provider()
    articles = []

    for brief in briefs:
        if topic_id and brief.get("topicId") != topic_id:
            continue
        if brief_id and brief.get("id") != brief_id:
            continue
        if locale and brief.get("locale") != locale:
            continue

        article_id = f"draft-article-{slugify(str(brief['id']))}"
        matching_placements = [placement for placement in placements if placement.get("briefId") == brief.get("id")]
        prompt = topic_article_prompt(brief, matching_placements)
        generated_note = provider.generate(prompt)
        quality_score = computed_quality_score(brief, matching_placements)
        health_sensitivity = "high" if brief.get("healthSensitivity") == "high" else "medium" if brief.get("healthSensitivity") == "medium" else "none"
        article = {
            "id": article_id,
            "topicId": brief.get("topicId"),
            "briefId": brief.get("id"),
            "locale": brief.get("locale"),
            "slug": slugify(str(brief.get("titleCandidate", article_id)))[:90],
            "type": brief.get("articleType"),
            "title": brief.get("titleCandidate"),
            "h1": brief.get("h1Candidate") or brief.get("titleCandidate"),
            "metaDescription": f"Draft generated from brief {brief.get('id')}; requires evidence, compliance, and publishing gate review.",
            "summary": brief.get("searchIntent"),
            "sections": brief.get("outlineJson", []),
            "requiredEvidence": brief.get("requiredEvidence", []),
            "affiliatePlacementCandidates": matching_placements,
            "qualityScore": quality_score,
            "publishStatus": "pending",
            "indexStatus": "pending",
            "healthSensitivity": health_sensitivity,
            "complianceStatus": "manual_required" if health_sensitivity in {"medium", "high"} else "unchecked",
            "generatedNote": generated_note,
            "createdAt": datetime.now(timezone.utc).isoformat(),
        }
        articles.append(article)
        write_markdown_article(article)

    existing = read_json(TOPIC_ARTICLES_PATH, {"articles": []}).get("articles", [])
    existing_by_id = {article["id"]: article for article in existing}
    for article in articles:
        existing_by_id[article["id"]] = article

    return str(write_json(TOPIC_ARTICLES_PATH, {"articles": list(existing_by_id.values())}))


def topic_article_prompt(brief: dict[str, Any], placements: list[dict[str, Any]]) -> str:
    return (
        "Generate a guarded article draft only from this ContentBrief and placement candidates. "
        "Do not invent prices, discounts, tests, certifications, product specs, reviews, health claims, or personal experience. "
        "Include update log, affiliate disclosure when offers exist, local market notes, and health disclaimer if needed.\n\n"
        f"BRIEF={brief}\nPLACEMENTS={placements}"
    )


def computed_quality_score(brief: dict[str, Any], placements: list[dict[str, Any]]) -> int:
    score = 55
    if brief.get("outlineJson"):
        score += 10
    if len(brief.get("requiredEvidence", [])) >= 3:
        score += 10
    if placements:
        score += 5
    if brief.get("healthSensitivity") != "none":
        score -= 5
    return max(0, min(79, score))


def write_markdown_article(article: dict[str, Any]) -> None:
    path = DATA / "drafts" / f"{article['id']}.md"
    lines = [
        f"# {article['title']}",
        "",
        f"Locale: {article['locale']}",
        f"Type: {article['type']}",
        f"Publish status: {article['publishStatus']}",
        f"Index status: {article['indexStatus']}",
        f"Quality score: {article['qualityScore']}",
        "",
        "## Sections",
        *(f"- {section.get('heading')}: {section.get('purpose')}" for section in article.get("sections", [])),
        "",
        "## Required evidence",
        *(f"- {item}" for item in article.get("requiredEvidence", [])),
        "",
        "## Placement candidates",
        *(f"- {placement.get('anchorText')} ({placement.get('status')})" for placement in article.get("affiliatePlacementCandidates", [])),
    ]
    path.write_text("\n".join(lines), encoding="utf-8")
