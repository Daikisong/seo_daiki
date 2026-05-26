# SEO Rules

## URL and Locale

- Initial locales: `/en`, `/es`, `/pt-br`
- No automatic IP or browser-language redirects
- Every page shows language switch links
- A client-side language preference banner may suggest another locale, but it never redirects automatically
- Each localized page uses a self canonical URL
- Hreflang alternates include available localized variants and `x-default`
- Review paths are localized: `/en/reviews`, `/es/resenas`, `/pt-br/analises`
- Guide paths are localized: `/en/guides`, `/es/guias`, `/pt-br/guias`
- Country-risk paths are regional guide URLs when the content is truly country-specific: `/en-us/guides`, `/en-gb/guides`, `/es-es/guias`, `/pt-br/guias`
- The TypeScript quality gate blocks indexed pages when stored canonical URLs, generated canonical URLs, and self hreflang URLs disagree. For example, `/en/risk/aliexpress-chargers-us-buyers/` must redirect to `/en-us/guides/aliexpress-chargers-us-buyers/`, and the self hreflang for the indexed page must use the regional URL.

## Indexing

Only pages that pass the quality gate should be indexed.

The current initial inventory expands the first USB-C cluster to 110 planned URLs and keeps the indexable set capped at 60 pages.

Indexable example:

```text
review page has 3+ evidence-backed claims
affiliate disclosure exists
affiliate links use rel="sponsored nofollow"
5+ internal links exist
locale risk is not boilerplate
quality score is 80+
```

Noindex example:

```text
seller description was rewritten
no evidence pack exists
no variant trap or market risk exists
internal links are thin
```

## Structured Data

- Review pages: `Article`, `Product`, `Review`, `BreadcrumbList`
- Hub pages: `Article`, `CollectionPage`, `ItemList`, `BreadcrumbList`
- Compare pages: `Article`, `ItemList`, `BreadcrumbList`
- Data pages: `Article`, `Dataset`, `BreadcrumbList`
- The TypeScript quality gate validates the generated JSON-LD helpers before a page can stay indexable. Example: if a review page loses its product record, it becomes `noindex` because Product/Review schema cannot be generated correctly.

## Sitemaps

- `/sitemap.xml` lists only published, indexable article URLs.
- `/sitemaps/index.xml` lists non-empty split sitemap files.
- Split sitemap examples: `/sitemaps/en-hubs.xml`, `/sitemaps/en-products.xml`, `/sitemaps/en-guides.xml`, `/sitemaps/en-lab.xml`, `/sitemaps/en-methodology.xml`, `/sitemaps/es-products.xml`, `/sitemaps/pt-br-products.xml`.
- Country-risk articles are included in the guides sitemap bucket because their canonical URLs are market guide pages, for example `/en-us/guides/aliexpress-chargers-us-buyers/` and `/es-es/guias/cargadores-aliexpress-espana/`.
- Pending or noindex pages can exist for users and admins, but they do not appear in sitemap output.

Affiliate links must use:

```html
rel="sponsored nofollow"
```

Affiliate clicks route through `/api/affiliate-click`, which records the click in database mode and then redirects to the target URL. The visible affiliate button also emits a GA4 `affiliate_click` event when `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is configured. For example, clicking a review CTA sends the article id, product id, locale, label, and target URL before the redirect continues.

## Internal Link Graph

Internal links are selected by a scoring algorithm, not by a fixed sidebar list.

Example: a Baseus 65W review should link to the same-locale charger hub, the country-risk page, the 65W output data table, the lab test, a comparison page, and relevant problem guides.

Scoring signals:

- `same_locale_score`: only same-locale published indexable pages are eligible.
- `same_category_score`: same product category gets a boost, for example USB-C charger to USB-C charger.
- `same_claim_score`: shared evidence IDs, seller claims, or verified claims raise the score.
- `same_problem_score`: shared buyer problems such as variant, plug, cable, customs, return, price, or output raise the score.
- `alternative_price_band_score`: similar price bands help choose useful alternatives.
- `risk_overlap_score`: shared market risks such as certification or return friction raise the score.

The final graph is diversified so one page does not link only to reviews; it tries to include hubs, methodology, risk, data/lab, comparisons, guides, and alternatives when those pages exist.
