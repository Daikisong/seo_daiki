# TrendBrief

TrendBrief publishes buyer notes for fast-moving trends across AliExpress, Temu, Amazon, iHerb, and local retailers.

- Public brand: TrendBrief
- Operator and author: Jacob
- Site description: Buyer notes for fast-moving trends
- Content unit: Briefs

The operating model is:

1. Detect a country or language-market trend.
2. Translate the trend into a concrete buyer problem.
3. Compare practical product routes, exact variants, prices, review complaints, local fit, shipping, warranty, and return risk.
4. Publish only when the article and product evidence pass the quality gates.

## Current Status

This repository is a static/manual MVP with publishing guardrails.

- Public articles currently include:
  - `/en/trends/europe-heatwave-portable-ac-trend-2026/`
- Only `en` is open for indexing.
- The planned 18-locale model is defined, but planned locales stay hidden/noindex until opened.
- Quality gates are implemented for product evidence, direct-use claims, internal-process copy, locale safety, hreflang safety, affiliate links, and thin recommendation pages.
- The trend-to-affiliate pipeline exists as a dry-run skeleton only. It does not publish routes, write sitemap entries, or open locale pages automatically.
- Local dry-run artifacts are written under ignored `output/pipeline-runs/`; keep only curated examples in `docs/examples/pipeline-run/`.

## Commands

```bash
corepack pnpm dev
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm smoke
corepack pnpm pipeline:dry-run
```

The web package equivalents are:

```bash
corepack pnpm --filter @trend-jacob/web dev
corepack pnpm --filter @trend-jacob/web typecheck
corepack pnpm --filter @trend-jacob/web test
corepack pnpm --filter @trend-jacob/web build
corepack pnpm --filter @trend-jacob/web smoke
corepack pnpm --filter @trend-jacob/web pipeline:dry-run
```

## Main Files

- `apps/web/app/page.tsx` - home page
- `apps/web/app/category/[slug]/page.tsx` - category archive route
- `apps/web/app/[locale]/trends/[slug]/page.tsx` - trend article route
- `apps/web/components/layout/ArticlePage.tsx` - trend article detail layout
- `apps/web/components/layout/article-type-content-parts.tsx` - reader-facing article blocks
- `apps/web/lib/trend-site/locales.ts` - 18-locale config and indexability rules
- `apps/web/lib/trend-site/seo.ts` - canonical, sitemap, noindex, and opt-in hreflang logic
- `apps/web/lib/trend-site/quality-gate.ts` - publish safety gates
- `apps/web/lib/trend-site/content/` - manual article and product evidence records
- `apps/web/lib/trend-site/pipeline-*.ts` - dry-run pipeline models, fixtures, writer, and runner

## Content Rules

Reader-facing article copy must show buyer outcomes, not internal workflow proof.

Use public copy for:

- exact variant and SKU caveats
- final price labels and price status
- plug, voltage, wattage, compatibility, and included accessories
- seller return path and warranty route
- repeated buyer complaints
- shipping delay or import risk
- practical pros and cons
- who should buy, wait, or avoid

Keep these internal unless writing a methodology page:

- SERP provider checks
- Search Console signals
- LLM or prompt decisions
- commercial intent scoring
- monetization-link availability
- internal SEO workflow notes

## International SEO Model

Use one global domain with fixed locale subdirectories.

- Good: `/en/`, `/en-gb/`, `/de-de/`, `/fr-fr/`, `/ko-kr/`
- Do not serve different languages from the same URL by IP, cookie, or browser language.
- Do not auto-open planned locales.
- Do not generate hreflang clusters by category alone.
- Use hreflang only for true localized alternatives of the same core trend and buyer decision.
- Each localized page must use a self-referencing canonical.

## Price Model

Do not use `0` as a placeholder price.

- Use `priceState: "checked"` with a positive numeric price.
- Use `priceState: "search-route"` for marketplace/search comparison routes.
- Use `priceState: "range"` when the public price label is a range.
- Use `priceState: "unavailable"` with `price: null` when the live price is not visible.

## Pipeline Rule

The current pipeline is dry-run only. It may create typed artifacts and repair tasks, but it must not:

- publish a public route
- add a draft to sitemap
- open a planned locale
- create hreflang alternates for incomplete variants
- replace manual review
