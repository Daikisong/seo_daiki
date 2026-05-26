# Quality Gate

The TypeScript quality gate lives in `packages/validators/src/index.ts`.

Score is out of 100:

```text
search intent clarity              10
unique information                 20
evidence pack or evidence IDs      15
verified data                      20
variant traps                      10
locale risk                        10
internal links                      5
schema/hreflang/canonical           5
affiliate disclosure/link integrity 5
```

Index rule:

```text
80+ and no blockers  -> index
65-79                -> pending
64 or blocker        -> noindex
```

Blocker examples:

- Fewer than 3 evidence-backed claims
- Direct test language without verified claims
- Affiliate link missing `sponsored nofollow`
- Fewer than 5 internal links
- Thin affiliate content with no variant, price, evidence, or market-risk value
- Canonical URL not matching the generated route
- Self hreflang not matching the canonical URL
- Invalid slug format or slug not matching the final URL segment
- Non-absolute hreflang URLs
- Generic `Best ... 20xx` title patterns
- Missing or mismatched JSON-LD for the page type. Example: an indexed review must be able to emit `Article`,
  `Product`, nested `Review`, and `BreadcrumbList` JSON-LD with URLs matching the canonical page.
- Missing Dataset schema on data pages, or missing `CollectionPage` / `ItemList` schema on hub and comparison pages.

SEO integrity warnings:

- Title outside the evidence-first SEO range of 35-80 characters
- Meta description outside the 90-170 character range

The schema validator is exported from `packages/validators/src/schemaValidator.ts`.
It checks the generated SEO helpers rather than hand-written page text. For example,
if a review article has no matching product record, the gate raises
`schema_review_product_missing` because the page cannot produce valid Product/Review JSON-LD.

Run:

```bash
pnpm seo:validate
```

The validator also checks the initial launch invariant:

```text
planned URL inventory = 110
indexable pages = 40-60
```

The Python worker gate lives in `workers/python/validators/quality_gate.py` and writes a machine-readable report:

```bash
python3 workers/python/cli.py run-quality-gate
```

It checks the raw evidence pipeline before a generated article is trusted. Example: the checked-in 10-product seed now produces locale evidence packs with seller claims, variant traps, verified-claim placeholders, price snapshots, affiliate URLs, market risk, and review signals, so the worker gate can pass before the data is imported into Postgres.

Verified lab uploads are stored as `LabEvidenceAsset` records. Example: a sustained-output CSV can be uploaded, linked to a `VerifiedClaim`, and then cited from a review page without inventing test data.
