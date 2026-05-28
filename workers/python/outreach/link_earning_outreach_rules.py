from __future__ import annotations

import os
from typing import Any

SPAM_RISK_DOMAINS = {"example-spam.test", "paid-links.test", "directory-submit.test"}


def suggested_angle(prospect: dict[str, Any], asset: dict[str, Any] | None) -> str:
    if not asset:
        return "Manual review required before drafting."
    return f"Suggest the {asset.get('assetType')} page as a citation; do not ask for optimized anchor text."


def outreach_body(prospect: dict[str, Any], asset: dict[str, Any]) -> str:
    address = os.getenv("OUTREACH_PHYSICAL_ADDRESS", "Physical address must be configured before real sends.")
    return (
        f"Hi,\n\n"
        f"I found your page about {prospect.get('topic')}. We maintain an evidence-focused resource that may help as a source:\n"
        f"{asset.get('url')}\n\n"
        "No paid placement or anchor text request is intended. If it is not useful, please ignore this note.\n"
        "To opt out, reply with 'opt out' and this domain/email will be added to the suppression list.\n"
        f"{address}\n\n"
        "Thanks."
    )
