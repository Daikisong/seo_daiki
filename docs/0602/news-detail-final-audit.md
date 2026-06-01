# News Detail Final Audit

Date: 2026-06-02

Target:

```text
http://localhost:3000/jp/ja/posts/iphone-18-rumors-japan/
```

Reference intent:

Clean news article detail layout with market nav, breadcrumb, label row, large
headline, metadata row, key points, left table of contents, body sections,
sources/corrections, and previous/next links.

## Result

Subagent score:

```text
99.2 / 100
```

Breakdown:

- Reference format similarity: 99
- Generic reusability for any news post: 99
- Separation from product review UI: 100
- Responsive readability: 99
- SEO/news semantics: 99

## Confirmed

- Live HTML uses `<html lang="ja">`.
- News detail emits `NewsArticle` JSON-LD.
- News detail emits `BreadcrumbList` JSON-LD.
- Publisher metadata includes `/images/review-guide-logo.svg`.
- News detail has desktop sticky TOC and mobile collapsible TOC.
- News detail does not render product score, comparison table, product card, or affiliate CTA.
- Branching is based on normalized `contentBranch`, not repeated route/status OR logic in the UI.

## Captures

```text
docs/0602/news-detail-captures/news-detail-final-1600.png
docs/0602/news-detail-captures/news-detail-final-mobile.png
```

## Checks Run

```text
pnpm typecheck
pnpm seo:validate
pnpm build
python -m unittest workers.python.tests.test_market_content_strategy_modules workers.python.tests.test_market_test_article_modules
```
