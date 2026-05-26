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
