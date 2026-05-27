from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from workers.python.common import DATA, read_csv, read_json, slugify, write_json
from workers.python.serp.analysis_rules import (
    clean,
    content_gap,
    domain_for,
    inferred_headings,
    infer_intent,
    integer,
    missing_angles,
    monetization_pattern,
    recommended_angle,
    recommended_article_type,
    split_list,
    top_patterns,
    truthy,
)

TREND_KEYWORDS_PATH = DATA / "exports" / "trend_keywords.json"
SERP_RESULTS_PATH = DATA / "exports" / "serp_results.json"
SERP_ANALYSIS_PATH = DATA / "exports" / "competitor_content_analysis.json"
SERP_OPPORTUNITY_PATH = DATA / "exports" / "serp_opportunity_report.json"


def import_serp_results(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "serp-results.csv"
    rows = read_csv(seed_path)
    snapshots: dict[str, dict[str, Any]] = {}
    results = []
    for row in rows:
        market = clean(row.get("market"))
        language = clean(row.get("language"))
        keyword = clean(row.get("keyword"))
        snapshot_id = clean(row.get("snapshot_id")) or f"serp-snapshot-{slugify(f'{market} {language} {keyword}')}"
        snapshot = snapshots.setdefault(
            snapshot_id,
            {
                "id": snapshot_id,
                "market": market,
                "language": language,
                "country": clean(row.get("country")).upper(),
                "keywordId": clean(row.get("keyword_id")) or f"trend-keyword-{slugify(f'{market} {language} {keyword}')}",
                "keyword": keyword,
                "provider": clean(row.get("provider")) or "manual_csv",
                "collectedAt": clean(row.get("collected_at")) or now(),
                "status": "imported",
                "rawJson": {"sourceFile": str(seed_path)},
                "topResultCount": 0,
            },
        )
        result_id_source = f"{snapshot_id} {row.get('rank')}"
        result = {
            "id": clean(row.get("result_id")) or f"serp-result-{slugify(result_id_source)}",
            "snapshotId": snapshot_id,
            "rank": integer(row.get("rank"), 0),
            "url": clean(row.get("url")),
            "domain": clean(row.get("domain")) or domain_for(clean(row.get("url"))),
            "title": clean(row.get("title")),
            "snippet": clean(row.get("snippet")),
            "resultType": clean(row.get("result_type")) or "article",
            "dateHint": clean(row.get("date_hint")) or None,
            "isForum": truthy(row.get("is_forum")),
            "isVideo": truthy(row.get("is_video")),
            "isEcommerce": truthy(row.get("is_ecommerce")),
            "isAffiliateLikely": truthy(row.get("is_affiliate_likely")),
            "isPublisher": truthy(row.get("is_publisher")),
            "languageGuess": clean(row.get("language_guess")) or language,
            "contentFetchedStatus": "manual_summary_available",
            "contentAnalysisStatus": "pending",
        }
        results.append(result)
        snapshot["topResultCount"] += 1
    return str(write_json(SERP_RESULTS_PATH, {"snapshots": list(snapshots.values()), "results": sorted(results, key=lambda item: (item["snapshotId"], item["rank"]))}))


def collect_serp(keyword_id: str | None = None, provider: str = "manual_csv") -> str:
    payload = read_json(SERP_RESULTS_PATH, {"snapshots": [], "results": []})
    snapshots = [
        snapshot
        for snapshot in payload.get("snapshots", [])
        if isinstance(snapshot, dict)
        and (not keyword_id or snapshot.get("keywordId") == keyword_id)
        and snapshot.get("provider") == provider
    ]
    return str(write_json(DATA / "exports" / "serp_collect_report.json", {"provider": provider, "snapshots": snapshots}))


def fetch_serp_pages(snapshot_id: str | None = None) -> str:
    payload = read_json(SERP_RESULTS_PATH, {"snapshots": [], "results": []})
    updated = []
    for result in payload.get("results", []):
        if not isinstance(result, dict):
            continue
        row = dict(result)
        if not snapshot_id or row.get("snapshotId") == snapshot_id:
            row["contentFetchedStatus"] = "summary_only"
            row["contentFetchPolicy"] = "Stored URL, title, snippet, headings/summary only; no full article body."
        updated.append(row)
    return str(write_json(SERP_RESULTS_PATH, {"snapshots": payload.get("snapshots", []), "results": updated}))


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


def summarize_serp_opportunity(keyword_id: str | None = None) -> str:
    keywords = read_json(TREND_KEYWORDS_PATH, {"keywords": []}).get("keywords", [])
    analyses = read_json(SERP_ANALYSIS_PATH, {"analyses": []}).get("analyses", [])
    by_keyword: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for analysis in analyses:
        if isinstance(analysis, dict):
            by_keyword[str(analysis.get("keyword"))].append(analysis)
    opportunities = []
    for keyword in keywords:
        if not isinstance(keyword, dict) or (keyword_id and keyword.get("id") != keyword_id):
            continue
        rows = by_keyword.get(str(keyword.get("keyword")), [])
        if not rows:
            continue
        intents = Counter(str(row.get("intentServed")) for row in rows)
        content_types = Counter(str(row.get("contentTypeGuess")) for row in rows)
        weakness_count = sum(len(row.get("weaknessesJson", [])) for row in rows)
        original_data_count = sum(1 for row in rows if row.get("originalDataPresent"))
        serp_gap_score = min(100, 45 + weakness_count * 5 + (20 if original_data_count == 0 else 0))
        weak_competitor_score = min(100, 40 + len([row for row in rows if not row.get("originalDataPresent")]) * 10)
        content_depth = min(100, 50 + len({heading for row in rows for heading in row.get("headingsJson", [])}) * 4)
        freshness_gap = 70 if any(not row.get("freshnessSignalsJson") for row in rows) else 45
        trend_score = float(keyword.get("priorityScore") or 0)
        score_value = round(
            trend_score * 0.20
            + serp_gap_score * 0.25
            + weak_competitor_score * 0.15
            + content_depth * 0.15
            + 80 * 0.10
            + 50 * 0.05
            + freshness_gap * 0.10,
            2,
        )
        opportunity = {
            "id": f"serp-opportunity-{slugify(str(keyword.get('id')))}",
            "keywordId": keyword.get("id"),
            "market": keyword.get("market"),
            "language": keyword.get("language"),
            "keyword": keyword.get("keyword"),
            "opportunityScore": score_value,
            "dominantIntent": intents.most_common(1)[0][0],
            "dominantContentTypesJson": [item for item, _ in content_types.most_common(3)],
            "topPatternsJson": top_patterns(rows),
            "contentGapJson": content_gap(rows),
            "recommendedAngle": recommended_angle(keyword, rows),
            "recommendedArticleType": recommended_article_type(intents, content_types),
            "shouldWrite": score_value >= 55,
            "reason": "Trend signal plus manual SERP gaps show a test post opportunity.",
        }
        opportunities.append(opportunity)
    opportunities.sort(key=lambda item: item["opportunityScore"], reverse=True)
    return str(write_json(SERP_OPPORTUNITY_PATH, {"opportunities": opportunities}))


def serp_report(market: str | None = None) -> str:
    payload = read_json(SERP_OPPORTUNITY_PATH, {"opportunities": []})
    opportunities = [
        item for item in payload.get("opportunities", []) if isinstance(item, dict) and (not market or item.get("market") == market)
    ]
    path = DATA / "exports" / (f"serp_report_{market}.json" if market else "serp_opportunity_report.json")
    return str(write_json(path, {"opportunities": opportunities}))


def market_for_snapshot(snapshot_id: Any, payload: dict[str, Any]) -> str:
    snapshot = find_snapshot(snapshot_id, payload)
    return str(snapshot.get("market") or "")


def language_for_snapshot(snapshot_id: Any, payload: dict[str, Any]) -> str:
    snapshot = find_snapshot(snapshot_id, payload)
    return str(snapshot.get("language") or "")


def keyword_for_snapshot(snapshot_id: Any, payload: dict[str, Any]) -> str:
    snapshot = find_snapshot(snapshot_id, payload)
    return str(snapshot.get("keyword") or "")


def find_snapshot(snapshot_id: Any, payload: dict[str, Any]) -> dict[str, Any]:
    for snapshot in payload.get("snapshots", []):
        if isinstance(snapshot, dict) and snapshot.get("id") == snapshot_id:
            return snapshot
    return {}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
