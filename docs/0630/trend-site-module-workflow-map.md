# TrendBrief module and workflow map

Date: 2026-06-30

## Purpose

This file is the handoff map for future trend-pipeline work. The site should
stay a country-triggered buyer-decision system, not a translation farm and not
a fake product testing lab.

## Content Ownership

`apps/web/lib/trend-site/data.ts`

- Public repository facade.
- Assembles articles and products.
- Runs validation before exports are consumed by routes.
- Should stay small. Do not put article prose, product prose, or ranking copy
  here.

`apps/web/lib/trend-site/content/articles.ts`

- Article-level generated/editorial copy.
- Owns intro, quick answer, trend bridge, marketplace rule, country routes,
  avoid list, FAQ, final thoughts, buying checklist, and update log fields.
- This is where LLM/CMS article output should land during mockup work.
- The first reader section should be marked `role: "quick-answer"` rather than
  relying on an English heading. Localized pages should translate the heading
  while keeping the role for validation/rendering order.

`apps/web/lib/trend-site/content/article-evidence.ts`

- Source registry for article-level evidence IDs used by trend signal boxes and
  article sections.
- Article evidence IDs should resolve to a source label, HTTPS URL, and checked
  date before publication.

`apps/web/lib/trend-site/content/*product-records.ts`

- Product evidence records by article/category.
- Owns exact variants, prices, region fit, spec labels, review labels,
  marketplace route labels, images, risk fields, evidence arrays, key features,
  rank labels, expert takes, and visible pros/cons.
- Keep country/market assumptions explicit. A Europe article needs voltage,
  plug, retailer route, warranty territory, and bulky-return context.

`apps/web/lib/trend-site/content/product-decisions.ts`

- Generated Jacob-persona product judgment.
- Owns the current `ProductDecisionCopy` fields: evidence note,
  recommendation rationale, fit/skip copy, repeated complaints,
  warranty/return note, and marketplace note.
- In the current static mockup, `ProductRecord` still carries key features,
  rank label, expert take, and visible pros/cons.
- React components must not synthesize these sentences.

`apps/web/lib/trend-site/content/product-record-transform.ts`

- Converts evidence records plus generated decision copy into `Product`.
- Keep it mechanical. It should map fields, not invent public prose.

`apps/web/lib/trend-site/content/content-validation.ts`

- Build-time/content-layer validation.
- Blocks missing generated article/product fields before rendering.
- Keeps ?œno public prose fallback??enforceable.

## SEO and Publishing Gates

`apps/web/lib/trend-site/locales.ts`

- Single source of truth for the planned 18 locales.
- `planned` means generation is allowed, not public indexing.
- `indexable` means the locale may enter static params, sitemap, and public
  article indexes after content and QA are ready.

`apps/web/lib/trend-site/seo.ts`

- Canonical, robots, and hreflang helpers.
- Hreflang is opt-in by `localization.clusterId`.
- Never cluster pages just because they share a category.

`apps/web/lib/trend-site/quality-gate.ts`

- Article/product publishing gate.
- Blocks unsupported direct-use claims, missing source/evidence fields, planned
  locale indexing, missing region-fit layers, incomplete hreflang clusters, and
  near-duplicate locale pages.
- Verifies commerce articles produce a full Top 10 recommendation model before
  publication; a page should not pass if the renderer would hide the product
  section.
- Blocks public internal-process language such as SERP/Search Console/LLM proof
  text.

`apps/web/lib/trend-site/quality-gate-url-rules.ts`

- URL safety rules.
- Purchase CTAs must be direct HTTPS outbound URLs.
- Internal `/api`, `/out`, `/go`, `/redirect`, and `/affiliate-click` paths are
  not resilient purchase links.
- Marketplace search URLs must be labeled as search routes, not exact product
  deep links.

`apps/web/lib/trend-site/recommendation-product-selection.ts`

- Shared product selection rule.
- Main recommendations are selected by `article.productCategory` and
  `productRole: "main"`.
- Accessory records can exist for later sections, but should not leak into the
  main Top 10 list unless the article is explicitly about accessories.

## Public Rendering Boundaries

`apps/web/components/layout/article-type-content-parts.tsx`

- Renders headings, tables, labels, links, cards, source stacks, and generated
  fields.
- Does not author product verdicts, pros/cons, final thoughts, or marketplace
  advice.
- Image placeholders are intentionally not numeric fallbacks. Product images
  must come from product/merchant/affiliate feed data before publication.

`apps/web/components/seo/AffiliateOutboundLink.tsx`

- Opens outbound product routes in a new tab.
- Analytics can be recorded around the click, but navigation must not depend on
  a server redirect being available.

`apps/web/scripts/smoke-test.mjs`

- Starts the built Next app and checks the public runtime surface.
- Confirms sitemap excludes planned locales and hidden categories.
- Confirms visible categories and article pages render.
- Confirms article HTML has canonical URLs, outbound CTAs, no `/api` or `/out`
  purchase links, and no forbidden internal workflow terms.

## Future Pipeline Shape

1. Detect country trend signal.
2. Generate localized keyword and searcher problem.
3. Observe SERP/blog structures and marketplace routes internally.
4. Decide whether the trend creates a concrete buyer decision.
5. Generate an `Article` for the target locale and buyer problem.
6. Generate `ProductRecord` rows for the exact category, market, prices,
   return/warranty paths, review signals, images, and risk fields.
7. Generate `ProductDecisionCopy` with Jacob's natural expert persona.
8. Transform records into `Product`.
9. Run content validation and quality gate.
10. Publish only if the locale, article, products, links, sitemap, canonical,
    and optional hreflang rules pass.

## Rules To Keep

- One global domain with fixed locale folders.
- No same-URL language switching by IP, cookies, or browser language.
- No hreflang without complete reciprocal localized alternatives.
- No localized article that only translates English while keeping US products,
  prices, retailers, or assumptions.
- No fake direct testing claims.
- No broad empty categories or locale pages in public navigation.
- No public sections that describe internal SEO/LLM/SERP workflow.
- No React-generated fallback prose for missing recommendation fields.
