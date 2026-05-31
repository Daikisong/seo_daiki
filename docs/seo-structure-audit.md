# SEO Structure Audit

This audit covers the post-modularization market SEO structure.

## Result

The site now separates public SEO surfaces from internal research surfaces.

- One domain remains the canonical strategy.
- Market silos use explicit URLs such as `/us/en/`, `/es/es/`, `/kr/ko/`.
- No IP or browser-language auto redirect is used.
- Research routes default to `noindex, follow`.
- Empty or thin market home pages are excluded from sitemap by default.
- Content hreflang alternates are generated only from existing market variants.

## Patched Risks

1. Research pages could be indexed.
   Example: `/us/en/serp/magnesium-sleep/` is useful for editorial research, not for public search users. It now uses `marketResearchMetadata()`.

2. Hreflang could point at missing URLs.
   Example: `/us/en/trends/magnesium-sleep/` no longer creates `/gb/en/trends/magnesium-sleep/` unless that GB variant exists.

3. Production canonical URLs could fall back to `https://example.com`.
   `getSiteUrl()` now falls back to `http://localhost:3000` only outside production. Production requires `NEXT_PUBLIC_SITE_URL`.

4. Robots referenced a sitemap index route that did not exist.
   `robots.ts` now references only `/sitemap.xml`.

5. Empty market homes could enter sitemap.
   `INCLUDE_EMPTY_MARKETS_IN_SITEMAP=false` is the default.

## Audit Command

Run:

```bash
pnpm seo:market-audit
```

The command checks:

- canonical generation for market pages
- research/test routes use noindex metadata
- hreflang alternates point only at existing variants
- hreflang sets are bidirectional
- production site URL policy is enforced
- robots sitemap references exist
- market home sitemap eligibility
- UI label coverage for all initial languages

The audit writes:

```text
data/exports/seo_market_audit.json
```
