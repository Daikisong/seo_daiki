# Next Tasks

1. Finish the current modularization/refactor pass with focused unit tests and static verification.
2. Apply the SEO structure safety patches documented in `docs/next-goal-seo-structure-patches.md`.
3. Production environment task: run the verified Prisma migration/seed flow against the managed Postgres instance that will back the deployed site.

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
- Phase 12: Owned-channel distribution drafts now generate from article outputs, require human approval, and keep sending disabled by default.
- Phase 13: Linkable asset scoring, prospect import/scoring, and outreach draft generation now exist without automatic backlink creation or email sending.
- Phase 14: Search Console refresh suggestions now cover new article types, offer replacement candidates, localization gaps, and health claim risk warnings.
- Phase 15: Local seed/sample data now covers trends, offers, merchants, distribution rules, link prospects, generated drafts, and safety-blocked examples.
- Phase 16: `.env.example` now lists site, DB, AliExpress, iHerb, LLM, Search Console, storage, distribution, outreach, and safety variables.
- Phase 17: Root package scripts now cover trend import/cluster/score, brief generation, offer matching, publishing gate, localization scoring, affiliate/compliance audits, distribution generation, and link scoring.
- Phase 18: README and docs now cover operations, safety rules, posting drafts, outreach compliance, offer matching, admin operations, and the Search Console refresh loop.
- Phase 19: `docs/final-implementation-report.md` and `data/exports/system_capabilities.json` now summarize the final system and verification results.
