# Current State Audit

Date: 2026-05-27

## Files Inspected

- `README.md`
- `packages/db/prisma/schema.prisma`
- `packages/types/src/index.ts`
- `workers/python/cli.py`
- `workers/python/intelligence/trend_topic_engine.py`
- `workers/python/intelligence/offer_matching.py`
- `workers/python/writers/topic_article_generator.py`
- `workers/python/writers/topic_brief_generator.py`
- `workers/python/writers/topic_localizer.py`
- `workers/python/validators/publishing_gate.py`
- `packages/validators/src/index.ts`
- `apps/web/lib/content/page-loaders.ts`
- `apps/web/lib/seo/metadata.ts`
- `apps/web/app/api/affiliate-click/route.ts`
- `docs/*.md`

## What Supports The New Trend-First Flow

- Existing trend topic files give a starting point for CSV import, topic clustering, and scoring.
- Existing article and content brief structures can be reused for test posts.
- Existing SEO helpers, sitemap code, no automatic language redirect behavior, and hreflang validators are reusable.
- Existing publishing gate and quality gate remain useful after the test-post phase.
- Existing Product, EvidencePack, VerifiedClaim, and MarketRisk models can support later product candidate analysis.

## What Was Product/Offer-First Too Early

- `offer_matching.py`, merchant offers, affiliate placement candidates, distribution drafts, and outreach drafts were too early for the default pipeline.
- `pipeline.py` previously jumped from trend briefs into offers, distribution, and outreach.
- README presented the system too much as an affiliate operating system rather than a trend-to-content research and publishing system.

## Reusable Models

- `Article`, `ContentBrief`, `Product`, `VerifiedClaim`, `EvidencePack`, `SearchConsoleMetric`, and `PageRefreshSuggestion`.
- These are reusable because they can serve test publishing, evidence checks, performance feedback, and later product analysis.

## Premature Models Or Features

- `Offer`, `AffiliatePlacement`, `DistributionAsset`, `LinkProspect`, and `OutreachMessage` are kept but moved behind later-phase flags.
- Live merchant APIs are intentionally not the default path.

## Shallow Trend Discovery Gaps

- Old trend workers were locale-first and topic-first, not market silo-first.
- They did not model 18 markets, relative trend signals, market-specific scoring, or cross-market trend maps strongly enough.

## Documentation-Only For Now

- AliExpress live API adapter
- Temu live adapter
- Amazon live adapter
- iHerb live adapter
- Any raw SERP scraping or proxy rank checking

## Public Routes And Admin Flows Safe To Keep

- Existing content pages can remain while market silo routes are introduced.
- Affiliate click route can remain for existing approved placements, but the new default flow does not create new affiliate links.
- Admin quality and publishing gates remain useful.

## Disabled Or Flagged

- `ENABLE_OFFER_MATCHING=false`
- `ENABLE_DISTRIBUTION_DRAFTS=false`
- `ENABLE_LINK_EARNING=false`
- `ENABLE_LIVE_AFFILIATE_APIS=false`

The default pipeline now runs trend, SERP, strategy, and test posting only.
