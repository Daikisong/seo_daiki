# Product Candidate Discovery

Product candidate discovery starts only after a trend article exists.

Before product candidate discovery runs, the article should pass the Trend
Monetization Router in `docs/trend-monetization-router.md`.

Allowed route:

- `review_comparison`

Skipped route:

- `informational_explainer`

Example:

```text
Samsung S90F OLED deal
-> review_comparison
-> product candidate discovery can run

게이밍 모니터 추천
-> informational_explainer
-> product candidate discovery is skipped
```

Health and supplement topics can still be `review_comparison` when the reader
expects product comparison, but the route must include `health_claim_guard`.

Sources enabled now:

- manual CSV feeds
- existing product database

Sources documented for later:

- AliExpress live API
- Temu official/manual workflow
- Amazon PA-API or approved creator API path
- iHerb affiliate network feeds

No monetized links are inserted automatically.
