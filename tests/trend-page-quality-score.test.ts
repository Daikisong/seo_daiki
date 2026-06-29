import assert from "node:assert/strict";
import type { Article, Product } from "@global-import-lab/types";
import { articles, products } from "@global-import-lab/content";
import {
  buildTrendPageQualityScore,
  TREND_PAGE_QUALITY_SCORE_GATE
} from "../apps/web/lib/content/trend-page-quality-score";

const now = "2026-06-28";
const chargerProducts = [
  productFixture("prod-65w-gan", "65W GaN Charger", "chargers", 24),
  productFixture("prod-100w-gan", "100W GaN Charger", "chargers", 36),
  productFixture("prod-travel-adapter", "USB-C Travel Adapter", "travel adapters", 18),
  productFixture("prod-usb-c-cable", "Braided USB-C Cable", "cables", 8),
  productFixture("prod-compact-30w", "Compact 30W GaN Charger", "chargers", 14),
  productFixture("prod-dual-port-45w", "Dual Port 45W Travel Charger", "chargers", 19),
  productFixture("prod-power-bank-65w", "65W Travel Power Bank", "chargers", 42),
  productFixture("prod-plug-converter", "GaN Charger Plug Converter", "chargers", 11),
  productFixture("prod-folding-gan", "Folding Plug GaN Charger", "chargers", 22),
  productFixture("prod-premium-140w", "Premium 140W GaN Charger", "chargers", 49)
];

const chargerTrend = articleFixture({
  id: "trend-charger-ready",
  slug: "best-gan-charger-aliexpress-trend",
  title: "Best GaN charger AliExpress trend: top 10 picks to check now",
  h1: "Best GaN charger AliExpress trend: top 10 picks to check now",
  metaDescription:
    "Quick answer, price evidence, wattage checks, travel adapter risks, and top 10 AliExpress-style charger picks.",
  summary:
    "Quick answer: start with a verified 65W GaN charger, compare the 100W GaN charger only when the exact SKU and price evidence match, and keep a USB-C cable or travel adapter as a supporting pick.",
  contentMdx:
    "top 10 best charger buyer guide compare price prices where to buy aliexpress deal picks product products 65w gan charger 100w gan charger usb-c travel adapter braided usb-c cable evidence wattage final price return risk",
  evidenceIds: ["ev-output", "ev-price", "ev-return", "ev-review"],
  lastUpdated: "2026-06-20",
  sections: [
    {
      heading: "Quick answer",
      body:
        "The best first pick is the 65W GaN Charger because it has the cleanest output evidence, price history, and variant checks. Choose the 100W GaN Charger only if the live listing matches the tested SKU, and avoid mystery bundles without return terms.",
      evidenceIds: ["ev-output", "ev-price"]
    },
    {
      heading: "Fresh price and evidence check",
      body:
        "Use the latest price snapshot, review signal, certification risk, and seller evidence before clicking an AliExpress offer.",
      evidenceIds: ["ev-return"]
    },
    {
      heading: "Top 10 recommendation checklist",
      body:
        "The top 3 picks should lead with verified charger records, while the top 10 can include cable, adapter, organizer, and backup options after manual review.",
      evidenceIds: ["ev-review"]
    }
  ],
  internalLinks: [
    { label: "Charger output data", href: "/en/data/charger-output/", reason: "data" },
    { label: "Import risk notes", href: "/en/risk/charger-import-risk/", reason: "risk" },
    { label: "Testing method", href: "/en/methodology/charger-testing/", reason: "methodology" },
    { label: "Buyer guide", href: "/en/guides/usb-c-charger-guide/", reason: "guide" }
  ],
  affiliateLinks: [
    {
      label: "Check live AliExpress price",
      href: "https://www.aliexpress.com/item/charger",
      rel: "sponsored nofollow",
      placementStatus: "approved",
      disclosureShown: true,
      offerStatus: "active",
      merchantSlug: "aliexpress"
    }
  ]
});

const chargerScore = buildTrendPageQualityScore(chargerTrend, chargerProducts, { now });
assert.ok(
  chargerScore.score >= TREND_PAGE_QUALITY_SCORE_GATE,
  `expected charger trend to score >=${TREND_PAGE_QUALITY_SCORE_GATE}, received ${chargerScore.score}`
);
assert.equal(chargerScore.score <= 100, true);
assert.equal(chargerScore.sergAliBenchmarkReady, true);
assert.equal(chargerScore.passedGate, true);
assert.equal(chargerScore.recommendationModel.eligible, true);
assert.equal(chargerScore.recommendationModel.recommendations.length, 10);
assert.equal(chargerScore.recommendationModel.recommendations.every((item) => item.badge === "Evidence record"), true);
assert.equal(chargerScore.recommendationModel.recommendations.every((item) => item.evidenceIds.length > 0), true);
assert.equal(new Set(chargerScore.recommendationModel.recommendations.map((item) => item.href)).size, 10);
assert.equal(chargerScore.top3Ready, true);
assert.equal(chargerScore.top10Ready, true);
assert.equal(chargerScore.itemListReady, true);
assert.equal(chargerScore.benchmarkStructureReady, true);
assert.deepEqual(chargerScore.benchmarkSections, {
  answerFirst: true,
  trendBackdata: true,
  selectionMethod: true,
  comparisonTable: true,
  inDepthReviews: true,
  finalVerdict: true,
  faq: true,
  editorialMethod: true
});
assert.equal(chargerScore.breakdown.benchmarkStructureReadiness, 15);
assert.ok(chargerScore.strengths.includes("SergAli-style review structure ready"));
assert.equal(chargerScore.breakdown.penalties, 0);

const thinReviewStructureTrend = articleFixture({
  ...chargerTrend,
  id: "trend-charger-thin-review-structure",
  slug: "best-gan-charger-thin-review-structure",
  internalLinks: [{ label: "Buyer guide", href: "/en/guides/usb-c-charger-guide/", reason: "guide" }]
});
const thinReviewStructureScore = buildTrendPageQualityScore(thinReviewStructureTrend, chargerProducts, { now });
assert.equal(thinReviewStructureScore.recommendationModel.eligible, true);
assert.equal(thinReviewStructureScore.top10Ready, true);
assert.equal(thinReviewStructureScore.benchmarkStructureReady, false);
assert.equal(thinReviewStructureScore.sergAliBenchmarkReady, false);
assert.equal(thinReviewStructureScore.passedGate, false);
assert.equal(thinReviewStructureScore.benchmarkSections.selectionMethod, false);
assert.equal(thinReviewStructureScore.benchmarkSections.editorialMethod, false);
assert.equal(
  thinReviewStructureScore.issues.some((issue) => issue.code === "benchmark_structure_incomplete"),
  true
);

const weatherLegalTrend = articleFixture({
  id: "trend-weather-legal",
  slug: "storm-warning-legal-rights-update",
  title: "Storm warning legal rights update",
  h1: "Storm warning legal rights update",
  metaDescription: "Current weather warning, court guidance, lawyer questions, and official emergency sources.",
  summary:
    "Quick answer: check official weather and emergency sources first, then use a qualified attorney or legal aid resource for rights questions.",
  contentMdx:
    "storm weather warning emergency legal law lawyer attorney lawsuit court government evacuation official update school closing",
  evidenceIds: ["ev-weather", "ev-official"],
  lastUpdated: "2026-06-27",
  sections: [
    {
      heading: "Quick answer",
      body:
        "This is an informational weather and legal update. Do not treat it as a shopping page, and verify the storm warning with official emergency sources.",
      evidenceIds: ["ev-weather"]
    },
    {
      heading: "Official sources",
      body: "Use weather service, emergency management, court, and legal aid sources before making decisions.",
      evidenceIds: ["ev-official"]
    }
  ],
  internalLinks: [{ label: "Public safety guide", href: "/en/guides/public-safety/", reason: "guide" }]
});

const weatherLegalScore = buildTrendPageQualityScore(weatherLegalTrend, chargerProducts, { now });
assert.ok(
  weatherLegalScore.score < TREND_PAGE_QUALITY_SCORE_GATE,
  `expected weather/legal trend below gate ${TREND_PAGE_QUALITY_SCORE_GATE}, received ${weatherLegalScore.score}`
);
assert.equal(weatherLegalScore.sergAliBenchmarkReady, false);
assert.equal(weatherLegalScore.passedGate, false);
assert.equal(weatherLegalScore.recommendationModel.eligible, false);
assert.equal(weatherLegalScore.issues.some((issue) => issue.code === "informational_risk_topic"), true);
assert.ok(weatherLegalScore.breakdown.penalties >= 30);

const sampleTravelGanTrend = articles.find(
  (article) => article.locale === "en" && article.type === "trend" && article.slug === "travel-gan-charger-fake-wattage-trend"
);
assert.ok(sampleTravelGanTrend);
const sampleTravelGanTrendScore = buildTrendPageQualityScore(sampleTravelGanTrend, products, { now });
assert.ok(
  sampleTravelGanTrendScore.score >= TREND_PAGE_QUALITY_SCORE_GATE,
  `expected sample travel GaN trend to score >=${TREND_PAGE_QUALITY_SCORE_GATE}, received ${sampleTravelGanTrendScore.score}: ${sampleTravelGanTrendScore.issues.map((issue) => issue.code).join(", ")}`
);
assert.equal(sampleTravelGanTrendScore.passedGate, true);
assert.equal(sampleTravelGanTrendScore.sergAliBenchmarkReady, true);
assert.equal(sampleTravelGanTrendScore.recommendationModel.eligible, true);
assert.equal(sampleTravelGanTrendScore.top10Ready, true);
assert.equal(sampleTravelGanTrendScore.benchmarkStructureReady, true);
assert.equal(sampleTravelGanTrendScore.breakdown.benchmarkStructureReadiness, 15);

console.log("Trend page quality score unit tests passed");

function articleFixture(overrides: Partial<Article> = {}): Article {
  return {
    id: "trend-fixture",
    locale: "en",
    slug: "trend-fixture",
    type: "trend",
    title: "Trend fixture",
    h1: "Trend fixture",
    metaDescription: "Trend fixture meta.",
    summary: "Trend fixture summary.",
    contentMdx: "Trend fixture body.",
    sections: [{ heading: "Signal", body: "Signal body." }],
    qualityScore: 84,
    indexStatus: "index",
    publishStatus: "published",
    healthSensitivity: "none",
    complianceStatus: "unchecked",
    hreflangMap: {},
    internalLinks: [],
    affiliateLinks: [],
    evidenceIds: [],
    lastUpdated: "2026-06-20",
    ...overrides
  };
}

function productFixture(id: string, canonicalName: string, category: string, price: number): Product {
  return {
    id,
    canonicalName,
    slug: canonicalName.toLowerCase().replaceAll(" ", "-"),
    category,
    identityConfidence: 0.92,
    variants: [],
    sellerClaims: [],
    verifiedClaims: [
      {
        id: `${id}-verified`,
        productId: id,
        testType: "output",
        resultValue: canonicalName.includes("Cable") ? "100" : "65",
        unit: canonicalName.includes("Cable") ? "W compatible" : "W",
        method: "bench check",
        confidence: 0.9,
        testedAt: "2026-06-18"
      }
    ],
    reviewSignals: [
      {
        id: `${id}-review`,
        productId: id,
        locale: "en",
        topic: "shipping and variant accuracy",
        sentiment: "neutral",
        count: 42,
        confidence: 0.82,
        window: "30d"
      }
    ],
    priceSnapshots: [
      {
        id: `${id}-price`,
        productId: id,
        country: "US",
        currency: "USD",
        price,
        finalPrice: price + 3,
        capturedAt: "2026-06-18"
      }
    ],
    marketRisks: [
      {
        id: `${id}-risk`,
        productId: id,
        locale: "en",
        country: "US",
        certificationRisk: "medium",
        returnRisk: "medium",
        score: 0.34
      }
    ]
  };
}
