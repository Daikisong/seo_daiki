# Search Console Refresh Loop

Phase 14 expands the existing `suggest-refreshes` worker.

Run:

```bash
python3 workers/python/cli.py suggest-refreshes
```

Output:

- `data/exports/search_console_suggestions.json`

The worker still looks for pages with:

- enough impressions
- low CTR
- average position between 8 and 30

It now also understands newer article types:

- `trend`
- `buyer_guide`
- `deal_watch`
- `ingredient_guide`

New suggestion fields:

- `offer_replacement_candidates`
- `localization_improvement_candidates`
- `health_claim_risk`

Example: if an ingredient guide gets Search Console impressions for a query like `magnesium glycinate dosage sleep iherb`, the worker flags high health risk and adds a HealthClaimGuard review action instead of suggesting unsupported supplement claims.

The loop remains advisory only. It does not auto-edit, auto-publish, auto-index, or replace offers without review.
