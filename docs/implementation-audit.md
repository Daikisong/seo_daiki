# Implementation Audit

This audit records the current behavior before extending the product-evidence MVP into the trend-driven affiliate
operating system described in `docs/goal.md`.

## Files Inspected

- `README.md`
- `packages/db/prisma/schema.prisma`
- `packages/types/src/index.ts`
- `packages/seo/src/canonical.ts`
- `packages/seo/src/sitemap.ts`
- `packages/validators/src/index.ts`
- `apps/web/lib/content/page-loaders.ts`
- `apps/web/lib/seo/metadata.ts`
- `apps/web/app/api/affiliate-click/route.ts`
- `workers/python/cli.py`
- `workers/python/writers/article_draft_generator.py`
- `workers/python/writers/llm_provider.py`
- `workers/python/intelligence/search_console_feedback.py`

## 1. Existing Product-Evidence SEO Support

The repo already has a strong product-evidence core:

- Next.js App Router article pages for hubs, reviews, guides, compare, data, lab, methodology, and country-risk pages.
- Localized review and guide routes, including `/es/resenas`, `/pt-br/analises`, `/es/guias`, and `/pt-br/guias`.
- Regional country-risk guide routes such as `/en-us/guides/aliexpress-chargers-us-buyers/`.
- Prisma models for `Product`, `Variant`, `SellerClaim`, `VerifiedClaim`, `ReviewSignal`, `PriceSnapshot`,
  `MarketRisk`, `EvidencePack`, `Article`, `AffiliateClick`, `SearchConsoleMetric`, `PageRefreshSuggestion`, and
  `AuditLog`.
- TypeScript content types for the product evidence graph and article quality state.
- SEO helpers for canonical URLs, hreflang keys, localized section paths, sitemap eligibility, and JSON-LD.
- Quality gate validators for evidence, thin affiliate risk, internal links, hreflang, SEO integrity, JSON-LD schema,
  and affiliate rel integrity.
- Python workers for seed import, identity grouping, variant traps, seller claims, price truth, locale risk, review
  signals, verified claims, evidence packs, outlines, drafts, URL inventory, and Search Console suggestions.
- Dry-run and real LLM provider boundary for OpenAI, Gemini, Anthropic, and Ollama.

## 2. Missing Trend-Based Multilingual Affiliate Blogging Support

The repo does not yet have the full trend operating system:

- No `TrendSource`, `TrendSignal`, `Topic`, `TopicSignal`, or `ContentBrief` models.
- No trend signal CSV importer, clustering, topic scoring, or content brief worker.
- No trend article types or localized trend routes for `trend`, `buyer_guide`, `deal_watch`, or `ingredient_guide`.
- No translation group, translation variant, localization depth score, or publishing job model.
- No topic draft generator or topic localizer that writes database `Article` records from `ContentBrief`.
- Search Console suggestions only understand existing product evidence article types.

## 3. Route and Publication Safety Problems

Before Phase 1 patching, public article loaders rendered any existing article regardless of `publishStatus`.
For example, a `draft` review could be fetched if the route matched its locale/type/slug.

The patched behavior is:

- `draft` and `pending` articles return `notFound()` on public routes.
- A valid `PREVIEW_TOKEN` passed as `?previewToken=<token>` allows preview rendering.
- Preview rendering always forces `noindex`.
- Published pages still render normally.
- Published pages with `indexStatus != index` render with `robots: noindex, follow`.
- Static params are limited to published articles.

## 4. Affiliate Redirect Safety Problems

The current affiliate redirect route accepts `?target=<url>` and redirects to any valid HTTP(S) URL.
This is acceptable only as a local/sample MVP pattern. It does not satisfy the final safety requirement because:

- It is not placement-backed.
- It does not verify an approved `AffiliatePlacement`.
- It does not check merchant enabled state.
- It does not validate the target host against merchant allowed domains.
- It cannot record merchant, offer, or placement IDs.

The final system needs `Merchant`, `AffiliateProgram`, `Offer`, and `AffiliatePlacement` models, then
`/api/affiliate-click?placementId=<id>` should be the production path. Arbitrary target redirects should remain
disabled by default and available only in development with `ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT=true`.

## 5. Health and iHerb Compliance Gaps

The current repo has no health compliance layer:

- No `healthSensitivity`, `complianceStatus`, or `complianceJson` fields on `Article`.
- No iHerb merchant or offer inventory.
- No `HealthClaimGuard`.
- No supplement disclaimer renderer.
- No manual approval rule for high-sensitivity health pages.
- No blockers for disease treatment, dosage advice, unsupported medical language, or supplement offer placement.

This means ingredient guides and supplement buyer guides must remain out of production index flows until Phase 7 is
implemented.

## 6. Models and Workers to Add

The next phases should add these core models:

- Merchant layer: `Merchant`, `AffiliateProgram`, `Offer`, `AffiliatePlacement`.
- Trend layer: `TrendSource`, `TrendSignal`, `Topic`, `TopicSignal`, `ContentBrief`.
- Multilingual layer: `TranslationGroup`, `TranslationVariant`, `PublishingJob`.
- Distribution layer: `DistributionAsset`, `DistributionRule`, `DistributionResult`.
- Link earning layer: `LinkableAsset`, `LinkProspect`, `OutreachCampaign`, `OutreachMessage`, `SuppressionEntry`.

The next workers should add:

- `import-trend-signals`
- `cluster-topics`
- `score-topics`
- `generate-content-briefs`
- `match-affiliate-offers`
- `generate-topic-draft`
- `localize-topic-draft`
- `run-publishing-gate`
- localization scoring and hreflang group syncing
- distribution draft generation
- linkable asset and prospect scoring

