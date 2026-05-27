# Offer Matching

Offer matching is now a later-phase compatibility workflow. It is not part of the default trend-to-post pipeline.

Current priority:

```text
trend -> SERP -> content strategy -> test post -> product candidate analysis -> human monetization review
```

Use this instead of offer matching for the current phase:

```bash
pnpm pipeline:post-to-product-analysis
pnpm pipeline:monetization-review
```

Feature flag status:

```text
ENABLE_OFFER_MATCHING=false
ENABLE_LIVE_AFFILIATE_APIS=false
```

If `match-affiliate-offers` is called with default flags, the CLI prints that it is disabled and points back to product candidate analysis.

Example: a USB-C charger article may receive product candidates from a manual CSV. The analysis block can say what to verify
before linking, but it must not insert monetized links. A human review must approve candidates before any placement draft exists.
