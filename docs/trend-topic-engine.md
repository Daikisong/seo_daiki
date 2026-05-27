# Trend Topic Engine

This page describes the legacy topic-first engine. It is no longer the default operating flow.

The active system is market-first:

```text
MarketTrendSignal -> TrendCluster -> TrendKeyword -> SerpSnapshot -> CompetitorContentAnalysis -> ContentStrategy -> TestArticle
```

Use these current docs instead:

- `docs/trend-engine-v1.md`
- `docs/serp-intelligence.md`
- `docs/content-strategy-engine.md`
- `docs/test-posting-flow.md`

Current commands:

```bash
pnpm pipeline:trend-to-post
pnpm trend:import
pnpm trend:cluster
pnpm trend:score
pnpm serp:import
pnpm serp:analyze
pnpm strategy:create
pnpm post:generate-test
```

The legacy aliases `import-trend-signals`, `cluster-topics`, `score-topics`, and `generate-content-briefs`
still exist so older scripts do not break. They should be treated as compatibility aliases, not the preferred API.

Affiliate offer matching is intentionally not part of this phase. Product candidates are handled later through
`pnpm pipeline:post-to-product-analysis`, and monetized links require human approval.
