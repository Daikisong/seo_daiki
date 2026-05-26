# Offer Matching

Phase 8 adds a safe affiliate offer matching layer for AliExpress and iHerb.

The matcher reads:

- scored topics from `data/snapshots/topic_scores.json`
- content briefs from `data/briefs/content_briefs.json`
- offer inventory from `data/seeds/offers.csv`

Run:

```bash
python3 workers/python/cli.py match-affiliate-offers --offers-file data/seeds/offers.csv
```

Outputs:

- `data/snapshots/affiliate_offer_matches.json`
- `data/exports/affiliate_placement_candidates.json`

The score is:

```text
topicalFit * 0.25
+ localeFit * 0.15
+ merchantTrust * 0.15
+ evidenceLevel * 0.15
+ priceFreshness * 0.10
+ conversionFit * 0.10
+ complianceFit * 0.10
```

Safety rules:

- candidates start as `draft`
- `humanApprovalRequired` is true
- `rel` is always `sponsored nofollow`
- iHerb candidates are only allowed for health/supplement briefs that require HealthClaimGuard and disclaimer evidence
- AliExpress candidates are limited to relevant commerce categories such as chargers, import gear, power banks, tools, sensors, and desk setup
- placement counts are capped by article type, for example 2 for `trend`, 4 for `buyer_guide`, and 3 for `ingredient_guide`

Admin review:

- `/admin/offer-matching/` shows exported candidates and persisted DB placements.
- `/admin/placements/` can approve or reject DB-backed placements.
- approval calls `/api/admin/affiliate-placement-status` and requires `ADMIN_TOKEN`.
- approved placements must have `sponsored nofollow`, visible disclosure, active offer, enabled merchant, and a merchant-allowed affiliate URL host.

Example: a Baseus charger can be suggested for a travel GaN charger buyer guide, but it stays draft until a human approves the placement. Only then can the public page use `/api/affiliate-click?placementId=...`.
