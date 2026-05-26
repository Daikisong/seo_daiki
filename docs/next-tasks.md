# Next Tasks

1. Phase 5: add trend, buyer guide, deal watch, and ingredient guide article types and localized routes.
2. Phase 6-10: add translation groups, publishing jobs, health/iHerb guard, offer matching, topic draft generation, and expanded quality gates.
3. Phase 11-14: extend admin, owned-channel draft distribution, link-earning CRM drafts, and Search Console refresh suggestions.
4. Phase 15-19: add trend/offer/link/distribution seed data, scripts, docs, final report, and `data/exports/system_capabilities.json`.
5. Environment task: connect a real Postgres database and run Prisma migration/seed once Docker or Postgres is available.

Completed:

- Phase 2: `/api/admin/article-status` and `pnpm db:admin -- set-index-status` now use the shared publish gate before any article can become indexable.
- Phase 3: Merchant, AffiliateProgram, Offer, and AffiliatePlacement models now back production affiliate redirects; arbitrary `target=` redirects are blocked outside the local development escape hatch.
- Phase 4: TrendSource, TrendSignal, Topic, TopicSignal, and ContentBrief models exist; worker commands now import trend CSVs, cluster topics, score them, generate briefs, and match affiliate merchants.
