from __future__ import annotations

from typing import Any

from workers.python.common import read_json, slugify, write_json
from workers.python.writers.content_strategy_rules import brief_markdown
from workers.python.writers.market_content_artifacts import CONTENT_BRIEFS_PATH, CONTENT_STRATEGIES_PATH, now


def generate_content_brief(strategy_id: str | None = None) -> str:
    strategies = read_json(CONTENT_STRATEGIES_PATH, {"strategies": []}).get("strategies", [])
    return str(write_json(CONTENT_BRIEFS_PATH, {"briefs": content_brief_records(strategies, strategy_id)}))


def content_brief_records(strategies: list[dict[str, Any]], strategy_id: str | None = None) -> list[dict[str, Any]]:
    briefs = []
    for strategy in strategies:
        if not isinstance(strategy, dict) or (strategy_id and strategy.get("id") != strategy_id):
            continue
        brief_id = f"brief-{slugify(str(strategy.get('id')))}"
        briefs.append(
            {
                "id": brief_id,
                "strategyId": strategy.get("id"),
                "keywordId": strategy.get("keywordId"),
                "clusterId": strategy.get("clusterId"),
                "market": strategy.get("market"),
                "language": strategy.get("language"),
                "slug": strategy.get("slug"),
                "title": strategy.get("titleStrategy"),
                "angle": strategy.get("recommendedAngle"),
                "monetizationDeferred": True,
                "outlineJson": strategy.get("sectionPlanJson") or [],
                "requiredEvidenceJson": strategy.get("evidenceNeededJson") or [],
                "forbiddenClaimsJson": [
                    "Do not claim first-hand testing without evidence.",
                    "Do not invent prices, discounts, medical outcomes, or availability.",
                    "Do not insert affiliate links in the test article.",
                ],
                "briefMarkdown": brief_markdown(strategy),
                "status": "draft",
                "createdAt": now(),
            }
        )
    return briefs
