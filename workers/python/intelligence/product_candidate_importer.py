from __future__ import annotations

from pathlib import Path

from workers.python.common import DATA, read_csv, slugify, write_json
from workers.python.intelligence.product_candidate_paths import PRODUCT_CANDIDATES_PATH, now
from workers.python.intelligence.product_candidate_rules import (
    candidate_score_breakdown,
    candidate_score_from_breakdown,
    clean,
    evidence_needed,
    risk_score,
)


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
