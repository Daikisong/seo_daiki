# SERP Article Quality Gate

This gate prevents test posts from looking like SEO-ready articles when the
SERP evidence is too thin.

The article can use the review-guide frontend, but it still needs structured
SERP evidence before it can be promoted.

## Required Per Article

- At least 3 SERP references.
- Each SERP reference must include:
  - rank
  - label
  - public URL
  - formatPattern
- SERP ranks must be numeric and unique.
- SERP references should cover at least 3 unique domains.
- At least 2 public source links must overlap with the SERP references.
- The article must include a checklist with at least 5 items.
- The article must include a comparison table with at least 3 rows.

## Why

Example:

```text
Bad:
"We checked top pages."

Good:
Rank 1 URL -> headline + verdict box + buying checklist
Rank 2 URL -> price-led structure + coupon warning
Rank 3 URL -> lab review + measurement table
```

The article should not copy these pages. It should use them to understand the
expected format, missing angles, comparison criteria, and source needs.

## Command

```bash
pnpm seo:serp-audit
```

The report is written to:

```text
data/exports/serp_article_quality_report.json
```

## Boundary

This does not implement raw Google scraping, proxy scraping, CAPTCHA bypass, or
rank-checking automation. SERP evidence must come from allowed provider modes
already documented in `docs/serp-provider-contract.md`.
