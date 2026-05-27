from __future__ import annotations

from typing import Any

from workers.python.common import slugify
from workers.python.outreach.link_earning_rules import LINKABLE_TYPES, original_data_score_for, topical_specificity


def build_linkable_assets(inventory: list[Any]) -> list[dict[str, Any]]:
    assets = []
    for row in inventory:
        if not isinstance(row, dict) or row.get("type") not in LINKABLE_TYPES:
            continue
        url = str(row.get("path") or "")
        original_data_score = original_data_score_for(str(row.get("type")), str(row.get("cluster", "")))
        linkable_score = round(original_data_score * 0.55 + topical_specificity(str(row.get("slug"))) * 0.25 + 20, 2)
        assets.append(
            {
                "id": f"linkable-{slugify(url)}",
                "articleId": None,
                "url": url,
                "locale": row.get("locale", "en"),
                "topic": row.get("cluster", ""),
                "assetType": row.get("type"),
                "title": f"{row.get('type')} {row.get('slug')}".strip(),
                "summary": f"Evidence-first {row.get('type')} page for {row.get('cluster')}.",
                "originalDataScore": original_data_score,
                "linkableScore": linkable_score,
                "status": "active",
            }
        )

    return sorted(assets, key=lambda item: item["linkableScore"], reverse=True)
