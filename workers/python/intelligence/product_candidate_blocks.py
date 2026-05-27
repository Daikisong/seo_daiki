from __future__ import annotations

from workers.python.common import read_json, write_json
from workers.python.intelligence.product_candidate_paths import PRODUCT_ANALYSIS_PATH


def build_product_analysis_block(article_id: str | None = None) -> str:
    analyses = read_json(PRODUCT_ANALYSIS_PATH, {"analyses": []}).get("analyses", [])
    blocks = []
    for analysis in analyses:
        if not isinstance(analysis, dict) or (article_id and analysis.get("articleId") != article_id):
            continue
        blocks.append({**analysis, "analysisBlockMarkdown": product_analysis_markdown(analysis)})
    return str(write_json(PRODUCT_ANALYSIS_PATH, {"analyses": blocks}))


def product_analysis_markdown(analysis: dict[str, object]) -> str:
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
    return "\n".join(lines)
