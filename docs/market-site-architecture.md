# Market Site Architecture

This document defines the public market site behavior for:

```text
/{market}/{language}/reviews/
/{market}/{language}/news/
```

The nav is a branch selector. It should not hide the `news` tab on product
pages, and it should not hide the `reviews` tab on news pages. A tab click
changes the content branch.

## Branches

### Product Review Branch

Route:

```text
/{market}/{language}/reviews/
/{market}/{language}/rankings/
```

Data rule:

```text
contentBranch = review
```

Legacy exports that do not yet contain `contentBranch` are normalized into this
branch when they have `monetizationRoute = review_comparison`,
`marketExpansionPolicy = translate_all_product_markets`, or
`productCandidateState = allowed_pending`. UI code should read the normalized
`contentBranch`, not repeat the older OR logic.

Shows:

- product reviews
- product/tool comparisons
- buying checks
- rankings based on product review posts

Must not show:

- informational/news posts
- trend score
- SERP opportunity score
- research-only `/trends/` or `/serp/` rows
- labels such as `Latest news` or `最新ニュース`
- labels such as `Latest reviews` or `最新レビュー`

Easy example:

```text
Runway Aleph 2.0 AI video editing
-> review_comparison
-> appears on Product Reviews
-> does not appear on News
```

### News Branch

Route:

```text
/{market}/{language}/news/
```

Data rule:

```text
contentBranch = news
```

Legacy exports that do not yet contain `contentBranch` are normalized into this
branch when they have `monetizationRoute = informational_explainer`,
`marketExpansionPolicy = source_market_only`, or
`productCandidateState = skipped_informational`. UI code should read the
normalized `contentBranch`, not repeat the older OR logic.

Shows:

- informational explainers
- policy/news/rumor context articles
- source-market-only articles
- a public article list with label, date, reading time, source count, and read action

Must not show:

- product review posts
- product rankings
- product comparison cards
- trend score
- SERP opportunity score
- research-only `/trends/` or `/serp/` rows

Easy example:

```text
iPhone 18 rumors Japan
-> informational_explainer
-> appears on News
-> does not appear on Product Reviews
```

## News Detail Pattern

News detail pages use a separate article component, not the product review
detail UI.

Route:

```text
/{market}/{language}/posts/{slug}/
```

Runtime rule:

```text
contentBranch = news
-> MarketNewsPostDetail
-> NewsArticle JSON-LD + BreadcrumbList JSON-LD
```

The news detail pattern follows the clean article reference:

- market nav with `news` active
- breadcrumb
- label row with news type and reading time
- large centered headline and summary
- publish/update/author meta row
- key-point bullets
- desktop sticky TOC on the left
- mobile collapsible TOC above the article body
- numbered content sections
- sources and correction block
- previous/next article links

It must not render:

- review score
- quick verdict product box
- comparison table
- product cards
- affiliate or shopping CTA

Easy example:

```text
iPhone 18 rumors Japan
-> /jp/ja/posts/iphone-18-rumors-japan/
-> news detail format
-> no product score or comparison table
```

Language and structured data:

- `/{market}/{language}/...` pages set `<html lang>` from the URL language.
- News pages emit `NewsArticle`.
- News detail pages also emit `BreadcrumbList`.
- Publisher metadata includes the Review Guide logo.

## Code Ownership

Branch logic:

```text
apps/web/lib/market/market-content-branches.ts
```

Public section router:

```text
apps/web/app/[locale]/[language]/[section]/page.tsx
```

Product review UI:

```text
apps/web/components/market/sections/MarketReviewSections.tsx
```

News UI:

```text
apps/web/components/market/sections/MarketNewsSection.tsx
apps/web/components/market/MarketNewsPostDetail.tsx
```

Shared section copy:

```text
apps/web/components/market/sections/market-section-copy.ts
```

Utility sections:

```text
apps/web/components/market/sections/MarketUtilitySections.tsx
```

Top navigation:

```text
apps/web/components/market/MarketArticleTopbar.tsx
```

Language header proxy:

```text
apps/web/proxy.ts
apps/web/app/layout.tsx
```

Generated verification captures:

```text
docs/0602/news-detail-captures/news-detail-final-1600.png
docs/0602/news-detail-captures/news-detail-final-mobile.png
```

## Verification Checklist

For `/jp/ja/reviews/`:

- nav includes `商品レビュー`, `ランキング`, `ニュース`, `ヒント`, `コミュニティ`
- content includes product review posts such as `Runway`
- content does not include `iPhone 18`
- content does not include `最新レビュー`
- content does not include trend/SERP scores

For `/jp/ja/news/`:

- nav includes `商品レビュー`, `ランキング`, `ニュース`, `ヒント`, `コミュニティ`
- content includes informational posts such as `iPhone 18`
- content does not include product review posts such as `Runway`
- content does not include trend/SERP scores

For `/jp/ja/posts/iphone-18-rumors-japan/`:

- `<html lang="ja">`
- `NewsArticle` JSON-LD exists
- `BreadcrumbList` JSON-LD exists
- news detail has desktop/mobile TOC
- content does not include review score, comparison table, or product cards
