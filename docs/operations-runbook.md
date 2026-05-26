# Operations Runbook

## Daily Trend-To-Post Demo

```bash
pnpm pipeline:trend-to-post
```

Check outputs:

- `data/exports/trend_report.json`
- `data/exports/trend_keywords.json`
- `data/exports/serp_opportunity_report.json`
- `data/exports/content_strategies.json`
- `data/exports/test_articles.json`

## Product Candidate Analysis

```bash
pnpm pipeline:post-to-product-analysis
```

This creates analysis blocks only. It does not create monetized links.

## Monetization Review

```bash
pnpm pipeline:monetization-review
```

This creates pending review records. Draft placement creation remains blocked unless a human marks candidates as approved.

## Verification

```bash
pnpm typecheck
pnpm seo:validate
pnpm build
```

## Safety

Do not enable live affiliate APIs, outreach, or distribution until policy review and human approval workflows are ready.
