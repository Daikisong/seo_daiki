import assert from "node:assert/strict";
import type { Article, EvidencePack } from "@global-import-lab/types";
import {
  seedArticleCreateData,
  seedEvidencePackCreateData,
  seedTranslationGroupCreateData
} from "../packages/db/src/seedArticleRecords";
import {
  seedArticleCreateData as exportedSeedArticleCreateData,
  seedEvidencePackCreateData as exportedSeedEvidencePackCreateData,
  seedTranslationGroupCreateData as exportedSeedTranslationGroupCreateData
} from "../packages/db/src/seedArticles";

assert.equal(exportedSeedArticleCreateData, seedArticleCreateData);
assert.equal(exportedSeedEvidencePackCreateData, seedEvidencePackCreateData);
assert.equal(exportedSeedTranslationGroupCreateData, seedTranslationGroupCreateData);

const evidencePackData = seedEvidencePackCreateData(evidencePackFixture());
assert.equal(evidencePackData.id, "pack-1");
assert.deepEqual(evidencePackData.packJson, {
  allowedClaims: ["safe claim"],
  forbiddenClaims: [],
  marketRisks: [],
  priceSnapshots: [],
  reviewSignals: [],
  sellerClaims: [],
  variants: [],
  verifiedClaims: []
});
assert.ok(evidencePackData.createdAt instanceof Date);

const articleData = seedArticleCreateData(articleFixture());
assert.equal(articleData.id, "article-1");
assert.equal(articleData.healthSensitivity, "none");
assert.equal(articleData.complianceStatus, "unchecked");
assert.deepEqual(articleData.sections, [{ heading: "Evidence", body: "Measured output." }]);
assert.deepEqual(articleData.evidenceIds, ["evidence-1"]);
assert.deepEqual(articleData.jsonLd, {});
assert.equal(Array.isArray(articleData.affiliateLinks), true);
assert.equal(articleData.complianceJson, undefined);
assert.ok(articleData.lastUpdated instanceof Date);

const articleWithCompliance = seedArticleCreateData(
  articleFixture({
    complianceJson: { localizationDepthScore: 84, translationStatus: "localized" },
    complianceStatus: "approved",
    healthSensitivity: "medium"
  })
);
assert.deepEqual(articleWithCompliance.complianceJson, {
  localizationDepthScore: 84,
  translationStatus: "localized"
});
assert.equal(articleWithCompliance.complianceStatus, "approved");
assert.equal(articleWithCompliance.healthSensitivity, "medium");

const translationData = seedTranslationGroupCreateData({
  id: "tg-1",
  sourceArticleId: "article-en",
  variants: [
    {
      id: "tv-1",
      articleId: "article-en",
      locale: "en",
      localizationDepthScore: 100,
      status: "published"
    },
    {
      id: "tv-2",
      articleId: "article-es",
      locale: "es",
      localizationDepthScore: 84,
      sourceLocale: "en",
      status: "draft"
    }
  ]
});

assert.equal(translationData.id, "tg-1");
assert.equal(translationData.variants.create.length, 2);
assert.deepEqual(translationData.variants.create[1], {
  id: "tv-2",
  articleId: "article-es",
  locale: "es",
  sourceLocale: "en",
  localizationDepthScore: 84,
  status: "draft"
});

console.log("DB seed article record module tests passed");

function evidencePackFixture(): EvidencePack {
  return {
    id: "pack-1",
    productId: "product-1",
    locale: "en",
    packJson: {
      allowedClaims: ["safe claim"],
      forbiddenClaims: [],
      marketRisks: [],
      priceSnapshots: [],
      product: undefined,
      reviewSignals: [],
      sellerClaims: [],
      variants: [],
      verifiedClaims: []
    },
    createdAt: "2026-05-28T00:00:00.000Z"
  };
}

function articleFixture(overrides: Partial<Article> = {}): Article {
  return {
    id: "article-1",
    productId: "product-1",
    locale: "en",
    slug: "charger-guide",
    type: "guide",
    title: "Charger guide",
    h1: "Charger guide",
    metaDescription: "A charger guide with evidence.",
    summary: "A charger guide summary.",
    contentMdx: "Article body",
    sections: [{ heading: "Evidence", body: "Measured output." }],
    qualityScore: 88,
    indexStatus: "index",
    publishStatus: "published",
    hreflangMap: { en: "https://example.com/en/guides/charger-guide/" },
    internalLinks: [{ href: "/en/data/charger-data/", label: "Charger data", reason: "data" }],
    affiliateLinks: [{ href: "https://example.test", label: "Check price", rel: "sponsored nofollow" }],
    evidenceIds: ["evidence-1"],
    lastUpdated: "2026-05-28",
    ...overrides
  };
}
