# Final SEO Structure Report

## What Was Patched

- Added reusable `marketResearchMetadata()` with `robots: { index: false, follow: true }`.
- Applied research metadata to trend, keyword, SERP, brief, calendar, and test-post routes.
- Added `buildExistingMarketContentHreflangMap()` so content hreflang only uses actual variants.
- Switched production site URL handling away from `https://example.com` fallback.
- Removed the non-existent `/sitemaps/index.xml` reference from `robots.ts`.
- Added conditional market home sitemap eligibility.
- Added UI label packs for all initial market languages.
- Added `pnpm seo:market-audit`.

## Indexable By Default

- Global overview pages.
- Legacy indexed articles that pass existing article SEO gates.
- Market homes only after meeting content-depth thresholds.

## Noindex By Default

- `/[market]/[language]/trends/[slug]/`
- `/[market]/[language]/keywords/[slug]/`
- `/[market]/[language]/serp/[slug]/`
- `/[market]/[language]/briefs/[slug]/`
- `/[market]/[language]/calendar/`
- `/[market]/[language]/posts/[slug]/`

## Sitemap Policy

`/sitemap.xml` is the only robots-advertised sitemap.

Market homes are included only when they have enough useful content:

```text
3 trend clusters OR 3 SERP opportunities OR 1 public-ready post
```

Empty markets are excluded unless:

```text
INCLUDE_EMPTY_MARKETS_IN_SITEMAP=true
```

## Hreflang Policy

Market homes can connect enabled same-language markets because the home routes exist.

Content detail pages use only actual variants. A US-only slug does not create GB, CA, AU, or IN alternates unless those URLs exist.

## Remaining Risks

- Market homes are currently noindex because sample data is still thin.
- Public article promotion is intentionally not implemented yet.
- Legacy locale-only product routes still exist and should be migrated later.
- Search Console submission should wait until market homes have real public depth.

## Checks Run

Required checks now pass:

```bash
pnpm typecheck              # passed
pnpm seo:validate           # passed
pnpm seo:market-audit       # passed
pnpm build                  # passed
```

The latest market audit report is:

```text
data/exports/seo_market_audit.json
```

Production builds require `NEXT_PUBLIC_SITE_URL`. Local build verification used the ignored app-level env file with `https://example.com`.
