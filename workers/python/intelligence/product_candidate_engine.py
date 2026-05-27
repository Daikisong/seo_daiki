from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from workers.python.common import DATA, read_csv, read_json, slugify, write_json
from workers.python.intelligence.product_candidate_rules import (
    candidate_score_breakdown,
    candidate_score_from_breakdown,
    clean,
    comparison_rows,
    evidence_needed,
    pros_cons,
    risk_notes,
    risk_score,
    tokens,
)

TEST_ARTICLES_PATH = DATA / "exports" / "test_articles.json"
PRODUCT_CANDIDATES_PATH = DATA / "exports" / "product_candidates.json"
PRODUCT_ANALYSIS_PATH = DATA / "exports" / "product_candidate_analysis.json"


def import_product_candidates(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "product-candidates.csv"
    rows = read_csv(seed_path)
    candidates = []
    for index, row in enumerate(rows, start=1):
        title = clean(row.get("title"))
        market = clean(row.get("market"))
        language = clean(row.get("language"))
        score_parts = candidate_score_breakdown(row)
        score_value = candidate_score_from_breakdown(score_parts)
        candidates.append(
            {
                "id": clean(row.get("id")) or f"product-candidate-{slugify(f'{market} {language} {title} {index}')}",
                "articleId": clean(row.get("article_id")) or None,
                "market": market,
                "language": language,
                "sourceMerchant": clean(row.get("source_merchant")) or "manual",
                "sourceMode": clean(row.get("source_mode")) or "manual_csv_now",
                "title": title,
                "productUrl": clean(row.get("product_url")) or None,
                "candidateUrl": clean(row.get("candidate_url")) or clean(row.get("product_url")) or None,
                "category": clean(row.get("category")) or "unknown",
                "priceText": clean(row.get("price_text")) or None,
                "currency": clean(row.get("currency")) or None,
                "imageUrl": clean(row.get("image_url")) or None,
                "reason": clean(row.get("reason")) or "Manual CSV candidate for post-product-analysis phase.",
                "relevanceScore": score_value,
                "riskScore": risk_score(row),
                "scoreBreakdownJson": score_parts,
                "evidenceNeededJson": evidence_needed(row),
                "status": "analysis_pending",
                "importedAt": now(),
            }
        )
    return str(write_json(PRODUCT_CANDIDATES_PATH, {"candidates": candidates}))


def discover_product_candidates(article_id: str | None = None) -> str:
    articles = read_json(TEST_ARTICLES_PATH, {"articles": []}).get("articles", [])
    candidates = read_json(PRODUCT_CANDIDATES_PATH, {"candidates": []}).get("candidates", [])
    discovered = []
    for article in articles:
        if not isinstance(article, dict) or (article_id and article.get("id") != article_id and article.get("articleId") != article_id):
            continue
        article_text = " ".join(
            [
                str(article.get("title") or ""),
                str(article.get("summary") or ""),
                " ".join(str(section.get("body") or "") for section in article.get("sections", []) if isinstance(section, dict)),
            ]
        ).lower()
        for candidate in candidates:
            if not isinstance(candidate, dict):
                continue
            market_match = candidate.get("market") == article.get("market")
            article_match = candidate.get("articleId") == article.get("id")
            topic_match = any(token and token in article_text for token in tokens(str(candidate.get("title") or "")))
            if market_match and (article_match or (not candidate.get("articleId") and topic_match)):
                discovered.append({**candidate, "articleId": article.get("id"), "status": "discovered"})
    return str(write_json(PRODUCT_CANDIDATES_PATH, {"candidates": discovered or candidates}))


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
        selected = sorted(article_candidates, key=lambda item: float(item.get("relevanceScore") or 0), reverse=True)[:5]
        analyses.append(
            {
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
        )
    return str(write_json(PRODUCT_ANALYSIS_PATH, {"analyses": analyses}))


def build_product_analysis_block(article_id: str | None = None) -> str:
    analyses = read_json(PRODUCT_ANALYSIS_PATH, {"analyses": []}).get("analyses", [])
    blocks = []
    for analysis in analyses:
        if not isinstance(analysis, dict) or (article_id and analysis.get("articleId") != article_id):
            continue
        lines = [
            "## Relevant product candidates",
            "",
            "Do not link yet. These are candidates for human review, not approved monetized placements.",
            "",
            "| Candidate | Why it matches | Verify before linking | Risk |",
            "| --- | --- | --- | --- |",
        ]
        for row in analysis.get("comparisonJson", []):
            if isinstance(row, dict):
                lines.append(
                    f"| {row.get('title')} | {row.get('matchReason')} | {row.get('verifyBeforeLinking')} | {row.get('riskLevel')} |"
                )
        blocks.append({**analysis, "analysisBlockMarkdown": "\n".join(lines)})
    return str(write_json(PRODUCT_ANALYSIS_PATH, {"analyses": blocks}))


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
