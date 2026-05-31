# Pipeline Priority

Default pipeline:

```text
trend import
trend cluster
trend score
trend keyword generation
SERP import
SERP analysis
strategy generation
test article generation
trend monetization routing
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

- `commerce_ready`
- `health_commerce_guarded`

It should skip:

- `research_only`
- `blocked_for_monetization`
