import assert from "node:assert/strict";
import test from "node:test";

import { fixtureProductCandidates, fixtureTrendCandidate } from "./pipeline-fixture";
import { buildDraftHreflangAlternates, localeDuplicateRepairTasks, runTrendToAffiliatePipelineDryRun } from "./pipeline-runner";
import type { ArticleDraft, ProductCandidate, TrendCandidate } from "./pipeline-models";

test("pipeline missing local fit returns repair task", () => {
  const productCandidates = cloneProducts();
  productCandidates[0] = { ...productCandidates[0], localRiskNote: undefined };

  const artifacts = runTrendToAffiliatePipelineDryRun({ productCandidates });

  assert.equal(hasRepairTask(artifacts.repair_tasks, "MISSING_LOCAL_FIT"), true);
  assert.equal(artifacts.publish_candidate.canPublish, false);
});

test("pipeline missing evidence returns repair task", () => {
  const productCandidates = cloneProducts();
  productCandidates[0] = {
    ...productCandidates[0],
    evidenceLevel: undefined,
    officialSpecSource: undefined,
    marketplaceSource: undefined,
    priceCheckedAt: undefined,
    reviewComplaintSignal: undefined
  };

  const artifacts = runTrendToAffiliatePipelineDryRun({ productCandidates });

  assert.equal(hasRepairTask(artifacts.repair_tasks, "MISSING_PRODUCT_EVIDENCE"), true);
  assert.equal(artifacts.publish_candidate.canPublish, false);
});

test("pipeline internal affiliate redirect blocks publish", () => {
  const productCandidates = cloneProducts();
  productCandidates[0] = {
    ...productCandidates[0],
    merchantUrl: "https://trend-jacob.example/api/affiliate-click/fixture-portable-ac-1"
  };

  const artifacts = runTrendToAffiliatePipelineDryRun({ productCandidates });

  assert.equal(artifacts.quality_gate_report.status, "BLOCKED");
  assert.equal(hasRepairTask(artifacts.repair_tasks, "FRAGILE_PRODUCT_HREF"), true);
  assert.equal(artifacts.publish_candidate.canPublish, false);
});

test("pipeline planned locale stays noindex and out of sitemap", () => {
  const trendCandidate: TrendCandidate = {
    ...fixtureTrendCandidate,
    locale: "de-de",
    market: "Germany",
    seedKeyword: "Hitzewelle mobile Klimaanlage",
    trendTitle: "Germany heatwave mobile AC buying problem"
  };

  const artifacts = runTrendToAffiliatePipelineDryRun({ trendCandidate });

  assert.equal(artifacts.article_draft.locale, "de-de");
  assert.equal(artifacts.article_draft.indexStatus, "noindex");
  assert.equal(artifacts.publish_candidate.sitemapAction, "none");
  assert.deepEqual(artifacts.publish_candidate.hreflangAlternates, {});
});

test("pipeline dry-run never auto-publishes or writes sitemap candidates", () => {
  const artifacts = runTrendToAffiliatePipelineDryRun();

  assert.equal(artifacts.article_draft.publishStatus, "draft");
  assert.equal(artifacts.article_draft.indexStatus, "noindex");
  assert.equal(artifacts.publish_candidate.canPublish, false);
  assert.equal(artifacts.publish_candidate.manualReviewReady, true);
  assert.equal(artifacts.publish_candidate.manualOnly, true);
  assert.equal(artifacts.publish_candidate.sitemapAction, "none");
  assert.equal(artifacts.publish_candidate.publicRouteAction, "none");
});

test("pipeline hreflang only generated for true localized alternatives", () => {
  const base = draft({
    id: "draft-en",
    locale: "en",
    slug: "heatwave-guide-en",
    indexStatus: "index",
    localization: {
      clusterId: "heatwave",
      coreTrendId: "heatwave-2026",
      buyerProblemId: "portable-ac",
      xDefault: true
    }
  });
  const looseRelated = draft({
    id: "draft-en-related",
    locale: "en",
    slug: "summer-fan-guide",
    indexStatus: "index"
  });
  const plannedTrueAlternative = draft({
    id: "draft-de",
    locale: "de-de",
    slug: "hitzewelle-klimaanlage",
    indexStatus: "index",
    localization: {
      clusterId: "heatwave",
      coreTrendId: "heatwave-2026",
      buyerProblemId: "portable-ac"
    }
  });

  assert.deepEqual(buildDraftHreflangAlternates(base, [base, looseRelated]), {});
  assert.deepEqual(buildDraftHreflangAlternates(base, [base, plannedTrueAlternative]), {});
});

test("pipeline near-duplicate locale pages require repair", () => {
  const first = draft({ id: "draft-en", locale: "en", slug: "heatwave-guide-en" });
  const second = draft({ id: "draft-en-us", locale: "en-us", slug: "heatwave-guide-us" });

  const tasks = localeDuplicateRepairTasks([first, second]);

  assert.equal(hasRepairTask(tasks, "NEAR_DUPLICATE_LOCALE_REPAIR"), true);
});

test("pipeline direct-use claim without direct-use evidence blocks publish", () => {
  const productCandidates = cloneProducts();
  productCandidates[0] = {
    ...productCandidates[0],
    bestFor: "I personally tested this unit for travelers who need fast cooling."
  };

  const artifacts = runTrendToAffiliatePipelineDryRun({ productCandidates });

  assert.equal(artifacts.quality_gate_report.status, "BLOCKED");
  assert.equal(hasRepairTask(artifacts.repair_tasks, "UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM"), true);
  assert.equal(artifacts.publish_candidate.canPublish, false);
});

function cloneProducts(): ProductCandidate[] {
  return JSON.parse(JSON.stringify(fixtureProductCandidates)) as ProductCandidate[];
}

function hasRepairTask(tasks: Array<{ code: string }>, code: string) {
  return tasks.some((task) => task.code === code);
}

function draft(overrides: Partial<ArticleDraft> = {}): ArticleDraft {
  return {
    id: "draft",
    strategyId: "strategy",
    locale: "en",
    slug: "draft",
    title: "Heatwave portable AC buying guide",
    h1: "Heatwave portable AC buying guide",
    summary:
      "Heatwave demand makes shoppers compare real compressor ACs, mini coolers, delivery timing, voltage, return routes, and product fit.",
    productCategory: "portable air conditioner heatwave cooling",
    indexStatus: "noindex",
    publishStatus: "draft",
    contentBlocks: [
      {
        role: "intro",
        heading: "What is moving now",
        body: "Heatwave demand makes shoppers compare real compressor ACs, mini coolers, delivery timing, voltage, return routes, and product fit."
      },
      {
        role: "quick-answer",
        heading: "Quick answer",
        body: "Buyers should compare real compressor ACs, local seller routes, voltage, window fit, and returns before clicking price buttons."
      }
    ],
    affiliateLinks: [],
    ...overrides
  };
}
