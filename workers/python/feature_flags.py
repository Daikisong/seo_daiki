from __future__ import annotations

import os


def enabled(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


ENABLE_OFFER_MATCHING = enabled("ENABLE_OFFER_MATCHING", False)
ENABLE_DISTRIBUTION_DRAFTS = enabled("ENABLE_DISTRIBUTION_DRAFTS", False)
ENABLE_LINK_EARNING = enabled("ENABLE_LINK_EARNING", False)
ENABLE_LIVE_AFFILIATE_APIS = enabled("ENABLE_LIVE_AFFILIATE_APIS", False)
ENABLE_PRODUCT_CANDIDATE_DISCOVERY = enabled("ENABLE_PRODUCT_CANDIDATE_DISCOVERY", True)
ENABLE_SERP_INTELLIGENCE = enabled("ENABLE_SERP_INTELLIGENCE", True)
ENABLE_TREND_ENGINE = enabled("ENABLE_TREND_ENGINE", True)
