from __future__ import annotations

from typing import Any
from urllib.parse import urlparse

from workers.python.common import slugify
from workers.python.outreach.link_earning_rules import (
    SPAM_RISK_DOMAINS,
    best_asset_for_prospect,
    clean,
    is_suppressed,
    numeric,
    suggested_angle,
    suppression_reason,
    topic_overlap,
)


def build_imported_prospects(rows: list[dict[str, Any]], suppression: list[dict[str, str]]) -> list[dict[str, Any]]:
    return [prospect_from_row(row, suppression) for row in rows]


def prospect_from_row(row: dict[str, Any], suppression: list[dict[str, str]]) -> dict[str, Any]:
    page_url = clean(row.get("page_url"))
    domain = clean(row.get("domain")) or urlparse(page_url).hostname or ""
    contact_email = clean(row.get("contact_email")) or None
    suppressed = is_suppressed(domain, contact_email, suppression)
    return {
        "id": clean(row.get("id")) or f"prospect-{slugify(domain + ' ' + page_url)}",
        "domain": domain.lower(),
        "pageUrl": page_url,
        "pageTitle": clean(row.get("page_title")),
        "locale": clean(row.get("locale")) or None,
        "topic": clean(row.get("topic")),
        "opportunityType": clean(row.get("opportunity_type")) or "data_citation",
        "suggestedAssetId": clean(row.get("suggested_asset_id")) or None,
        "suggestedAngle": clean(row.get("suggested_angle")),
        "topicalRelevance": numeric(row.get("topical_relevance"), 0),
        "pageQuality": numeric(row.get("page_quality"), 0),
        "spamRisk": numeric(row.get("spam_risk"), 0),
        "prospectScore": 0,
        "contactEmail": contact_email,
        "contactFormUrl": clean(row.get("contact_form_url")) or None,
        "status": "suppressed" if suppressed else "new",
        "suppressionReason": suppression_reason(domain, contact_email, suppression) if suppressed else None,
        "notes": clean(row.get("notes")),
    }


def score_link_prospect_rows(
    prospects: list[Any],
    assets: list[Any],
    suppression: list[dict[str, str]],
) -> list[dict[str, Any]]:
    scored = []
    for prospect in prospects:
        if not isinstance(prospect, dict):
            continue
        scored.append(score_link_prospect(prospect, assets, suppression))
    return sorted(scored, key=lambda item: item["prospectScore"], reverse=True)


def score_link_prospect(
    prospect: dict[str, Any],
    assets: list[Any],
    suppression: list[dict[str, str]],
) -> dict[str, Any]:
    suppressed = is_suppressed(prospect.get("domain"), prospect.get("contactEmail"), suppression)
    asset = best_asset_for_prospect(prospect, [asset for asset in assets if isinstance(asset, dict)])
    spam_risk = max(float(prospect.get("spamRisk") or 0), 95 if prospect.get("domain") in SPAM_RISK_DOMAINS else 0)
    topical = float(prospect.get("topicalRelevance") or topic_overlap(str(prospect.get("topic")), str(asset.get("topic") if asset else "")))
    page_quality = float(prospect.get("pageQuality") or 50)
    score = round(topical * 0.45 + page_quality * 0.35 + (100 - spam_risk) * 0.20, 2)
    return {
        **prospect,
        "suggestedAssetId": prospect.get("suggestedAssetId") or (asset.get("id") if asset else None),
        "suggestedAngle": prospect.get("suggestedAngle") or suggested_angle(prospect, asset),
        "topicalRelevance": topical,
        "pageQuality": page_quality,
        "spamRisk": spam_risk,
        "prospectScore": 0 if suppressed else score,
        "suppressionReason": suppression_reason(prospect.get("domain"), prospect.get("contactEmail"), suppression)
        if suppressed
        else prospect.get("suppressionReason"),
        "status": "suppressed" if suppressed else "qualified" if score >= 60 and spam_risk < 70 else "rejected",
    }
