# Next Tasks

1. Phase 8-10: add advanced offer scoring, topic article generator modules, and expanded quality gate guards for placements/localization/trends/deals.
2. Phase 11-14: extend admin, owned-channel draft distribution, link-earning CRM drafts, and Search Console refresh suggestions.
3. Phase 15-19: add trend/offer/link/distribution seed data, scripts, docs, final report, and `data/exports/system_capabilities.json`.
4. Environment task: connect a real Postgres database and run Prisma migration/seed once Docker or Postgres is available.

Completed:

- Phase 2: `/api/admin/article-status` and `pnpm db:admin -- set-index-status` now use the shared publish gate before any article can become indexable.
- Phase 3: Merchant, AffiliateProgram, Offer, and AffiliatePlacement models now back production affiliate redirects; arbitrary `target=` redirects are blocked outside the local development escape hatch.
- Phase 4: TrendSource, TrendSignal, Topic, TopicSignal, and ContentBrief models exist; worker commands now import trend CSVs, cluster topics, score them, generate briefs, and match affiliate merchants.
- Phase 5: `trend`, `buyer_guide`, `deal_watch`, and `ingredient_guide` article types now have localized routes, canonical/hreflang paths, sitemap buckets, sample content, and type-specific rendering.
- Phase 6: TranslationGroup, TranslationVariant, and PublishingJob models now exist; worker commands create translation groups, localize article variants, score localization depth, and export hreflang groups.
- Phase 7: Article health/compliance fields now exist; HealthClaimGuard blocks unsupported supplement/medical claims and high-sensitivity health pages without approved compliance.
