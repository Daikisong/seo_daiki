# Pipeline Priority

Default pipeline:

```text
trend import
trend cluster
trend score
trend keyword generation
SERP import
SERP analysis
trend monetization routing
strategy generation
test article generation
```

Default pipeline does not run:

- affiliate offer matching
- distribution drafts
- outreach drafts
- live merchant APIs
- monetized link insertion

Separate later pipelines:

- `pnpm pipeline:post-to-product-analysis`
- `pnpm pipeline:monetization-review`

`pipeline:post-to-product-analysis` should only run for articles routed as:

- `review_comparison`

It should skip:

- `informational_explainer`

Market expansion rule:

```text
review_comparison
-> product-related article
-> create translation/localization candidates for all enabled markets
-> translated drafts stay noindex until local SERP, price, availability, warranty, retailer, and product-candidate context are added

informational_explainer
-> explanation/policy/local information article
-> keep source market/language only
-> do not run market-wide translation expansion
```

Simple example:

```text
대입 정책 trend
-> informational_explainer
-> explanation article only
-> KR/ko only if it was a Korean trend

OLED 할인 trend
-> review_comparison
-> product candidate analysis can run after the test article
-> can become localized drafts for US/en, JP/ja, DE/de, ES/es, KR/ko, etc.
```
