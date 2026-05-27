import assert from "node:assert/strict";
import { locales } from "@global-import-lab/types";
import { locales as directLocales } from "@global-import-lab/types/locales";
import type {
  Article,
  ContentStrategyRecord,
  EvidencePack,
  MarketConfig,
  Product,
  ProductCandidateRecord,
  SerpKeywordOpportunityRecord,
  TestArticleRecord,
  TrendClusterRecord
} from "@global-import-lab/types";

assert.deepEqual(locales, ["en", "es", "pt-br"]);
assert.strictEqual(directLocales, locales);

const market = {
  market: "us",
  language: "en",
  country: "US",
  currency: "USD",
  timezone: "America/New_York",
  trendsGeo: "US",
  serpGl: "us",
  serpHl: "en",
  pathPrefix: "/us/en",
  enabled: true,
  monetizationReadiness: "research_only",
  defaultCategories: [],
  blockedCategories: [],
  searchConsoleCountryFilter: "usa",
  serpLocaleConfig: { gl: "us", hl: "en" },
  localizationRules: [],
  trendFeedPath: "data/markets/us/trends.json",
  editorialCalendarPath: "data/markets/us/calendar.json"
} satisfies MarketConfig;

const product = {
  id: "p1",
  canonicalName: "USB-C Charger",
  slug: "usb-c-charger",
  category: "charger",
  identityConfidence: 0.9,
  variants: [],
  sellerClaims: [],
  verifiedClaims: [],
  reviewSignals: [],
  priceSnapshots: [],
  marketRisks: []
} satisfies Product;

const evidencePack = {
  id: "ep1",
  productId: product.id,
  locale: "en",
  packJson: {
    product: {
      id: product.id,
      canonicalName: product.canonicalName,
      slug: product.slug,
      category: product.category
    },
    variants: [],
    sellerClaims: [],
    verifiedClaims: [],
    reviewSignals: [],
    priceSnapshots: [],
    marketRisks: [],
    allowedClaims: [],
    forbiddenClaims: []
  },
  createdAt: "2026-05-28T00:00:00.000Z"
} satisfies EvidencePack;

const article = {
  id: "a1",
  locale: "en",
  slug: "usb-c-charger",
  type: "guide",
  title: "USB-C Charger Guide",
  h1: "USB-C Charger Guide",
  metaDescription: "A guide.",
  summary: "Summary",
  contentMdx: "Body",
  sections: [{ heading: "Overview", body: "Body" }],
  qualityScore: 90,
  indexStatus: "noindex",
  publishStatus: "draft",
  hreflangMap: {},
  internalLinks: [],
  affiliateLinks: [],
  evidenceIds: [evidencePack.id],
  lastUpdated: "2026-05-28"
} satisfies Article;

const trendCluster = {
  id: "tc1",
  market: market.market,
  language: market.language,
  canonicalTopic: "USB-C Charger",
  slug: "usb-c-charger",
  category: "electronics",
  detectedAt: "2026-05-28",
  status: "scored",
  signalCount: 3,
  countriesSeenJson: ["US"],
  relatedKeywordsJson: ["usb c charger"],
  score: 80,
  scoreBreakdownJson: { velocity: 20 }
} satisfies TrendClusterRecord;

const serpOpportunity = {
  id: "so1",
  keywordId: "kw1",
  market: market.market,
  language: market.language,
  keyword: "usb c charger",
  opportunityScore: 70,
  dominantIntent: "commercial",
  dominantContentTypesJson: ["guide"],
  topPatternsJson: [],
  contentGapJson: {},
  recommendedAngle: "real wattage",
  recommendedArticleType: "guide",
  shouldWrite: true,
  reason: "Gap exists"
} satisfies SerpKeywordOpportunityRecord;

const strategy = {
  id: "cs1",
  keywordId: serpOpportunity.keywordId,
  clusterId: trendCluster.id,
  market: market.market,
  language: market.language,
  slug: trendCluster.slug,
  selectedArticleType: "guide",
  recommendedAngle: serpOpportunity.recommendedAngle,
  titleStrategy: "Explain real wattage",
  sectionPlanJson: [],
  evidenceNeededJson: [],
  monetizationDeferred: true,
  status: "draft"
} satisfies ContentStrategyRecord;

const testArticle = {
  id: "ta1",
  strategyId: strategy.id,
  market: market.market,
  language: market.language,
  slug: article.slug,
  title: article.title,
  h1: article.h1,
  metaDescription: article.metaDescription,
  status: "test_published_noindex",
  indexStatus: "noindex",
  publishStatus: "published",
  sections: article.sections,
  productCandidateState: "pending"
} satisfies TestArticleRecord;

const candidate = {
  id: "pc1",
  articleId: testArticle.id,
  market: market.market,
  language: market.language,
  sourceMerchant: "manual",
  sourceMode: "manual_csv_now",
  title: product.canonicalName,
  reason: "Matches charging topic",
  relevanceScore: 0.8,
  riskScore: 0.2,
  evidenceNeededJson: [],
  status: "analysis_pending"
} satisfies ProductCandidateRecord;

assert.equal(candidate.articleId, testArticle.id);
console.log("Types module export tests passed");
