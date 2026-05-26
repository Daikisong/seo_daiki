# Next Tasks

1. Phase 12-13: add safe owned-channel distribution drafts and link-earning CRM drafts with human approval.
2. Phase 14: expand Search Console refresh suggestions for new article types, localization gaps, offer refreshes, and health warnings.
3. Phase 15-19: add remaining seed files, scripts, docs, final report, and `data/exports/system_capabilities.json`.
4. Environment task: connect a real Postgres database and run Prisma migration/seed once Docker or Postgres is available.

Completed:

- Phase 2: `/api/admin/article-status` and `pnpm db:admin -- set-index-status` now use the shared publish gate before any article can become indexable.
- Phase 3: Merchant, AffiliateProgram, Offer, and AffiliatePlacement models now back production affiliate redirects; arbitrary `target=` redirects are blocked outside the local development escape hatch.
- Phase 4: TrendSource, TrendSignal, Topic, TopicSignal, and ContentBrief models exist; worker commands now import trend CSVs, cluster topics, score them, generate briefs, and match affiliate merchants.
- Phase 5: `trend`, `buyer_guide`, `deal_watch`, and `ingredient_guide` article types now have localized routes, canonical/hreflang paths, sitemap buckets, sample content, and type-specific rendering.
- Phase 6: TranslationGroup, TranslationVariant, and PublishingJob models now exist; worker commands create translation groups, localize article variants, score localization depth, and export hreflang groups.
- Phase 7: Article health/compliance fields now exist; HealthClaimGuard blocks unsupported supplement/medical claims and high-sensitivity health pages without approved compliance.
- Phase 8: Offer matching now scores AliExpress/iHerb inventory, exports draft placement candidates, and adds admin approval/rejection for DB-backed placements.
- Phase 9: Topic article generation is split into brief, draft, localization, and publishing-gate modules; generated drafts start pending/noindex-safe.
- Phase 10: The TypeScript quality gate now checks publish state, unsafe redirects, placement approval, merchant allowlists, localization depth, trend evidence, offer relevance, over-monetization, and health compliance.
- Phase 11: Admin pages now cover trends, topics, briefs, publishing jobs, compliance, localization, merchant/offer editing, and audited status mutations.
