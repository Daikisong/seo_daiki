# TrendBrief Multilingual SEO Operating Model

Date: 2026-06-30

## Position

TrendBrief should not become a site that translates one English affiliate
post into 18 languages. The operating model is a country-triggered buyer
decision site:

```text
country trend signal
-> local searcher problem
-> product or marketplace decision
-> local specs, retailers, prices, returns, warranty, and repeated complaints
```

One global domain is the right early structure. The site should use fixed locale
subdirectories and build authority into one domain instead of splitting early
signals across country domains.

## Locale Structure

The target locale list lives in:

```text
apps/web/lib/trend-site/locales.ts
```

That file is the only place that should define supported locale codes. Current
content only opens `en` as indexable. The other 17 locales are planned and must
not appear as empty indexable pages.

Use this 18-locale plan:

```text
/en/
/en-us/
/en-gb/
/de-de/
/fr-fr/
/it-it/
/es-es/
/ko-kr/
/ja-jp/
/zh-tw/
/zh-hk/
/pt-br/
/nl-nl/
/pl-pl/
/sv-se/
/tr-tr/
/th-th/
/vi-vn/
```

Do not serve Korean, German, Japanese, or French content from the same URL based
on IP, browser language, cookies, or device settings. A URL must have one stable
primary language.

## Publishing Rule

Open the domain early after technical SEO is correct, but only index complete
pages.

Indexable:

- complete trend/buyer-decision articles
- homepage
- trust pages such as About, Methodology, Affiliate Policy, Contact
- category pages only when public and populated

Hidden or noindex:

- planned locale placeholders
- empty country homepages
- empty categories
- draft article variants
- thin translated pages
- tag pages without editorial value

## Hreflang Rule

Hreflang is not automatic. It is only for true localized alternatives of the
same core article.

Allowed cluster:

```text
/en/trends/europe-heatwave-portable-ac-trend-2026/
/de-de/trends/hitzewelle-mobile-klimaanlage-2026/
/fr-fr/trends/canicule-climatiseur-mobile-2026/
```

Only if all versions answer substantially the same buyer decision and are
complete, published, indexable, and reciprocal.

Not a cluster:

```text
/ko-kr/trends/korea-rainy-season-dehumidifier-2026/
/de-de/trends/germany-heatwave-mobile-ac-2026/
/ja-jp/trends/japan-neck-fan-summer-2026/
```

Those are separate local trend articles.

## Canonical Rule

Each localized article canonical points to itself.

Good:

```html
<link
  rel="canonical"
  href="https://example.com/de-de/trends/hitzewelle-mobile-klimaanlage-2026/"
/>
```

Bad:

```html
<link
  rel="canonical"
  href="https://example.com/en/trends/europe-heatwave-portable-ac-trend-2026/"
/>
```

Do not canonical a localized page to English unless the localized page should
not exist as an indexable page.

## Europe Rule

Europe can appear in a slug or article topic. It should not be used as a
hreflang region.

Use:

```text
hreflang="en"
hreflang="en-gb"
hreflang="de-de"
hreflang="fr-fr"
```

Do not use:

```text
en-eu
en-uk
EU
UK
```

## Localization Requirements

For country-targeted trend articles, localize:

- search phrasing
- title and H1
- product class and buyer problem
- currency and price route
- retailers and marketplaces
- shipping and return path
- voltage, plug, sizing, ingredients, compliance, or compatibility
- local review sources where possible
- local reason the trend matters

Do not reuse US products, US prices, US retailers, or US assumptions for another
market unless the product is clearly labeled as reference-only.

## Writing Density

Long pages are acceptable. Verbose pages are not.

Use modular blocks:

- quick answer
- trend signal box
- quick picks
- comparison table
- buying checklist
- product verdict
- repeated complaints
- FAQ
- update log

Review-pattern or specs-first product notes should usually stay around 180-350
words per product. More text is justified only when there is direct-use evidence
or unusually complex local risk.

## Implementation Hooks

Current code enforces the model through:

- `locales.ts`: target locales and indexable status
- `seo.ts`: self-canonical/noindex behavior and opt-in hreflang clusters
- `data.ts`: validation that indexable articles use open locales
- `categories.ts`: public article lists use indexable locales only
- sitemap: uses only indexed canonical article URLs and visible categories

When a new locale is ready, change its `status` to `indexable` only after real
localized articles, trust pages, route behavior, and QA are ready.

## Future Patch Checklist

Before opening any planned locale:

1. Add at least one real localized trend/buyer-decision article for that
   market.
2. Use that market's search phrasing, retailers, prices, delivery, return,
   warranty, compatibility, and local review signals.
3. Keep every localized URL stable; do not add IP, cookie, or browser-language
   redirects.
4. Keep canonical self-referencing.
5. Add hreflang only when a complete reciprocal localized cluster exists.
6. Keep empty categories, empty locale homes, and placeholder pages out of
   sitemap and public navigation.
7. Run tests before changing a locale from `planned` to `indexable`.
