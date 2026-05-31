# Sitemap Policy

The sitemap should contain important public URLs, not every internal workflow URL.

## Robots

`robots.ts` references only:

```text
/sitemap.xml
```

It does not reference `/sitemaps/index.xml` because that route is not implemented.

## Market Homes

Market homes are conditional sitemap entries.

Included only when:

- market is enabled
- market has enough useful content
- market is not empty or sample-only

Threshold:

```text
3 trend clusters OR 3 SERP opportunities OR 1 public-ready post
```

Default override:

```text
INCLUDE_EMPTY_MARKETS_IN_SITEMAP=false
```

## Research Pages

The sitemap must not include:

- trend research detail pages
- keyword research pages
- SERP analysis pages
- content briefs
- editorial calendars
- test posts

These pages can be crawled through links, but they carry `noindex, follow`.

## Search Console Before Submission

Before submitting the sitemap, run:

```bash
pnpm seo:market-audit
pnpm seo:validate
pnpm build
```

The audit report is saved to:

```text
data/exports/seo_market_audit.json
```
