# Final Refactor Report

Date: 2026-05-27

## 1. What Was Kept

- Existing product/evidence models are kept for later product candidate analysis.
- Existing article rendering, quality gates, SEO validators, affiliate click route, and admin foundations are kept.
- Existing offer, distribution, and outreach code remains in the repo but is no longer part of the default flow.

## 2. What Was Downgraded Behind Feature Flags

- Offer matching: `ENABLE_OFFER_MATCHING=false`
- Distribution drafts: `ENABLE_DISTRIBUTION_DRAFTS=false`
- Link earning/outreach: `ENABLE_LINK_EARNING=false`
- Live affiliate APIs: `ENABLE_LIVE_AFFILIATE_APIS=false`

## 3. What Was Refactored Around Trend-First Flow

The default pipeline is now:

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

`pnpm worker:pipeline` now runs the trend-to-post flow and reports `defaultPipelineRunsMonetization=false`.

## 4. Market Routing Structure

The site now uses one domain with 18 market silos from `data/config/markets.json`.

Examples:

- `/us/en/`
- `/es/es/`
- `/br/pt-br/`
- `/jp/ja/`
- `/kr/ko/`

Global summary pages:

- `/global/`
- `/global/trend-map/`
- `/global/topics/`
- `/global/methodology/`
- `/global/markets/`

Legacy locale home routes redirect:

- `/en` -> `/us/en/`
- `/es` -> `/es/es/`
- `/pt-br` -> `/br/pt-br/`

Market content hreflang now only links to market variants that actually have the same content slug, so a US-only trend does not point to missing GB/CA/AU pages.

## 5. Trend Engine Flow

Implemented commands:

- `trend:init-markets`
- `trend:import-signals`
- `trend:collect`
- `trend:normalize`
- `trend:cluster`
- `trend:score`
- `trend:report`
- `trend:generate-keywords`

Sample output:

- `data/exports/trend_report.json`
- `data/exports/trend_keywords.json`

Latest sample run produced 8 trend clusters and 20 trend keywords.

## 6. SERP Intelligence Flow

Implemented provider-first manual CSV flow:

- `serp:import-results`
- `serp:collect`
- `serp:fetch-pages`
- `serp:analyze-pages`
- `serp:summarize-opportunity`
- `serp:report`

The system stores URL/title/snippet/headings/summary-style analysis only. Raw Google HTML scraping and proxy rank checking are not implemented.

Latest sample run produced 5 SERP keyword opportunities.

## 7. Content Strategy And Test Posting Flow

Implemented:

- `strategy:create`
- `strategy:generate-brief`
- `post:generate-test`
- `post:publish-test`
- `post:promote-index-candidate`

Latest sample run produced 20 content strategies and 20 test articles.

Test articles contain no affiliate links.

## 8. Product Candidate Analysis Flow

Implemented:

- `products:import-candidates`
- `products:discover-candidates`
- `products:analyze-candidates`
- `products:build-analysis-block`

Latest sample run produced 5 product candidates and 5 product candidate analysis blocks.

The block status remains `do_not_link_yet`.

Admin monetization review pages now include a token-protected decision form for status, approved candidate IDs, rejected candidate IDs, and reviewer notes.

## 9. Affiliate API Documentation Added

Added:

- `docs/affiliate-api-playbook/aliexpress.md`
- `docs/affiliate-api-playbook/temu.md`
- `docs/affiliate-api-playbook/amazon.md`
- `docs/affiliate-api-playbook/iherb.md`
- `docs/affiliate-api-playbook/merchant-adapter-contract.md`

Implemented only:

- `ManualCsvMerchantAdapter`
- `ExistingProductDbAdapter`

Live adapters are disabled placeholders.

## 10. Intentionally Unimplemented

- Full live AliExpress API integration
- Full live Temu integration
- Full live Amazon integration
- Full live iHerb integration
- Automatic monetized link insertion
- Raw Google SERP scraping
- Community auto-posting
- Outreach sending

## 11. Commands Added

- `pnpm pipeline:trend-to-post`
- `pnpm pipeline:post-to-product-analysis`
- `pnpm pipeline:monetization-review`
- `pnpm trend:import`
- `pnpm trend:cluster`
- `pnpm trend:score`
- `pnpm trend:report`
- `pnpm serp:import`
- `pnpm serp:analyze`
- `pnpm serp:report`
- `pnpm strategy:create`
- `pnpm post:generate-test`
- `pnpm post:publish-test`
- `pnpm calendar:build`
- `pnpm calendar:report`
- `pnpm performance:import`
- `pnpm performance:recommend`
- `pnpm products:import-candidates`
- `pnpm products:analyze-candidates`
- `pnpm monetization:create-review`
- `pnpm monetization:draft-placements`
- `pnpm monetization:apply-approved`

## 12. Sample End-To-End Run

Ran:

```bash
pnpm pipeline:trend-to-post
pnpm pipeline:post-to-product-analysis
pnpm pipeline:monetization-review
pnpm worker:pipeline
```

Reports:

- `data/exports/pipeline_trend_to_post_run.json`: pass, 16 steps
- `data/exports/pipeline_post_to_product_analysis_run.json`: pass, 4 steps
- `data/exports/pipeline_monetization_review_run.json`: pass, 2 steps
- `data/exports/monetized_placement_drafts.json`: 0 placements, 5 blocked pending human approval

Five market samples are present:

- US / English: magnesium sleep
- Spain / Spanish: USB-C charger
- Brazil / Portuguese: real capacity power bank
- Japan / Japanese: compact desk gadget
- Korea / Korean: gut health

## 13. Tests And Checks Run

- `python3 -m py_compile $(find workers/python -name '*.py' -not -path '*/__pycache__/*')`: pass
- `pnpm exec prisma validate --config prisma.config.ts`: pass
- `pnpm typecheck`: pass
- `pnpm seo:validate`: pass, 151 sample articles checked and 72 indexable articles passed
- `pnpm build`: pass, 260 static pages generated

## Capability Summary

`data/exports/refactor_capabilities.json` records:

- one-domain market silos: true
- initial markets: 18
- trend engine first: true
- SERP intelligence second: true
- test posting third: true
- product candidate analysis fourth: true
- live affiliate API integration: false
- human-approved monetization: true
- default pipeline runs monetization: false
