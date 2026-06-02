# Agent Handoff

Date: 2026-06-02

This repository is currently set up as a market-silo trend content system.

## Current Direction

```text
Trend detection
  -> SERP/content format analysis
  -> branch decision
  -> test post
  -> product candidates only for review articles
  -> human-approved monetization later
```

The two public content branches are:

```text
review
  Buying/comparison intent.
  Example: gaming monitor, TV discount, power bank comparison.

news
  Informational trend with weak or inappropriate product-link fit.
  Example: education policy, sports voting schedule, public-service change.
```

## Public Frontend Routes

```text
/{market}/{language}/reviews/
/{market}/{language}/news/
/{market}/{language}/posts/{slug}/
```

Useful local examples:

```text
http://localhost:3000/kr/ko/news/
http://localhost:3000/kr/ko/posts/%EA%B5%90%EC%9C%A1%EA%B3%B5%EB%AC%B4%EC%9B%90-2026-%ED%99%95%EC%9D%B8%EC%82%AC%ED%95%AD/
http://localhost:3000/jp/ja/reviews/
```

## Important Boundary

The `news` page must not look like an internal dashboard.

Keep this public shape:

```text
title/summary
key points
table of contents
article body
bottom sources/correction
previous/next links
```

Do not re-add separate top utility panels for audience segmentation, Q&A blocks, glossary blocks, or checklist-card bundles. If the reader needs the information, write it as a normal article section.

Example:

```text
Bad:
  A stack of management-style boxes before the article body.

Good:
  A section titled "지원 전에 꼭 구분할 것" that explains the point in normal prose.
```

## Key Files

```text
apps/web/app/[locale]/[language]/posts/[slug]/page.tsx
  Branch selection and metadata.

apps/web/components/market/MarketReviewPostDetail.tsx
  Review article UI.

apps/web/components/market/MarketNewsPostDetail.tsx
  News article UI.

apps/web/components/market/market-news-post-detail-model.ts
  News section anchors, key-point fallback, paragraph splitting.

apps/web/components/market/market-news-post-detail-labels.ts
  News UI labels by language.

apps/web/lib/market/market-publishing-data-readers.ts
  Reads data/exports/test_articles.json into MarketPostView.

apps/web/lib/market/market-data-types.ts
  Public market data types.

scripts/seo-article-quality/
  JSON and rendered-page quality checks.
```

## Documentation Map

```text
docs/architecture.md
  Short current architecture summary.

docs/core/architecture.md
  Detailed current architecture.

docs/core/korean-news-posting-template.md
  Korean news article writing and data policy.

docs/todo.md
  Next expansion TODO.

docs/0602/kr-market-todo-application.md
  Korean market application note for the current news article.
```

## Validation Commands

Run these after frontend/data changes:

```text
pnpm typecheck
pnpm seo:article-quality
pnpm seo:market-audit
pnpm build
```

`pnpm seo:article-quality` should catch two important regressions:

```text
public article exposes internal workflow language
news detail page renders dashboard-like utility panels
```

## Current SEO State

Most test posts still use `noindex` until editorial/index promotion is explicitly implemented. Do not flip them to index just because a local test passes.

The SEO structure safety checklist is documented separately:

```text
docs/next-goal-seo-structure-patches.md
```

That document is kept as the regression checklist for research-page noindex policy, hreflang variant safety, sitemap eligibility, and production canonical safety.
