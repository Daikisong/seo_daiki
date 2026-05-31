# SEO Rules

## URL, Market, and Locale

- Trend-first market silos use explicit market/language routes such as `/us/en/`, `/es/es/`, `/br/pt-br/`, and `/kr/ko/`.
- Legacy locale entry points `/en`, `/es`, and `/pt-br` redirect to their default market routes.
- No automatic IP or browser-language redirects
- Every page shows language switch links
- A client-side language preference banner may suggest another locale, but it never redirects automatically
- Each localized page uses a self canonical URL
- Hreflang alternates include available localized variants and `x-default`
- Market content hreflang alternates must be generated only from existing variants. For example, `/us/en/trends/magnesium-sleep/` must not emit `/gb/en/trends/magnesium-sleep/` unless the GB variant exists.
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

- `/sitemap.xml` lists only published, indexable article URLs, global overview pages, and market homes that meet content-depth thresholds.
- `/sitemaps/index.xml` is not advertised until a real sitemap index route exists.
- Market homes are included only when they have at least 3 trend clusters, 3 SERP opportunities, or 1 public-ready post. Empty markets stay out by default.
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
