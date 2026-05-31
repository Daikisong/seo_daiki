# Product Candidate Discovery

Product candidate discovery starts only after a trend article exists.

Before product candidate discovery runs, the article should pass the Trend
Monetization Router in `docs/trend-monetization-router.md`.

Allowed routes:

- `commerce_ready`
- `health_commerce_guarded`

Blocked routes:

- `research_only`
- `blocked_for_monetization`

Sources enabled now:

- manual CSV feeds
- existing product database

Sources documented for later:

- AliExpress live API
- Temu official/manual workflow
- Amazon PA-API or approved creator API path
- iHerb affiliate network feeds

No monetized links are inserted automatically.
