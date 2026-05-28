from __future__ import annotations

from workers.python.outreach.link_earning_asset_rules import (
    LINKABLE_TYPES,
    best_asset_for_prospect,
    original_data_score_for,
    topical_specificity,
    topic_overlap,
)
from workers.python.outreach.link_earning_outreach_rules import SPAM_RISK_DOMAINS, outreach_body, suggested_angle
from workers.python.outreach.link_earning_suppression_rules import (
    domain_matches,
    is_suppressed,
    normalize_domain,
    suppression_reason,
)
from workers.python.outreach.link_earning_values import clean, numeric, words
