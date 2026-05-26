You are working in the GitHub repository:

Songdaiki/seo_daiki

Important context:
The current repo has already evolved into a multilingual trend-driven affiliate content system. However, the current architecture is too product/offer/distribution-heavy too early. We need to refactor the project around the correct operating flow:

1. Detect trends by country/language/market.
2. Analyze what top-ranking blogs/pages are writing for the trending keywords.
3. Let the LLM decide the content strategy and create a test post on the website.
4. Only after the article strategy exists, automatically identify possible related products/offers from AliExpress, Temu, Amazon, iHerb, etc.
5. Produce a comparison/analysis block for those product candidates.
6. Let a human approve whether to add monetized links to the article.

Do NOT prioritize affiliate APIs now.
Do NOT implement full product-link API integrations now.
Document product-link APIs and merchant adapter contracts only.
The first real implementation priority is the Trend Engine.
The second priority is Website Posting / Test Publishing.
The third priority is Product Candidate Discovery and Analysis.
The last priority is actual affiliate link insertion.

This is a long refactor. Make the architecture bold and practical. Do not be overly conservative. But do not implement spam, cloaking, Google scraping without permission, community auto-posting, or arbitrary redirect abuse.

────────────────────────────────────
CURRENT REPO AUDIT REQUIREMENT
────────────────────────────────────

First inspect the current repo and write:

docs/refactor-audit/current-state.md

Must inspect:
- README.md
- packages/db/prisma/schema.prisma
- packages/types/src/index.ts
- workers/python/cli.py
- workers/python/intelligence/trend_topic_engine.py
- workers/python/intelligence/offer_matching.py
- workers/python/writers/topic_article_generator.py
- workers/python/writers/topic_brief_generator.py
- workers/python/writers/topic_localizer.py
- workers/python/validators/publishing_gate.py
- packages/validators/src/index.ts
- apps/web/lib/content/page-loaders.ts
- apps/web/lib/seo/metadata.ts
- apps/web/app/api/affiliate-click/route.ts
- docs/*.md

Audit questions:
1. Which current files support the new trend-first flow?
2. Which current files are product/offer-first and should be downgraded or moved behind later phases?
3. Which current models are reusable?
4. Which current models are premature?
5. Which current workers are too shallow for real trend discovery?
6. Which workers should become documentation-only for now?
7. Which public routes and admin flows are safe enough to keep?
8. What should be removed, disabled, or moved behind feature flags?

Do not skip this audit.

────────────────────────────────────
NEW PRODUCT VISION
────────────────────────────────────

Rename the mental model:

Current wrong direction:
Product evidence site + affiliate offer engine + trend add-on

New direction:
Global Market Trend Desk + SERP Intelligence + Multilingual Publishing Lab + Optional Monetization Layer

The product is NOT primarily an affiliate blog.
The product is a global trend-to-content operating system.

Canonical pipeline:

MarketTrendSignal
  -> TrendCluster
  -> TrendKeyword
  -> SerpSnapshot
  -> CompetitorContentAnalysis
  -> ContentAngleDecision
  -> ContentBrief
  -> TestArticleDraft
  -> LocalizedMarketVariant
  -> Website Test Publish
  -> Performance Monitoring
  -> ProductCandidateDiscovery
  -> ProductCandidateAnalysisBlock
  -> Human Approval
  -> Monetized Link Placement

Implement this pipeline in phases.

────────────────────────────────────
DOMAIN STRATEGY: ONE DOMAIN, MARKET SILOS
────────────────────────────────────

Decision:
Use one domain, not many domains.

Reason:
- We need brand/link/Search Console authority in one place.
- Splitting 18 countries into separate domains too early will fragment authority and operations.
- But we must avoid a mixed “global random blog” feel.

Implement one domain with market/language silo routing:

/[market]/[language]/

Examples:
- /us/en/
- /gb/en/
- /ca/en/
- /au/en/
- /es/es/
- /mx/es/
- /br/pt-br/
- /pt/pt/
- /fr/fr/
- /de/de/
- /it/it/
- /nl/nl/
- /pl/pl/
- /tr/tr/
- /id/id/
- /jp/ja/
- /kr/ko/
- /in/en/

Use 18 initial market configs, but allow adding/removing later.

Each market must have:
- market code
- primary language
- country
- currency
- timezone
- Google Trends geo code
- Search Console country filter
- SERP locale config
- default content categories
- blocked categories
- monetization readiness
- localization rules
- market trend feed path
- market editorial calendar

Do not mix all market trends into one global feed.
Each market has its own trend desk.

URL examples:
- /us/en/trends/magnesium-sleep/
- /es/es/trends/cargadores-usb-c/
- /br/pt-br/tendencias/power-bank-capacidade-real/
- /kr/ko/trends/gan-charger/
- /jp/ja/trends/magnesium-sleep/

Global pages:
- /global/
- /global/trend-map/
- /global/topics/
- /global/methodology/
- /global/markets/

The global pages summarize cross-market patterns but should not replace market-specific pages.

Update:
- locale config
- routing helpers
- canonical builder
- hreflang builder
- sitemap generation
- admin filters
- article model if needed

Add:
data/config/markets.json

Include 18 markets:
US, GB, CA, AU, ES, MX, BR, PT, FR, DE, IT, NL, PL, TR, ID, JP, KR, IN

Each market config must include:
{
  "market": "us",
  "language": "en",
  "country": "US",
  "currency": "USD",
  "timezone": "America/New_York",
  "trendsGeo": "US",
  "serpGl": "us",
  "serpHl": "en",
  "pathPrefix": "/us/en",
  "enabled": true,
  "monetizationReadiness": "research_only",
  "defaultCategories": [],
  "blockedCategories": []
}

Important:
Do not auto-redirect users by IP.
Add market/language switcher links.
Keep explicit URLs.

────────────────────────────────────
PHASE PLAN
────────────────────────────────────

Create docs/phase-plan.md with this exact priority:

Phase 0:
Audit and architecture reset.

Phase 1:
Market and routing architecture for 18 markets.

Phase 2:
Trend Engine v1.

Phase 3:
SERP / top-ranking content intelligence.

Phase 4:
Content strategy and test posting engine.

Phase 5:
Market-localized publishing calendar.

Phase 6:
Performance feedback loop.

Phase 7:
Product candidate discovery and analysis block.

Phase 8:
Affiliate API documentation and merchant adapter contracts only.

Phase 9:
Human approval workflow for monetized link insertion.

Phase 10:
Later implementation of real API integrations.

Do not implement Phase 10 now.

────────────────────────────────────
PHASE 1 — MARKET ROUTING ARCHITECTURE
────────────────────────────────────

Goal:
Support 18 country/language markets without turning the site into a random mixed blog.

Implement:
- data/config/markets.json
- packages/types market types
- packages/seo market-aware canonical helpers
- packages/seo market-aware hreflang helpers
- apps/web market routes:
  /[market]/[language]/
  /[market]/[language]/trends/[slug]
  /[market]/[language]/keywords/[slug]
  /[market]/[language]/serp/[slug]
  /[market]/[language]/briefs/[slug]
  /[market]/[language]/posts/[slug]
  /[market]/[language]/calendar/
  /global/trend-map/
  /global/topics/
  /global/markets/

Keep legacy /en, /es, /pt-br routes working temporarily by redirecting to default market routes:
- /en -> /us/en
- /es -> /es/es
- /pt-br -> /br/pt-br

Add docs:
- docs/market-routing.md
- docs/one-domain-vs-multiple-domains.md

Acceptance:
- 18 markets can render landing pages from config.
- Canonical URLs use market/language path.
- Hreflang groups can connect market variants.
- No automatic IP/language redirect.

────────────────────────────────────
PHASE 2 — TREND ENGINE V1
────────────────────────────────────

Goal:
Build the true first engine:
country-by-country trend detection.

Do not center this on products.
Do not center this on affiliate offers.
Do not center this on existing Product models.

Add or refactor models:

TrendSource:
- id
- sourceType
- name
- market
- language
- country
- enabled
- reliabilityTier
- collectionMode
- configJson
- lastCollectedAt

TrendSignal:
- id
- sourceId
- market
- language
- country
- rawKeyword
- normalizedKeyword
- topicRaw
- categoryGuess
- url
- observedAt
- sourceRank
- sourceVolumeBucket
- relativeGrowth
- velocityScore
- freshnessScore
- commercialHintScore
- evidenceHintScore
- localeSpecificityScore
- rawJson

TrendCluster:
- id
- market
- language
- canonicalTopic
- slug
- category
- detectedAt
- status
- signalCount
- countriesSeenJson
- relatedKeywordsJson
- score
- scoreBreakdownJson

TrendKeyword:
- id
- clusterId
- market
- language
- keyword
- searchIntentGuess
- priorityScore
- serpStatus
- status

TrendSource types:
- manual_csv
- google_trends_export
- google_trending_now_export
- search_console
- google_news_rss
- youtube_data_api_optional
- pinterest_optional
- reddit_optional_disabled
- merchant_signal_manual
- internal_affiliate_clicks

Important:
Google Trends is relative and sampled. Do not treat it as absolute search volume.
Store normalized relative values, not fake absolute volume.
The engine must support manual exports and CSV imports before any external API.

Add worker commands:
- trend:init-markets
- trend:import-signals --file data/seeds/trend-signals.csv
- trend:collect --market us --source manual_csv
- trend:normalize
- trend:cluster
- trend:score
- trend:report --market us
- trend:generate-keywords --cluster-id <id>

Trend scoring formula:
trend_score =
  velocityScore * 0.22
+ sourceCorroborationScore * 0.18
+ marketSpecificityScore * 0.16
+ contentOpportunityScore * 0.16
+ commercialHintScore * 0.10
+ evidenceHintScore * 0.10
+ freshnessScore * 0.08
- noisePenalty
- compliancePenalty

Trend status:
- raw
- normalized
- clustered
- scored
- keyword_ready
- serp_pending
- brief_pending
- drafted
- testing
- rejected

Important behavior:
- A topic can trend in one country and not another.
- Do not force all markets to write the same article.
- Cross-market trend map should identify:
  - local-only trend
  - regional trend
  - global trend
  - lagging market opportunity
  - cross-language synonym cluster

Add sample data:
data/seeds/trend-signals.csv

Must include:
- US magnesium sleep trend
- Spain USB charger trend
- Brazil power bank real capacity trend
- Japan compact desk gadget trend
- Korea gut health trend
- Germany travel adapter trend
- Mexico budget smartwatch trend
- France beauty ingredient trend

Add docs:
- docs/trend-engine-v1.md
- docs/trend-signal-schema.md
- docs/trend-scoring.md
- docs/cross-market-trend-map.md

Acceptance:
- Import trend signals by market.
- Cluster by market.
- Score by market.
- Produce a cross-market report.
- No offer matching runs in this phase.

────────────────────────────────────
PHASE 3 — SERP / TOP-RANKING CONTENT INTELLIGENCE
────────────────────────────────────

Goal:
For each trending keyword, inspect what top-ranking blogs/pages are doing.

Important:
Do not implement unauthorized Google scraping.
Build a provider-based SERP adapter.

SERP provider modes:
1. manual_csv:
   - human exports top results into CSV
   - always available
2. google_programmable_search_existing_customer:
   - disabled by default
   - use only if credentials exist
3. third_party_serp_api:
   - disabled by default
   - adapter contract only
4. browser_research_manual:
   - human saves page URLs and snippets
5. search_console_existing_pages:
   - for our own pages only

Do not use raw Google HTML scraping.
Do not use proxy scraping.
Do not use CAPTCHA bypass.
Do not build rank-checking spam.

Add models:

SerpSnapshot:
- id
- market
- language
- country
- keywordId
- keyword
- provider
- collectedAt
- status
- rawJson
- topResultCount

SerpResult:
- id
- snapshotId
- rank
- url
- domain
- title
- snippet
- resultType
- dateHint
- isForum
- isVideo
- isEcommerce
- isAffiliateLikely
- isPublisher
- languageGuess
- contentFetchedStatus
- contentAnalysisStatus

CompetitorContentAnalysis:
- id
- serpResultId
- market
- language
- keyword
- pageTitle
- h1
- headingsJson
- wordCountEstimate
- contentTypeGuess
- intentServed
- monetizationPattern
- affiliatePattern
- comparisonTablePresent
- productLinksPresent
- originalDataPresent
- freshnessSignalsJson
- contentAnglesJson
- missingAnglesJson
- strengthsJson
- weaknessesJson
- extractionStatus
- analyzedAt

SerpKeywordOpportunity:
- id
- keywordId
- market
- language
- opportunityScore
- dominantIntent
- dominantContentTypesJson
- topPatternsJson
- contentGapJson
- recommendedAngle
- recommendedArticleType
- shouldWrite
- reason

Add worker commands:
- serp:import-results --file data/seeds/serp-results.csv
- serp:collect --keyword-id <id> --provider manual_csv
- serp:fetch-pages --snapshot-id <id>
- serp:analyze-pages --snapshot-id <id>
- serp:summarize-opportunity --keyword-id <id>
- serp:report --market us

Content fetch rules:
- Respect robots where applicable.
- Store only extracted summary, headings, snippets, analysis.
- Do not store full copyrighted article bodies.
- Do not use fetched content for direct rewriting.
- Use top pages to understand structure, intent, coverage, and gaps.
- Limit stored excerpts.
- Keep source URL and analysis metadata.

Analysis should identify:
- title pattern
- intro promise
- sections used
- comparison table or not
- product cards or not
- whether original testing/data exists
- freshness/date usage
- affiliate disclosure presence
- CTA pattern
- content depth
- missing angle
- what we can do better

SERP opportunity scoring:
opportunity_score =
  trend_score * 0.20
+ serp_gap_score * 0.25
+ weak_competitor_score * 0.15
+ content_depth_opportunity * 0.15
+ market_fit_score * 0.10
+ monetization_later_fit * 0.05
+ freshness_gap_score * 0.10

Important:
This phase does NOT generate affiliate links.
It only determines what kind of article to write.

Add sample:
data/seeds/serp-results.csv

Include examples for:
- US magnesium sleep
- ES cargador usb c
- BR power bank capacidade real
- JP desk gadget
- KR gut health

Add docs:
- docs/serp-intelligence.md
- docs/competitor-content-analysis.md
- docs/serp-provider-contract.md
- docs/content-extraction-policy.md

Acceptance:
- Manual CSV SERP import works.
- SERP pages can be summarized/analyzed.
- Competitor analysis outputs structured strengths/weaknesses.
- Keyword opportunity report recommends article strategy.
- No affiliate product matching is done here.

────────────────────────────────────
PHASE 4 — CONTENT STRATEGY AND TEST POSTING
────────────────────────────────────

Goal:
Use Trend + SERP intelligence to decide what to write, then create a test post on the website.

Add models:

ContentStrategy:
- id
- keywordId
- clusterId
- market
- language
- selectedArticleType
- recommendedAngle
- titleStrategy
- introStrategy
- sectionPlanJson
- differentiationPlanJson
- evidenceNeededJson
- competitorPatternsJson
- contentGapJson
- monetizationDeferred Boolean
- status

TestArticle:
- id
- strategyId
- articleId
- market
- language
- status
- noindexReason
- createdAt
- updatedAt

Content strategy rules:
- The LLM must not simply copy competitor structures.
- It should use competitor analysis to identify:
  - what users expect
  - what sections are table stakes
  - what gaps exist
  - how we can produce a better article
- Monetization is deferred.
- Product links are not inserted in the initial test article.
- Initial test post should be informational/commercial-intent aware, but not monetized yet.
- Initial test post may include placeholders:
  - “Product candidate analysis pending”
  - “Deal/offer links will be added after verification”
  - hidden from public if needed.

Article states:
- draft
- test_pending
- test_published_noindex
- test_published_index_candidate
- performance_monitoring
- needs_product_analysis
- approved_for_monetization
- rejected

Add routes:
- /[market]/[language]/posts/[slug]
- /[market]/[language]/briefs/[slug]

Add worker commands:
- strategy:create --keyword-id <id>
- strategy:generate-brief --strategy-id <id>
- post:generate-test --strategy-id <id>
- post:publish-test --article-id <id> --mode noindex
- post:promote-index-candidate --article-id <id>

Test posting:
- default publishStatus=pending
- default indexStatus=noindex or pending
- can render preview/test page
- can be moved to published/noindex for visual QA
- human can approve index candidate later

Do not insert affiliate links in this phase.

Add docs:
- docs/content-strategy-engine.md
- docs/test-posting-flow.md
- docs/llm-writing-rules.md

Acceptance:
- A trend keyword can produce a ContentStrategy.
- ContentStrategy can produce ContentBrief.
- ContentBrief can produce TestArticle.
- TestArticle can render on the site.
- No affiliate links are inserted.

────────────────────────────────────
PHASE 5 — 18-MARKET EDITORIAL CALENDAR
────────────────────────────────────

Goal:
Because trends differ by country, each market needs its own content queue.

Add models:

MarketEditorialCalendar:
- id
- market
- language
- weekStart
- status
- summaryJson

EditorialSlot:
- id
- calendarId
- date
- priority
- clusterId
- keywordId
- strategyId
- articleId
- status
- reason

Calendar logic:
- Each market has independent queue.
- Do not force same content globally.
- Identify cross-market opportunities when a topic appears in multiple countries.
- Identify lagging-market opportunities when a topic trends in one country and has early signal in another.
- Avoid publishing too many unrelated topics in one market in a short time.
- Maintain market-level topical balance.

Market topical balance:
- core categories per market
- max unrelated trend posts per week
- max health-sensitive posts per week
- max deal posts per week
- minimum evergreen/supporting posts per trend cluster

Add worker commands:
- calendar:build --market us
- calendar:build-all
- calendar:explain --market us
- calendar:export

Add admin:
- /admin/market-calendars
- /admin/market-calendars/[market]

Add docs:
- docs/market-editorial-calendar.md
- docs/topical-balance-policy.md

Acceptance:
- Each of 18 markets has its own queue.
- A US magnesium trend does not pollute Spain’s USB trend queue.
- Global trend map can show both without mixing feeds.
- Calendar produces publish candidates by market.

────────────────────────────────────
PHASE 6 — PERFORMANCE FEEDBACK LOOP
────────────────────────────────────

Goal:
After test posting, monitor whether the article deserves more investment.

Use:
- Search Console
- GA4 if configured
- internal clicks
- article impressions/clicks
- query expansions

Add models if needed:

ArticlePerformanceSnapshot:
- id
- articleId
- market
- language
- dateStart
- dateEnd
- impressions
- clicks
- ctr
- avgPosition
- queriesJson
- countriesJson
- devicesJson
- capturedAt

ArticleNextAction:
- id
- articleId
- actionType
- reason
- priority
- payloadJson
- status

Next actions:
- expand section
- rewrite title/meta
- add comparison table
- add FAQ-like direct answer section, but do not rely on FAQ rich result
- create supporting article
- create localized variant
- request product candidate analysis
- hold
- reject

Add worker commands:
- performance:import-search-console
- performance:snapshot
- performance:recommend-actions
- performance:report --market us

Acceptance:
- Test article can receive performance data.
- System can recommend whether to invest more.
- Product candidate analysis should only trigger when article passes minimum performance or editorial approval.

────────────────────────────────────
PHASE 7 — PRODUCT CANDIDATE DISCOVERY AND ANALYSIS BLOCK
────────────────────────────────────

Goal:
After a trend article exists, identify possible related products, but do not insert monetized links yet.

This is NOT full affiliate API integration.
Use manual CSV/sample feeds first.

Add models:

ProductCandidate:
- id
- articleId
- market
- language
- sourceMerchant
- sourceMode
- title
- productUrl
- candidateUrl
- category
- priceText
- currency
- imageUrl
- reason
- relevanceScore
- riskScore
- evidenceNeededJson
- status

ProductCandidateAnalysis:
- id
- articleId
- market
- language
- candidatesJson
- comparisonJson
- prosConsJson
- riskNotesJson
- recommendedUseJson
- monetizationReadiness
- status

Flow:
Article -> ProductCandidateDiscovery -> ProductCandidateAnalysisBlock -> Human review -> optional placement later.

Sources:
- manual CSV feeds
- existing Product table
- sample merchant feeds
- future merchant adapters documented but disabled

Merchant source modes:
- aliexpress_api_later
- temu_manual_later
- amazon_api_later
- iherb_feed_later
- manual_csv_now
- existing_product_db_now

Product candidate scoring:
candidate_score =
  topic_relevance * 0.30
+ user_problem_fit * 0.20
+ market_availability * 0.15
+ comparison_value * 0.15
+ evidence_availability * 0.10
+ price_or_value_hint * 0.05
- risk_penalty * 0.05

Risk scoring:
- health claim risk
- counterfeit/IP risk
- safety risk
- price freshness risk
- unsupported review claim risk
- merchant policy risk

Add worker commands:
- products:import-candidates --file data/seeds/product-candidates.csv
- products:discover-candidates --article-id <id>
- products:analyze-candidates --article-id <id>
- products:build-analysis-block --article-id <id>

Analysis block should generate:
- “Relevant product candidates”
- “Why these products match the article”
- “What to verify before linking”
- “Comparison table draft”
- “Risk notes”
- “Do not link yet” status

Add docs:
- docs/product-candidate-discovery.md
- docs/product-analysis-block.md

Acceptance:
- Product candidates can be discovered from manual CSV.
- Article can get candidate analysis block.
- No monetized link is added automatically.
- Human approval is required for link insertion.

────────────────────────────────────
PHASE 8 — AFFILIATE API DOCUMENTATION ONLY
────────────────────────────────────

Goal:
Document how AliExpress, Temu, Amazon, and iHerb links will be attached later.
Do NOT implement full live API integrations now.

Create docs/affiliate-api-playbook/ with:

1. aliexpress.md
Must document:
- required credentials
- official API/portal boundary
- product search
- product details
- affiliate link generation
- price snapshot rules
- variant trap requirements
- prohibited scraping behavior
- data fields needed for ProductCandidate
- future adapter interface

2. temu.md
Must document:
- manual-offer-only until official API/feed docs are verified
- required admin approval
- no automatic crawling
- no automatic price/availability unless official source exists
- future adapter interface

3. amazon.md
Must document:
- Amazon Associates requirements
- Creators API / PA-API transition considerations
- price/availability timestamp/disclaimer requirements
- review/rating display restrictions
- image/content usage restrictions
- future adapter interface
- do not implement now

4. iherb.md
Must document:
- affiliate networks such as Partnerize/Impact/CJ/Awin depending on approval
- deeplink workflow
- feed requirements
- supplement/health disclaimer requirements
- HealthClaimGuard requirements
- future adapter interface
- do not implement now

5. merchant-adapter-contract.md
Define interface:

MerchantAdapter:
- validateCredentials()
- searchCandidates(query, market, language)
- normalizeCandidate(raw)
- buildAffiliateUrl(candidate, tracking)
- refreshOffer(candidateId)
- validatePolicy(candidate)
- getRequiredDisclosures()

But implement only:
- ManualCsvMerchantAdapter
- ExistingProductDbAdapter

All live adapters:
- AliExpressLiveAdapter
- TemuLiveAdapter
- AmazonLiveAdapter
- IHerbLiveAdapter

must be documentation-only or disabled placeholders with clear “not implemented” errors.

Acceptance:
- No live API integration is required.
- No affiliate link is inserted automatically.
- The future integration path is very detailed and clear.

────────────────────────────────────
PHASE 9 — HUMAN APPROVAL FOR MONETIZED LINK INSERTION
────────────────────────────────────

Goal:
Only after product candidate analysis exists, a human can approve monetized link insertion.

Add models or adapt existing:

MonetizationReview:
- id
- articleId
- market
- language
- productAnalysisId
- status
- reviewerNotes
- approvedCandidateIdsJson
- rejectedCandidateIdsJson
- createdAt
- updatedAt

MonetizedPlacementDraft:
- id
- articleId
- candidateId
- merchant
- placementType
- anchorText
- disclosureText
- rel
- status
- createdAt

Flow:
ProductCandidateAnalysisBlock
  -> MonetizationReview pending
  -> human approves candidates
  -> MonetizedPlacementDraft created
  -> article revision generated
  -> human final approval
  -> links inserted

Do not bypass this.

Add admin:
- /admin/monetization-reviews
- /admin/monetization-reviews/[id]

Add worker commands:
- monetization:create-review --article-id <id>
- monetization:draft-placements --review-id <id>
- monetization:apply-approved --review-id <id>

Acceptance:
- Human approval is required.
- Links are not inserted directly from product discovery.
- Article revision can include approved links.
- rel="sponsored nofollow" enforced.

────────────────────────────────────
PHASE 10 — DISABLE OR DOWNGRADE PREMATURE OLD FEATURES
────────────────────────────────────

The current repo already includes offer matching, distribution drafts, outreach drafts, and link earning. These are too far ahead for the current priority.

Do not delete them if they are build-safe.
But move them behind feature flags and mark as later phases.

Feature flags:
- ENABLE_OFFER_MATCHING=false
- ENABLE_DISTRIBUTION_DRAFTS=false
- ENABLE_LINK_EARNING=false
- ENABLE_LIVE_AFFILIATE_APIS=false
- ENABLE_PRODUCT_CANDIDATE_DISCOVERY=true
- ENABLE_SERP_INTELLIGENCE=true
- ENABLE_TREND_ENGINE=true

Rules:
- Default pipeline should run:
  trend import
  trend cluster
  trend score
  keyword generation
  SERP import/analyze
  strategy create
  test article generate

Default pipeline should NOT run:
  affiliate offer matching
  distribution drafts
  outreach drafts
  live merchant APIs

Update worker:pipeline accordingly.

Add docs:
- docs/feature-flags.md
- docs/pipeline-priority.md

Acceptance:
- Running default pipeline does not jump to monetization.
- Monetization phases are opt-in and later.

────────────────────────────────────
PHASE 11 — LLM CONTENT STRATEGY RULES
────────────────────────────────────

Add a strong prompt/rules layer for LLM article generation.

LLM must receive:
- Market config
- Trend cluster
- Trend keyword
- SERP result analysis
- Competitor patterns
- Missing angles
- Intended article type
- Required sections
- Forbidden claims
- Monetization state = deferred

LLM must output:
- title
- h1
- meta description
- article outline
- intro
- sections
- direct answer
- competitor differentiation note
- evidence needed
- product candidate needs, but no links
- internal link suggestions
- localization notes
- status reason

LLM must not:
- copy competitor wording
- invent facts
- invent product prices
- insert affiliate links
- make medical claims
- claim “we tested” without evidence
- claim “best” without comparison
- pretend personal experience

Add:
- prompts/trend-content-strategy/system.md
- prompts/trend-content-strategy/user-template.md
- prompts/serp-analysis/system.md
- prompts/product-candidate-analysis/system.md

Add docs:
- docs/llm-strategy-prompts.md

Acceptance:
- Prompt templates are file-based, not hard-coded only.
- LLM output is structured JSON + markdown draft.
- No links are inserted at this stage.

────────────────────────────────────
PHASE 12 — TEST DATA AND END-TO-END DEMO
────────────────────────────────────

Create an end-to-end sample for 5 markets:

1. US / English
Topic: magnesium sleep
Flow:
trend -> SERP analysis -> content strategy -> test post -> product candidate analysis pending

2. Spain / Spanish
Topic: USB-C charger
Flow:
trend -> SERP analysis -> content strategy -> test post

3. Brazil / Portuguese
Topic: real capacity power bank
Flow:
trend -> SERP analysis -> content strategy -> test post

4. Japan / Japanese
Topic: compact desk gadget
Flow:
trend -> SERP analysis -> content strategy -> test post

5. Korea / Korean
Topic: gut health
Flow:
trend -> SERP analysis -> content strategy -> test post

Add sample seed files:
- data/seeds/trend-signals.csv
- data/seeds/serp-results.csv
- data/seeds/competitor-page-summaries.csv
- data/seeds/product-candidates.csv

Add output examples:
- data/exports/trend_report.json
- data/exports/serp_opportunity_report.json
- data/exports/content_strategies.json
- data/exports/test_articles.json
- data/exports/product_candidate_analysis.json

Acceptance:
- One command can run sample trend-to-test-post pipeline.
- The output clearly shows different markets have different trends.
- No affiliate API is required.
- No monetized link insertion is required.

────────────────────────────────────
PHASE 13 — COMMANDS
────────────────────────────────────

Add or update package scripts:

Trend:
- pnpm trend:import
- pnpm trend:cluster
- pnpm trend:score
- pnpm trend:report

SERP:
- pnpm serp:import
- pnpm serp:analyze
- pnpm serp:report

Strategy/Post:
- pnpm strategy:create
- pnpm post:generate-test
- pnpm post:publish-test

Calendar:
- pnpm calendar:build
- pnpm calendar:report

Performance:
- pnpm performance:import
- pnpm performance:recommend

Product candidates:
- pnpm products:import-candidates
- pnpm products:analyze-candidates

Monetization later:
- pnpm monetization:create-review
- pnpm monetization:draft-placements
- pnpm monetization:apply-approved

Main pipeline:
- pnpm pipeline:trend-to-post
  Must run only:
  trend import/cluster/score
  keyword generation
  SERP import/analyze
  strategy generation
  test article generation

- pnpm pipeline:post-to-product-analysis
  Must run:
  product candidate discovery
  product candidate analysis block

- pnpm pipeline:monetization-review
  Must require manual review files/admin approval

Acceptance:
- pnpm worker:pipeline no longer jumps into offers/outreach by default.
- New pipeline names reflect actual priority.

────────────────────────────────────
PHASE 14 — DOCUMENTATION REQUIREMENTS
────────────────────────────────────

Create or update:

docs/refactor-audit/current-state.md
docs/phase-plan.md
docs/market-routing.md
docs/one-domain-vs-multiple-domains.md
docs/trend-engine-v1.md
docs/trend-signal-schema.md
docs/trend-scoring.md
docs/cross-market-trend-map.md
docs/serp-intelligence.md
docs/serp-provider-contract.md
docs/competitor-content-analysis.md
docs/content-extraction-policy.md
docs/content-strategy-engine.md
docs/test-posting-flow.md
docs/market-editorial-calendar.md
docs/product-candidate-discovery.md
docs/product-analysis-block.md
docs/affiliate-api-playbook/aliexpress.md
docs/affiliate-api-playbook/temu.md
docs/affiliate-api-playbook/amazon.md
docs/affiliate-api-playbook/iherb.md
docs/affiliate-api-playbook/merchant-adapter-contract.md
docs/monetization-human-approval.md
docs/feature-flags.md
docs/pipeline-priority.md
docs/operations-runbook.md
docs/final-refactor-report.md

README must be updated to explain the new priority:
1. Trend Engine
2. SERP Intelligence
3. Test Posting
4. Product Candidate Analysis
5. Human-approved monetization
6. Live affiliate APIs later

Do not describe this as an affiliate auto-blog first.
Describe it as a global trend-to-content research and publishing system.

────────────────────────────────────
FINAL ACCEPTANCE
────────────────────────────────────

At the end, write:

docs/final-refactor-report.md

It must include:
1. What was kept from the previous architecture.
2. What was downgraded behind feature flags.
3. What was refactored around trend-first flow.
4. New market routing structure.
5. New trend engine flow.
6. New SERP intelligence flow.
7. New content strategy/test posting flow.
8. New product candidate analysis flow.
9. What affiliate API documentation was added.
10. What remains intentionally unimplemented.
11. Commands added.
12. Sample end-to-end run.
13. Tests/checks run.

Also write:

data/exports/refactor_capabilities.json

With:
{
  "one_domain_market_silos": true,
  "markets_supported_initial": 18,
  "trend_engine_first": true,
  "serp_intelligence_second": true,
  "test_posting_third": true,
  "product_candidate_analysis_fourth": true,
  "affiliate_api_live_integration": false,
  "affiliate_api_documentation": true,
  "human_approved_monetization": true,
  "community_auto_posting": false,
  "google_raw_serp_scraping": false,
  "default_pipeline_runs_monetization": false
}

Run or document:
- pnpm typecheck
- pnpm seo:validate
- pnpm build

If build fails due to pre-existing repo issues, document exact failures and fix them if reasonable.

Do not stop after docs only.
Implement the architecture changes needed for Phase 1, Phase 2, Phase 3, and Phase 4 at minimum.
For later phases, implement models/docs/contracts and keep live APIs disabled.