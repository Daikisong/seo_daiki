You are working in the GitHub repository:

Songdaiki/seo_daiki

Mission:
Transform the current Global Import Lab product-evidence SEO MVP into a full multilingual trend-driven affiliate content operating system.

The existing repo already has a useful SEO core:
- Next.js App Router web app
- Prisma/Postgres schema
- Product / Variant / SellerClaim / VerifiedClaim / ReviewSignal / PriceSnapshot / MarketRisk / EvidencePack / Article
- multilingual locales en / es / pt-br
- canonical / hreflang / sitemap / JSON-LD helpers
- quality gate validators
- AliExpress worker boundary
- Search Console feedback suggestion worker
- admin mutation endpoints

Do NOT rewrite the whole project.
Do NOT delete the existing product-evidence architecture.
Extend it cleanly.

The final system must support:
1. trend/topic discovery,
2. topic clustering and scoring,
3. content brief generation,
4. AliExpress and iHerb affiliate offer matching,
5. multilingual article generation and localization,
6. strict publish/index gates,
7. iHerb/health/supplement compliance checks,
8. safe affiliate redirect through DB-backed placements,
9. Search Console refresh loop,
10. optional safe owned-channel posting drafts,
11. optional link-earning/outreach CRM drafts,
12. no blackhat SEO automation.

Very important:
- Do not ask me questions.
- Make the best implementation choices from the current repo.
- Apply patches directly.
- Keep the repo buildable.
- If a real external API cannot be implemented fully, create a disabled-by-default adapter with clear docs and sample data.
- No TODO-only stubs for core domain models, validators, or route safety.
- At the end, run or document:
  pnpm typecheck
  pnpm seo:validate
  pnpm build

────────────────────────────────────
HARD SAFETY / SEO CONSTRAINTS
────────────────────────────────────

Do NOT implement:
- comment spam bots
- forum profile backlink bots
- Reddit/Quora/community auto-posting
- automatic account creation
- CAPTCHA bypass
- proxy rotation
- automated upvotes/likes/follows
- PBN creation
- directory/bookmark spam submission
- Google SERP scraping
- Google Indexing API submission for normal article/review pages
- arbitrary redirect endpoints

Use only:
- official APIs where configured,
- manual CSV seed import,
- Search Console data,
- owned-channel publishing,
- human-approved outreach drafts,
- sitemap-based crawling for Google.

All affiliate links must use rel="sponsored nofollow".
All affiliate redirects must be DB-backed.
No arbitrary target URL redirect in production.

Health / supplement / iHerb content must be conservative:
- no disease cure/treat/prevent claims,
- no dosage/medical advice without qualified evidence,
- no “guaranteed”, “cures”, “doctor recommended” without support,
- high-risk health pages require manual approval before indexing,
- supplement articles must include a health disclaimer,
- supplement offer placement must pass HealthClaimGuard.

────────────────────────────────────
PHASE 0 — AUDIT CURRENT REPO FIRST
────────────────────────────────────

Before patching, inspect these files and summarize current behavior in docs/implementation-audit.md:

- README.md
- packages/db/prisma/schema.prisma
- packages/types/src/index.ts
- packages/seo/src/canonical.ts
- packages/seo/src/sitemap.ts
- packages/validators/src/index.ts
- apps/web/lib/content/page-loaders.ts
- apps/web/lib/seo/metadata.ts
- apps/web/app/api/affiliate-click/route.ts
- workers/python/cli.py
- workers/python/writers/article_draft_generator.py
- workers/python/writers/llm_provider.py
- workers/python/intelligence/search_console_feedback.py

The audit must explicitly answer:
1. Which parts already support product-evidence SEO?
2. Which parts are missing for trend-based multilingual affiliate blogging?
3. Which route/publication safety problems exist?
4. Which affiliate redirect safety problems exist?
5. Which health/iHerb compliance gaps exist?
6. Which models and workers will be added?

────────────────────────────────────
PHASE 1 — PUBLIC ROUTE / PUBLISHING SAFETY
────────────────────────────────────

Patch public article loading.

Current issue:
- loadArticlePage currently loads an Article if it exists.
- It should not expose draft or pending articles publicly.

Implement this state model:

publishStatus:
- draft
- pending
- published

indexStatus:
- index
- noindex
- pending
- refresh_needed
- merge_candidate

Public route behavior:
1. publishStatus = draft:
   - public route returns notFound()
   - only preview route can show it with valid PREVIEW_TOKEN

2. publishStatus = pending:
   - public route returns notFound()
   - only preview route can show it with valid PREVIEW_TOKEN

3. publishStatus = published and indexStatus != index:
   - public route renders the page
   - metadata robots must be noindex, follow

4. publishStatus = published and indexStatus = index:
   - public route renders normally
   - metadata robots index, follow

Tasks:
- Patch apps/web/lib/content/page-loaders.ts
- Add preview-token handling.
- Use process.env.PREVIEW_TOKEN.
- A preview request may pass ?previewToken=<token>.
- Do not require preview for normal published pages.
- generateStaticParams must only include published articles.
- Sitemap must still include only published + index.
- Admin pages may still load draft/pending internally.
- Add docs/publishing-state.md.

Acceptance:
- Draft article public URL returns notFound.
- Pending article public URL returns notFound.
- Draft/pending with valid preview token renders.
- Published/noindex renders with robots noindex.
- Published/index renders with robots index.
- Sitemaps include only published/index.

────────────────────────────────────
PHASE 2 — HARDEN ADMIN INDEX MUTATIONS
────────────────────────────────────

Current issue:
- /api/admin/article-status can set indexStatus manually.
- This can bypass the quality gate.

Patch:
- apps/web/app/api/admin/article-status/route.ts
- packages/db admin mutation layer if needed.

Rules:
1. Admin cannot set indexStatus=index unless server-side quality gate passes.
2. Admin cannot set publishStatus=published + indexStatus=index unless:
   - qualityScore >= 80
   - quality gate returns index
   - no blocker issues
   - affiliate links valid
   - canonical/hreflang valid
   - article has sufficient evidence
   - health/compliance gate passes if relevant
3. If blocked, return 400 with structured reasons.
4. Write AuditLog for both successful and blocked attempts.
5. Allow admin to set noindex/pending/draft freely for safety.

Add:
- docs/admin-publish-gate.md

────────────────────────────────────
PHASE 3 — AFFILIATE ENGINE: MERCHANT / OFFER / PLACEMENT
────────────────────────────────────

Current issue:
- Article.affiliateLinks JSON is too weak for multi-merchant operations.
- /api/affiliate-click accepts arbitrary target URL.
- Need AliExpress + iHerb + future merchants.

Add Prisma models:

model Merchant {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  domain          String
  merchantType    String   // marketplace, supplement_store, retailer, network
  allowedDomains  Json
  defaultRel      String   @default("sponsored nofollow")
  healthSensitive Boolean  @default(false)
  enabled         Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model AffiliateProgram {
  id              String   @id @default(cuid())
  merchantId      String
  merchant        Merchant @relation(fields: [merchantId], references: [id], onDelete: Cascade)
  network         String   // inhouse, impact, admitad, partnerize, etc.
  trackingId      String?
  termsNote       String?
  status          String   @default("active")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Offer {
  id              String   @id @default(cuid())
  merchantId      String
  merchant        Merchant @relation(fields: [merchantId], references: [id], onDelete: Cascade)
  programId       String?
  productId       String?
  topicId         String?
  title           String
  description     String?
  url             String
  affiliateUrl    String
  price           Decimal? @db.Decimal(10, 2)
  currency        String?
  locale          String?
  country         String?
  category        String
  evidenceLevel   String   @default("merchant_claim")
  healthSensitive Boolean  @default(false)
  lastCheckedAt   DateTime?
  status          String   @default("active")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([merchantId, locale, category])
  @@index([productId])
  @@index([topicId])
}

model AffiliatePlacement {
  id              String   @id @default(cuid())
  articleId       String
  offerId         String
  placementType   String   // cta, inline, card, comparison_table, ingredient_card
  anchorText      String
  rel             String   @default("sponsored nofollow")
  disclosureShown Boolean  @default(false)
  status          String   @default("draft") // draft, approved, disabled
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([articleId, status])
  @@index([offerId])
}

Update AffiliateClick:
- add placementId
- add offerId
- add merchantId

New redirect rules:
- Replace arbitrary target mode with placementId mode.
- /api/affiliate-click?placementId=<id>
- Look up AffiliatePlacement -> Offer -> Merchant.
- Reject if placement is not approved.
- Reject if offer is inactive.
- Reject if merchant is disabled.
- Reject if affiliateUrl host is not in merchant.allowedDomains.
- Record AffiliateClick with placementId, offerId, merchantId, articleId, productId, locale, referrer, UTM.
- Redirect to Offer.affiliateUrl.
- Keep old target mode only in development behind ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT=true.
- Never allow arbitrary target redirect in production.

Seed merchants:
- aliexpress
  - slug: aliexpress
  - merchantType: marketplace
  - healthSensitive: false
  - allowedDomains include aliexpress.com and known AliExpress affiliate/tracking domains configurable via env/seed
- iherb
  - slug: iherb
  - merchantType: supplement_store
  - healthSensitive: true
  - allowedDomains include iherb.com and known iHerb tracking domains configurable via env/seed

Add admin pages:
- /admin/merchants
- /admin/offers
- /admin/placements

Add docs:
- docs/merchant-offer-engine.md
- docs/affiliate-redirect-safety.md

Acceptance:
- No production path accepts arbitrary target redirect.
- AffiliateOutboundLink renders placementId URLs.
- Affiliate placements require rel sponsored nofollow.
- Click tracking records merchant/offer/placement.

────────────────────────────────────
PHASE 4 — TREND TOPIC ENGINE
────────────────────────────────────

Add topic/trend models:

model TrendSource {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  sourceType  String   // manual_csv, search_console, google_trends, reddit, youtube, pinterest, rss
  locale      String?
  country     String?
  enabled     Boolean  @default(true)
  configJson  Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TrendSignal {
  id               String   @id @default(cuid())
  sourceId          String
  locale            String
  country           String?
  query             String
  topicRaw          String
  url               String?
  volumeScore       Float    @default(0)
  growthScore       Float    @default(0)
  competitionScore  Float    @default(0)
  commercialScore   Float    @default(0)
  freshnessScore    Float    @default(0)
  evidenceFitScore  Float    @default(0)
  affiliateFitScore Float    @default(0)
  capturedAt        DateTime @default(now())

  @@index([locale, country, capturedAt])
  @@index([query])
}

model Topic {
  id              String   @id @default(cuid())
  canonicalTopic  String
  slug            String   @unique
  cluster         String
  primaryLocale   String
  intent          String   // informational, commercial, problem, comparison, seasonal, deal, health
  healthSensitive Boolean  @default(false)
  status          String   @default("candidate") // candidate, briefed, drafted, published, rejected
  score           Float    @default(0)
  scoreBreakdown  Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model TopicSignal {
  id             String @id @default(cuid())
  topicId        String
  trendSignalId  String
  weight         Float @default(1)

  @@index([topicId])
  @@index([trendSignalId])
}

model ContentBrief {
  id               String   @id @default(cuid())
  topicId           String
  locale            String
  articleType       String
  titleCandidate    String
  h1Candidate       String?
  searchIntent      String
  outlineJson       Json
  requiredEvidence  Json?
  merchantFitJson   Json?
  localizationNotes Json?
  healthSensitivity String   @default("none") // none, low, medium, high
  status            String   @default("draft") // draft, approved, rejected, converted
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([topicId, locale])
}

Trend scoring formula:
topic_score =
  growthScore * 0.25
+ commercialScore * 0.20
+ evidenceFitScore * 0.20
+ affiliateFitScore * 0.15
+ lowCompetitionScore * 0.10
+ freshnessScore * 0.10

Add worker commands:
- collect-trend-signals
- import-trend-signals --file data/seeds/trend-signals.csv
- cluster-topics
- score-topics
- generate-content-briefs
- match-affiliate-offers
- generate-topic-draft
- localize-topic-draft
- run-publishing-gate

Trend source v1:
- manual CSV importer
- Search Console query expansion from existing SearchConsoleMetric
- Google Trends adapter disabled by default unless configured
- Reddit/YouTube/Pinterest/RSS adapters disabled by default
- No Google SERP scraping

Add sample seed:
data/seeds/trend-signals.csv

Sample topic clusters:
- USB-C travel charger fake wattage
- portable power bank real capacity
- magnesium sleep supplement
- probiotic gut health supplement
- travel adapter import checklist
- desk setup gadget trend

Add docs:
- docs/trend-engine.md

Acceptance:
- Trend signals can be imported from CSV.
- Topics can be clustered.
- Topics receive score and intent.
- ContentBrief records can be generated.
- No external scraping required for local run.

────────────────────────────────────
PHASE 5 — ARTICLE TYPES AND ROUTES FOR TREND BLOGGING
────────────────────────────────────

Extend ArticleType in packages/types/src/index.ts:

Existing:
- hub
- review
- guide
- compare
- data
- lab
- risk
- methodology

Add:
- trend
- buyer_guide
- deal_watch
- ingredient_guide

Route structure:

English:
- /en/trends/[slug]
- /en/buyer-guides/[slug]
- /en/deals/[slug]
- /en/ingredients/[slug]

Spanish:
- /es/tendencias/[slug]
- /es/guias-de-compra/[slug]
- /es/ofertas/[slug]
- /es/ingredientes/[slug]

Portuguese Brazil:
- /pt-br/tendencias/[slug]
- /pt-br/guias-de-compra/[slug]
- /pt-br/ofertas/[slug]
- /pt-br/ingredientes/[slug]

Update:
- packages/seo/src/canonical.ts
- route loaders
- static params
- metadata
- sitemap buckets
- JSON-LD helpers if needed
- content type docs
- ArticlePage rendering for new types

Rendering:
trend:
- trend summary
- why it is rising
- evidence/source signals
- related buyer problems
- relevant offers, if approved
- internal links
- localization notes
- update log

buyer_guide:
- decision framework
- who should buy/avoid
- comparison table
- affiliate offers
- evidence and risk blocks

deal_watch:
- price history
- buy/wait/avoid zone
- offer table
- last checked
- no fake urgency language

ingredient_guide:
- what the ingredient is
- what claims are supported/unsupported
- safety warnings
- iHerb offers only after HealthClaimGuard passes
- health disclaimer

Acceptance:
- New routes compile.
- New ArticleTypes are included in validators.
- New routes use localized paths.
- Sitemaps can include these only if indexable.
- Hreflang/canonical work.

────────────────────────────────────
PHASE 6 — MULTILINGUAL PUBLISHING ENGINE
────────────────────────────────────

Add models:

model TranslationGroup {
  id                 String   @id @default(cuid())
  canonicalTopicId   String?
  sourceArticleId    String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model TranslationVariant {
  id                     String   @id @default(cuid())
  groupId                 String
  articleId               String
  locale                  String
  sourceLocale            String?
  localizationDepthScore  Float    @default(0)
  status                  String   @default("draft") // draft, localized, approved, published
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  @@index([groupId, locale])
  @@index([articleId])
}

model PublishingJob {
  id              String   @id @default(cuid())
  topicId          String?
  articleId        String?
  locale           String
  jobType          String   // draft, localize, validate, publish, refresh
  status           String   @default("queued") // queued, running, done, failed, blocked
  inputJson        Json?
  outputJson       Json?
  error            String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([status, jobType])
  @@index([articleId])
}

Localization depth scoring:
localizationDepthScore =
  localizedQueryFit * 0.25
+ localRiskCoverage * 0.20
+ localOfferFit * 0.20
+ languageQuality * 0.15
+ nonBoilerplateScore * 0.10
+ localExamples * 0.10

Rules:
- Translation-only pages must remain noindex.
- A localized article must include at least:
  - localized title/h1/meta,
  - local search intent,
  - local risk or market notes,
  - local offer availability or explicit “no suitable local offer” note,
  - hreflang group,
  - non-boilerplate localized content.
- If localizationDepthScore < 70, indexStatus must be pending or noindex.
- If localizationDepthScore >= 80 and other gates pass, index may be allowed.

Add worker commands:
- create-translation-group
- localize-article --article-id <id> --locale es
- localize-article --article-id <id> --locale pt-br
- score-localization
- sync-hreflang-groups

Add docs:
- docs/multilingual-publishing.md

Acceptance:
- One English Topic/Article can create ES and PT-BR variants.
- Variants are linked by TranslationGroup.
- Hreflang maps are generated from the group.
- Translation-only pages are blocked from index.

────────────────────────────────────
PHASE 7 — IHERB / HEALTH COMPLIANCE GATE
────────────────────────────────────

Add health fields:
- Article.healthSensitivity if Article model supports direct field; otherwise store in Article.sections/json or add schema field.
- Topic.healthSensitive already added.
- Offer.healthSensitive already added.
- Merchant.healthSensitive already added.

Preferred Prisma Article additions:
- healthSensitivity String @default("none")
- complianceStatus String @default("unchecked") // unchecked, passed, blocked, manual_required
- complianceJson Json?

Implement HealthClaimGuard in packages/validators:

Blockers:
1. disease cure/treat/prevent claims without qualified evidence.
2. supplement dosage advice without source.
3. “guaranteed”, “cures”, “prevents”, “doctor recommended”, “clinically proven” without evidence.
4. medical advice language.
5. supplement offer placement without disclaimer.
6. missing warning for pregnancy, medication, children, chronic illness when relevant.
7. unsupported before/after or transformation claims.
8. article recommends replacing medical treatment.
9. high health sensitivity article trying to auto-index without manual approval.

Warnings:
- weak source quality,
- overly broad wellness claims,
- anecdotal language,
- “best supplement” generic title.

Required supplement disclaimer:
- visible near first iHerb offer and near article footer.
- must say content is informational and not medical advice.
- must advise consulting a qualified professional for pregnancy, medication, chronic illness, or children.

Add:
- packages/validators/src/healthClaimGuard.ts
- tests or validation fixtures
- docs/iherb-compliance.md

Update quality gate:
- For any Article with healthSensitivity medium/high or any iHerb Offer placement:
  - run HealthClaimGuard
  - block index on health blockers
  - high sensitivity requires manual approval
  - supplement offer placement requires disclosure and disclaimer

Acceptance:
- iHerb offer cannot be indexed inside unsupported medical claims.
- High sensitivity health article cannot auto-publish/index.
- Health disclaimers render for ingredient_guide and supplement-related buyer_guide.
- Health guard contributes to quality gate.

────────────────────────────────────
PHASE 8 — OFFER MATCHING ENGINE
────────────────────────────────────

Implement offer matching:

Input:
- Topic
- ContentBrief
- Article draft
- locale
- country
- merchant constraints
- health sensitivity
- existing Product evidence
- Offer inventory

Output:
- AffiliatePlacement candidates

Scoring:
offer_score =
  topicalFit * 0.25
+ localeFit * 0.15
+ merchantTrust * 0.15
+ evidenceLevel * 0.15
+ priceFreshness * 0.10
+ conversionFit * 0.10
+ complianceFit * 0.10

Rules:
- AliExpress preferred for:
  - gadgets
  - import gear
  - chargers/cables
  - power banks
  - tools
  - sensors
  - desk setup
- iHerb allowed for:
  - supplement
  - ingredient
  - wellness
  - nutrition
  - beauty from supplement angle
- iHerb blocked if:
  - HealthClaimGuard has blockers
  - no disclaimer
  - article healthSensitivity high and not manually approved
- Never insert offer solely because it has high commission.
- Offers must be relevant to the user intent.
- Prefer data/lab/guide internal links above raw affiliate CTAs.
- Do not over-place affiliate links.

Placement limits:
- trend article: max 2 offer placements
- buyer_guide: max 4 offer placements
- deal_watch: max 6 offer placements
- ingredient_guide: max 3 offer placements, all health-guarded
- review: existing product CTA plus alternatives

Add worker command:
- match-affiliate-offers --topic-id <id>
- match-affiliate-offers --article-id <id>

Add admin:
- /admin/offer-matching
- approve/reject placements

Acceptance:
- Offer candidates generated.
- Placements default to draft.
- Human approval needed before rendering live CTA.
- Approved placement renders via placementId affiliate redirect only.

────────────────────────────────────
PHASE 9 — TREND ARTICLE GENERATION
────────────────────────────────────

Current draft generator writes markdown files from evidence packs.
Extend it into topic/article generation while preserving current product flow.

Add:
- workers/python/writers/topic_brief_generator.py
- workers/python/writers/topic_article_generator.py
- workers/python/writers/topic_localizer.py
- workers/python/validators/publishing_gate.py

Generation flow:
TrendSignal -> Topic -> ContentBrief -> Draft Article -> Localized variants -> QualityGate -> PublishingJob

LLM rules:
- Write only from ContentBrief + EvidencePack + Offer inventory.
- Do not invent prices, discounts, health claims, product specs, certifications, or reviews.
- Do not say “we tested” unless VerifiedClaim exists.
- Do not say “clinically proven” unless source exists.
- No fake urgency.
- No fake personal experience.
- No medical advice.
- No unsupported supplement efficacy claims.
- Include update log.
- Include affiliate disclosure if offers exist.
- Include health disclaimer if iHerb/supplement content exists.
- Include local market notes for localized pages.
- Include internal links to relevant hub/data/lab/guide pages.

Article DB creation:
- New generated Article should start as:
  publishStatus = pending
  indexStatus = pending
  qualityScore = computed
- Never auto-set index without passing gate.
- If no DB is available, write JSON/MD draft to data/drafts and data/exports.

Add commands:
- generate-topic-draft --topic-id <id> --locale en
- generate-topic-draft --brief-id <id>
- localize-topic-draft --article-id <id> --locale es
- localize-topic-draft --article-id <id> --locale pt-br
- run-publishing-gate --article-id <id>

Acceptance:
- Topic draft generation works with dry-run provider.
- Real providers still work through existing LLM_PROVIDER interface.
- Generated article never becomes public/indexable without gate.

────────────────────────────────────
PHASE 10 — QUALITY GATE EXPANSION
────────────────────────────────────

Expand current packages/validators quality gate.

Existing validators should remain:
- affiliate link rel
- internal links
- hreflang
- SEO integrity
- structured data
- claim evidence
- thin affiliate

Add:
- publishStateGuard
- affiliatePlacementGuard
- merchantAllowlistGuard
- healthClaimGuard
- localizationDepthGuard
- trendEvidenceGuard
- offerRelevanceGuard
- unsafeRedirectGuard
- overMonetizationGuard

Indexable article must pass:
1. publishStatus = published
2. qualityScore >= 80
3. no blocker issues
4. no unsafe redirect issues
5. affiliate placements approved and valid
6. no thin affiliate risk
7. localizationDepthScore >= 80 for translated/localized pages
8. health guard passed when applicable
9. enough internal links
10. canonical/hreflang/schema valid
11. no generic “Best ... 20xx” without evidence
12. no direct-test language without verified claims
13. no unsupported medical/supplement claims
14. no arbitrary affiliate target redirect

For trend articles:
- require trend signals or topic evidence.
- require why-now explanation.
- require search intent match.
- require non-boilerplate sections.
- require at least 3 internal links.

For deal_watch:
- require price lastCheckedAt.
- require buy/wait/avoid logic.
- block fake urgency.

For ingredient_guide:
- require HealthClaimGuard.
- require disclaimer.
- require supported/unsupported claim separation.

Acceptance:
- pnpm seo:validate exercises expanded gates.
- Gate returns structured breakdown.
- Admin shows blocker reasons.

────────────────────────────────────
PHASE 11 — ADMIN UI EXTENSION
────────────────────────────────────

Add admin pages:

Existing admin should remain.

Add:
- /admin/trends
- /admin/topics
- /admin/briefs
- /admin/merchants
- /admin/offers
- /admin/placements
- /admin/publishing-jobs
- /admin/compliance
- /admin/localization

Admin features:
1. Trends
   - list trend signals
   - import CSV
   - filter by locale/country/source
   - show growth/commercial/evidence/affiliate scores

2. Topics
   - list topics
   - show score breakdown
   - approve/reject topic
   - generate brief

3. Briefs
   - view outline
   - approve brief
   - generate article draft

4. Merchants
   - create/edit merchant
   - allowed domains
   - healthSensitive flag

5. Offers
   - create/edit offers
   - merchant
   - category
   - locale/country
   - healthSensitive
   - lastCheckedAt

6. Placements
   - approve/reject affiliate placements
   - show article/offer/merchant
   - show rel/disclosure status

7. Publishing jobs
   - list queued/running/done/failed/blocked
   - retry failed
   - inspect outputJson/error

8. Compliance
   - list health blockers
   - list unsafe affiliate redirects
   - list localization depth failures
   - list over-monetized pages

9. Localization
   - show TranslationGroups
   - show locale variants
   - show localizationDepthScore
   - regenerate hreflang group

Security:
- All mutation endpoints require ADMIN_TOKEN.
- Writes AuditLog.
- Never expose ADMIN_TOKEN.
- No public mutation access.

Acceptance:
- Admin pages render in DB mode.
- If DB unavailable, show helpful fallback/error.
- Mutations write AuditLog.

────────────────────────────────────
PHASE 12 — OPTIONAL SAFE POSTING / DISTRIBUTION LAYER
────────────────────────────────────

Add only safe owned-channel distribution.
Do NOT auto-post to third-party communities.

Add models:

model DistributionAsset {
  id              String   @id @default(cuid())
  articleId        String
  locale          String
  assetType       String // x_post, linkedin_post, pinterest_pin, youtube_short_script, discord_announcement, reddit_draft
  platform        String
  title           String?
  body            String
  mediaUrls       Json?
  targetUrl       String?
  disclosure      String?
  status          String   @default("draft") // draft, approved, scheduled, posted, failed
  scheduledAt     DateTime?
  postedAt        DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model DistributionRule {
  id                    String   @id @default(cuid())
  platform              String
  locale                String
  maxPostsPerDay         Int      @default(2)
  requiresHumanApproval Boolean  @default(true)
  allowDirectLink        Boolean  @default(true)
  requireDisclosure      Boolean  @default(true)
  enabled               Boolean  @default(true)
}

model DistributionResult {
  id              String   @id @default(cuid())
  assetId         String
  platform        String
  externalPostId  String?
  externalUrl     String?
  impressions     Int?
  clicks          Int?
  likes           Int?
  comments        Int?
  shares          Int?
  error           String?
  capturedAt      DateTime @default(now())
}

Rules:
- Generate owned-channel post drafts only.
- Do not auto-submit Reddit/community posts.
- Reddit drafts are draft-only.
- Direct affiliate links are disabled by default.
- Prefer data/lab/guide URLs over review/affiliate URLs.
- Human approval required by default.
- Optional Postiz adapter may be added, disabled by default.

Commands:
- generate-distribution-assets --article-id <id>
- approve-distribution-asset --asset-id <id>
- schedule-distribution-asset --asset-id <id>
- send-approved-distribution-assets

Docs:
- docs/posting-bot.md
- docs/distribution-rules.md

Acceptance:
- Distribution assets can be generated as drafts.
- No auto-community posting exists.
- Owned-channel send adapters disabled unless configured.

────────────────────────────────────
PHASE 13 — OPTIONAL SAFE LINK-EARNING CRM
────────────────────────────────────

Add link earning, not backlink spam.

Do NOT implement:
- automatic backlink creation
- comment posting
- forum posting
- profile links
- directory spam
- PBN
- automated guest post buying

Add models:

model LinkableAsset {
  id                String   @id @default(cuid())
  articleId          String?
  url               String   @unique
  locale            String
  topic             String
  assetType         String // dataset, lab, guide, comparison, tool
  title             String
  summary           String
  originalDataScore Float    @default(0)
  linkableScore     Float    @default(0)
  status            String   @default("active")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model LinkProspect {
  id                String   @id @default(cuid())
  domain            String
  pageUrl           String
  pageTitle         String?
  locale            String?
  topic             String?
  opportunityType   String // data_citation, outdated_resource, broken_link_replacement, unlinked_mention, comparison_gap
  suggestedAssetId  String?
  suggestedAngle    String?
  topicalRelevance  Float    @default(0)
  pageQuality       Float    @default(0)
  spamRisk          Float    @default(0)
  prospectScore     Float    @default(0)
  contactEmail      String?
  contactFormUrl    String?
  status            String   @default("new") // new, qualified, drafted, approved, sent, replied, linked, rejected, suppressed
  discoveredAt      DateTime @default(now())
  lastContactedAt   DateTime?
  notes             String?
}

model OutreachCampaign {
  id              String   @id @default(cuid())
  name            String
  assetId         String
  locale          String
  status          String   @default("draft")
  dailySendLimit  Int      @default(10)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model OutreachMessage {
  id              String   @id @default(cuid())
  campaignId      String
  prospectId      String
  subject         String
  body            String
  status          String   @default("draft") // draft, approved, sent, replied, bounced, opted_out
  approvedByHuman Boolean  @default(false)
  sentAt          DateTime?
  repliedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model SuppressionEntry {
  id              String   @id @default(cuid())
  email           String?
  domain          String?
  reason          String
  createdAt       DateTime @default(now())
}

Rules:
- Linkable assets are data/lab/methodology/guide pages, not thin affiliate review pages.
- Outreach drafts require human approval.
- Email sending disabled by default unless SMTP configured.
- Include suppression list.
- Include opt-out fields.
- No optimized anchor text demands.
- No paid dofollow language.
- No spam-risk domains.

Commands:
- score-linkable-assets
- import-link-prospects --file data/seeds/link-prospects.csv
- score-link-prospects
- draft-outreach
- approve-outreach-message
- send-approved-outreach

Docs:
- docs/link-earning-bot.md
- docs/outreach-compliance.md
- docs/anti-spam-rules.md

Acceptance:
- Can create linkable assets.
- Can import prospects from CSV.
- Can score prospects.
- Can draft outreach.
- Cannot send without human approval.
- Does not create backlinks automatically.

────────────────────────────────────
PHASE 14 — SEARCH CONSOLE / REFRESH LOOP EXPANSION
────────────────────────────────────

Keep existing Search Console feedback worker.
Extend it to support:
- new ArticleTypes,
- trend pages,
- ingredient pages,
- buyer guides,
- offer placement refresh suggestions,
- localization gaps,
- health/compliance warnings.

Add to PageRefreshSuggestion actions:
- missing section suggestions,
- title/meta candidate,
- internal link candidates,
- offer replacement candidates,
- localization improvement candidates,
- health claim risk if relevant.

Do not auto-apply refresh.
Create drafts or suggestions only.
Admin can mark:
- open
- planned
- applied
- dismissed

Acceptance:
- Existing suggest-refreshes still works.
- New article types have meaningful refresh suggestions.
- Suggestions do not auto-publish.

────────────────────────────────────
PHASE 15 — SEEDS AND SAMPLE DATA
────────────────────────────────────

Add seed/sample data so the repo works locally without external credentials.

Add:
data/seeds/trend-signals.csv
data/seeds/offers.csv
data/seeds/merchants.csv
data/seeds/link-prospects.csv
data/seeds/distribution-rules.csv

Sample merchants:
- AliExpress
- iHerb

Sample topics:
- aliexpress charger fake watts
- real capacity power bank
- magnesium sleep supplement
- probiotic gut health supplement
- travel adapter import checklist
- desk setup gadgets

Sample articles:
- en trend article
- es localized trend article
- pt-br localized trend article
- en ingredient guide with iHerb health disclaimer
- en buyer guide with AliExpress offers
- en deal_watch page with buy/wait/avoid logic

Sample constraints:
- At least one iHerb page should be blocked until HealthClaimGuard passes.
- At least one translated page should be noindex due to low localization depth.
- At least one trend page should pass to pending but not index.
- At least one product evidence page should remain indexable.

Acceptance:
- Local build works with sample content.
- DB seed works.
- Sample admin pages show meaningful rows.

────────────────────────────────────
PHASE 16 — ENVIRONMENT VARIABLES
────────────────────────────────────

Update .env.example with:

# Site
NEXT_PUBLIC_SITE_URL=
CONTENT_SOURCE=sample
ADMIN_TOKEN=
PREVIEW_TOKEN=

# Database
DATABASE_URL=

# AliExpress
ALIEXPRESS_APP_KEY=
ALIEXPRESS_APP_SECRET=
ALIEXPRESS_TRACKING_ID=
ALIEXPRESS_API_BASE_URL=
ALIEXPRESS_SIGN_METHOD=

# iHerb / merchant feeds
IHERB_AFFILIATE_ID=
IHERB_FEED_URL=
IHERB_API_KEY=

# LLM
LLM_PROVIDER=dry-run
OPENAI_API_KEY=
OPENAI_MODEL=
GEMINI_API_KEY=
GEMINI_MODEL=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=
OLLAMA_BASE_URL=
OLLAMA_MODEL=

# Search Console
GOOGLE_APPLICATION_CREDENTIALS=
GOOGLE_SEARCH_CONSOLE_SITE_URL=

# Storage
LAB_EVIDENCE_STORAGE_DRIVER=local
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_PUBLIC_URL=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_BUCKET=
S3_PUBLIC_URL=

# Distribution optional
POSTIZ_API_URL=
POSTIZ_API_KEY=
ENABLE_DISTRIBUTION_SEND=false

# Outreach optional
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
OUTREACH_SENDER_EMAIL=
OUTREACH_PHYSICAL_ADDRESS=
ENABLE_OUTREACH_SEND=false

# Safety
ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT=false

────────────────────────────────────
PHASE 17 — PACKAGE SCRIPTS
────────────────────────────────────

Update root package.json scripts:

Keep existing:
- dev
- build
- typecheck
- seo:validate
- db:generate
- db:migrate
- db:seed
- db:admin
- worker
- worker:pipeline

Add:
- trend:import
- trend:cluster
- trend:score
- brief:generate
- offers:match
- publishing:gate
- localization:score
- affiliate:audit
- compliance:audit
- distribution:generate
- links:assets:score
- links:prospects:score

Scripts should call worker CLI or TS validators.

Acceptance:
- Scripts do not fail if external credentials are missing; they should use sample/disabled mode or print a clear message.
- Core build/typecheck/seo validate must pass.

────────────────────────────────────
PHASE 18 — DOCUMENTATION
────────────────────────────────────

Add or update:

- docs/implementation-audit.md
- docs/publishing-state.md
- docs/admin-publish-gate.md
- docs/merchant-offer-engine.md
- docs/affiliate-redirect-safety.md
- docs/trend-engine.md
- docs/multilingual-publishing.md
- docs/iherb-compliance.md
- docs/offer-matching.md
- docs/posting-bot.md
- docs/link-earning-bot.md
- docs/outreach-compliance.md
- docs/anti-spam-rules.md
- docs/operations-runbook.md
- docs/next-tasks.md

Update README with:
1. What the system is now.
2. How to run local sample mode.
3. How to run database mode.
4. How to import trend signals.
5. How to generate briefs.
6. How to match offers.
7. How to generate multilingual drafts.
8. How to run quality/compliance gates.
9. How to approve publish/index.
10. How to safely handle affiliate redirects.
11. What the system intentionally does not automate.

────────────────────────────────────
PHASE 19 — ACCEPTANCE TEST / FINAL REPORT
────────────────────────────────────

At the end, produce a final report in:

docs/final-implementation-report.md

It must include:
1. Files changed.
2. Models added.
3. Routes added.
4. Worker commands added.
5. Validators added.
6. Admin pages added.
7. Safety rules enforced.
8. Remaining limitations.
9. Exact commands run.
10. Results of:
   - pnpm typecheck
   - pnpm seo:validate
   - pnpm build

Also include:
- data/exports/system_capabilities.json

This JSON should contain:
{
  "product_evidence_core": true,
  "trend_engine": true,
  "merchant_offer_engine": true,
  "iherb_compliance_gate": true,
  "multilingual_publishing": true,
  "safe_affiliate_redirects": true,
  "search_console_refresh_loop": true,
  "owned_channel_distribution_drafts": true,
  "link_earning_crm_drafts": true,
  "blackhat_backlink_automation": false,
  "community_auto_posting": false,
  "google_indexing_api_for_articles": false
}

────────────────────────────────────
IMPORTANT IMPLEMENTATION STYLE
────────────────────────────────────

- Preserve existing names and folder style when possible.
- Use TypeScript types strictly.
- Do not silently weaken validators.
- Prefer small, explicit functions over giant files.
- Keep sample mode working without Postgres.
- Keep DB mode working with Prisma.
- All new external adapters must be disabled by default.
- All risky actions require approval state.
- Add clear errors when credentials are missing.
- Do not add dependencies unless necessary.
- Do not invent fake API behavior as if production-ready.
- For disabled adapters, write sample/manual CSV path.

Now implement all phases in one comprehensive patch.