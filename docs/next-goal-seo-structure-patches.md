# Next Goal: SEO Structure Safety Patches

This is the next goal after the current modularization/refactor pass is finished.

Captured from the latest SEO feedback on 2026-05-28. Treat this as the next
implementation target after the current modularization goal is fully verified
and pushed.

The current market-silo SEO direction is acceptable:

- one domain with 18 market/language silos
- trend -> SERP -> strategy -> test post flow
- monetization/offers/outreach disabled by default
- test posts noindex by default
- human approval before monetized links

Do not add affiliate API, distribution, outreach, or monetization features for this goal.

## P0

1. Add reusable noindex metadata for internal research pages.
   - `/[market]/[language]/trends/[slug]`
   - `/[market]/[language]/keywords/[slug]`
   - `/[market]/[language]/serp/[slug]`
   - `/[market]/[language]/briefs/[slug]`
   - `/[market]/[language]/calendar/`
   - Keep `/[market]/[language]/posts/[slug]` noindex.

2. Fix market content hreflang.
   - Only emit hreflang URLs for variants that actually exist.
   - Do not point hreflang at missing market/slug pages.
   - Keep market-home hreflang separate because all market homes exist.

3. Make production canonical URLs safe.
   - `NEXT_PUBLIC_SITE_URL` must be required in production.
   - Development fallback should be `http://localhost:3000`, not `https://example.com`.

4. Fix robots sitemap references.
   - Keep `/sitemap.xml`.
   - Remove `/sitemaps/index.xml` from robots unless a real route exists.

## P1

1. Make market home sitemap inclusion conditional.
   - Include only markets with enough useful content.
   - Default `INCLUDE_EMPTY_MARKETS_IN_SITEMAP=false`.

2. Add market UI label packs.
   - `data/config/ui-labels.json`
   - Cover at least `en`, `es`, `pt-br`, `pt`, `fr`, `de`, `it`, `nl`, `pl`, `tr`, `id`, `ja`, `ko`.
   - Apply to market home, trend detail, SERP detail, post detail, and empty states.

3. Document legacy locale route boundaries.
   - Existing product/evidence pages can remain legacy locale routes.
   - New trend/test-post pages must use market/language routes.

4. Add `pnpm seo:market-audit`.
   - Check canonical coverage.
   - Check research pages are noindex.
   - Check test posts are noindex.
   - Check hreflang does not point to missing variants.
   - Check production site URL configuration.
   - Check robots sitemap URLs exist.
   - Check market sitemap eligibility.
   - Check UI label coverage.

## P2

1. Add sitemap audit report before Search Console submission.
2. Add bidirectional hreflang validator.
3. Add empty/thin market page noindex validator.
4. Improve market detail page content depth before opening index.

## Required Docs For That Goal

- `docs/seo-structure-audit.md`
- `docs/market-page-index-policy.md`
- `docs/hreflang-market-variants.md`
- `docs/sitemap-policy.md`
- `docs/legacy-locale-vs-market-routes.md`
- `docs/final-seo-structure-report.md`

## Required Verification For That Goal

- `pnpm typecheck`
- `pnpm seo:validate`
- `pnpm seo:market-audit`
- `pnpm build`
