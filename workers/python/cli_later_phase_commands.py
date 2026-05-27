from __future__ import annotations

from argparse import Namespace
from pathlib import Path

from workers.python.cli_dispatch_result import NOT_HANDLED, DispatchResult, handled
from workers.python.feature_flags import ENABLE_DISTRIBUTION_DRAFTS, ENABLE_LINK_EARNING, ENABLE_OFFER_MATCHING


def run_later_phase_command(args: Namespace) -> DispatchResult:
    if args.command == "match-affiliate-offers":
        if not ENABLE_OFFER_MATCHING:
            return handled("match-affiliate-offers is disabled by ENABLE_OFFER_MATCHING=false; use product candidate analysis first.")

        from workers.python.intelligence.offer_matching import match_affiliate_offers

        return handled(match_affiliate_offers(args.topic_id, args.article_id, Path(args.offers_file)))
    if args.command == "generate-distribution-assets":
        if not ENABLE_DISTRIBUTION_DRAFTS:
            return handled("generate-distribution-assets is disabled by ENABLE_DISTRIBUTION_DRAFTS=false.")

        from workers.python.distribution.owned_channel import generate_distribution_assets

        return handled(generate_distribution_assets(args.article_id))
    if args.command == "draft-outreach":
        if not ENABLE_LINK_EARNING:
            return handled("draft-outreach is disabled by ENABLE_LINK_EARNING=false.")

        from workers.python.outreach.link_earning import draft_outreach

        return handled(draft_outreach())
    return NOT_HANDLED
