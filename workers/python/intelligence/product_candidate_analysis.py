from __future__ import annotations

from workers.python.common import read_json, slugify, write_json
from workers.python.intelligence.product_candidate_paths import (
    PRODUCT_ANALYSIS_PATH,
    PRODUCT_CANDIDATES_PATH,
    TEST_ARTICLES_PATH,
    now,
)
from workers.python.intelligence.product_candidate_rules import (
    comparison_rows,
    pros_cons,
    risk_notes,
)


def analyze_product_candidates(article_id: str | None = None) -> str:
    articles = read_json(TEST_ARTICLES_PATH, {"articles": []}).get("articles", [])
    candidates = read_json(PRODUCT_CANDIDATES_PATH, {"candidates": []}).get("candidates", [])
    analyses = []
    for article in articles:
        if not isinstance(article, dict) or (article_id and article.get("id") != article_id and article.get("articleId") != article_id):
            continue
        article_candidates = [
            candidate
            for candidate in candidates
            if isinstance(candidate, dict)
            and candidate.get("market") == article.get("market")
            and candidate.get("language") == article.get("language")
            and (not candidate.get("articleId") or candidate.get("articleId") == article.get("id"))
        ]
        if not article_candidates:
            continue
        selected = selected_product_candidates(article_candidates)
        analyses.append(product_candidate_analysis_record(article, selected))
    return str(write_json(PRODUCT_ANALYSIS_PATH, {"analyses": analyses}))


def selected_product_candidates(candidates: list[dict[str, object]]) -> list[dict[str, object]]:
    return sorted(candidates, key=lambda item: float(item.get("relevanceScore") or 0), reverse=True)[:5]


def product_candidate_analysis_record(
    article: dict[str, object],
    selected: list[dict[str, object]],
) -> dict[str, object]:
    return {
        "id": f"product-analysis-{slugify(str(article.get('id')))}",
        "articleId": article.get("id"),
        "market": article.get("market"),
        "language": article.get("language"),
        "candidatesJson": selected,
        "comparisonJson": comparison_rows(selected),
        "prosConsJson": pros_cons(selected),
        "riskNotesJson": risk_notes(selected),
        "recommendedUseJson": {
            "blockTitle": "Relevant product candidates",
            "placement": "analysis_block_only",
            "linking": "do_not_link_yet",
            "nextStep": "Human review must verify policy, claims, price, and availability.",
        },
        "monetizationReadiness": "human_review_required",
        "status": "do_not_link_yet",
        "createdAt": now(),
    }
