from __future__ import annotations

from typing import Any

from workers.python.common import DATA, read_csv, read_json, slugify, write_json
from workers.python.serp.analysis_rules import (
    clean,
    inferred_headings,
    infer_intent,
    integer,
    missing_angles,
    monetization_pattern,
    split_list,
    truthy,
)
from workers.python.serp.serp_artifacts import (
    SERP_ANALYSIS_PATH,
    SERP_RESULTS_PATH,
    keyword_for_snapshot,
    language_for_snapshot,
    market_for_snapshot,
    now,
)


def analyze_serp_pages(snapshot_id: str | None = None) -> str:
    serp_payload = read_json(SERP_RESULTS_PATH, {"snapshots": [], "results": []})
    summary_rows = read_csv(DATA / "seeds" / "competitor-page-summaries.csv") if (DATA / "seeds" / "competitor-page-summaries.csv").exists() else []
    summary_by_url = {clean(row.get("url")): row for row in summary_rows}
    analyses = []
    for result in serp_payload.get("results", []):
        if not isinstance(result, dict) or (snapshot_id and result.get("snapshotId") != snapshot_id):
            continue
        summary = summary_by_url.get(str(result.get("url")), {})
        headings = split_list(summary.get("headings")) or inferred_headings(result)
        analysis = {
            "id": f"competitor-analysis-{slugify(str(result.get('id')))}",
            "serpResultId": result.get("id"),
            "market": market_for_snapshot(result.get("snapshotId"), serp_payload),
            "language": language_for_snapshot(result.get("snapshotId"), serp_payload),
            "keyword": keyword_for_snapshot(result.get("snapshotId"), serp_payload),
            "pageTitle": result.get("title"),
            "h1": clean(summary.get("h1")) or result.get("title"),
            "headingsJson": headings,
            "wordCountEstimate": integer(summary.get("word_count_estimate"), 900 + integer(result.get("rank"), 1) * 150),
            "contentTypeGuess": clean(summary.get("content_type_guess")) or result.get("resultType"),
            "intentServed": clean(summary.get("intent_served")) or infer_intent(str(result.get("title")), str(result.get("snippet"))),
            "monetizationPattern": clean(summary.get("monetization_pattern")) or monetization_pattern(result),
            "affiliatePattern": clean(summary.get("affiliate_pattern")) or ("likely" if result.get("isAffiliateLikely") else "none_obvious"),
            "comparisonTablePresent": truthy(summary.get("comparison_table_present")) or "compare" in " ".join(headings).lower(),
            "productLinksPresent": truthy(summary.get("product_links_present")) or bool(result.get("isEcommerce")),
            "originalDataPresent": truthy(summary.get("original_data_present")),
            "freshnessSignalsJson": split_list(summary.get("freshness_signals")) or ([str(result.get("dateHint"))] if result.get("dateHint") else []),
            "contentAnglesJson": split_list(summary.get("content_angles")) or headings[:3],
            "missingAnglesJson": split_list(summary.get("missing_angles")) or missing_angles(result, headings),
            "strengthsJson": split_list(summary.get("strengths")) or ["Clear title", "Covers expected intent"],
            "weaknessesJson": split_list(summary.get("weaknesses")) or ["Limited market-specific evidence", "Product verification depth unclear"],
            "extractionStatus": "summary_only",
            "analyzedAt": now(),
        }
        analyses.append(analysis)
    return str(write_json(SERP_ANALYSIS_PATH, {"analyses": analyses}))
