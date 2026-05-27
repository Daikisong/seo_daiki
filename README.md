# seo_daiki

Global Market Trend Desk + SERP Intelligence + Multilingual Publishing Lab + Optional Monetization Layer.

This repository is not designed as an affiliate auto-blog first. The core product is a trend-to-content research and publishing system:

1. Trend Engine
2. SERP Intelligence
3. Test Posting
4. Product Candidate Analysis
5. Human-approved monetization
6. Live affiliate APIs later

## Operating Model

The site uses one domain with separate market silos so the content does not become a mixed global blog.

Examples:

- `/us/en/` for the United States English trend desk
- `/es/es/` for the Spain Spanish trend desk
- `/br/pt-br/` for the Brazil Portuguese trend desk
- `/jp/ja/` for the Japan Japanese trend desk
- `/kr/ko/` for the Korea Korean trend desk

Global pages such as `/global/trend-map/` summarize cross-market patterns, but they do not replace market-specific feeds.

## Default Pipeline

The default pipeline is trend-first and stops before monetization:

```text
MarketTrendSignal
  -> TrendCluster
  -> TrendKeyword
  -> SerpSnapshot
  -> CompetitorContentAnalysis
  -> ContentStrategy
  -> ContentBrief
  -> TestArticleDraft
```

It does not run offer matching, distribution drafts, outreach, live affiliate APIs, or automatic monetized link insertion.

## Key Commands

```bash
pnpm pipeline:trend-to-post
pnpm pipeline:post-to-product-analysis
pnpm pipeline:monetization-review
pnpm worker:pipeline
```

Focused commands:

```bash
pnpm trend:import
pnpm trend:cluster
pnpm trend:score
pnpm trend:report
pnpm serp:import
pnpm serp:analyze
pnpm serp:report
pnpm strategy:create
pnpm post:generate-test
pnpm products:import-candidates
pnpm products:analyze-candidates
```

## Safety Boundaries

- Google Trends-like data is treated as relative and sampled, not absolute search volume.
- SERP analysis uses provider-based inputs such as manual CSV. Raw Google HTML scraping, proxy scraping, CAPTCHA bypass, and rank-checking spam are not implemented.
- Product candidates are analysis blocks only until a human approves monetization.
- Live AliExpress, Temu, Amazon, and iHerb API integrations are documented for later and disabled now.
- Monetized placements must use human approval and `rel="sponsored nofollow"`.

## Important Files

- `data/config/markets.json` - 18 initial market configs.
- `workers/python/pipeline.py` - trend-to-post and later-phase pipelines.
- `workers/python/intelligence/market_trend_engine.py` - country/language trend engine.
- `workers/python/serp/serp_intelligence.py` - manual/provider-based SERP intelligence.
- `workers/python/writers/market_content_strategy.py` - strategy, brief, and test-post generation.
- `workers/python/intelligence/product_candidate_engine.py` - manual product candidate analysis.
- `docs/final-refactor-report.md` - refactor summary and verification record.
- `docs/affiliate-api-playbook/` - future merchant API contracts and boundaries.

## Verification

Common checks:

```bash
pnpm test
pnpm typecheck
pnpm seo:validate
pnpm build
```
