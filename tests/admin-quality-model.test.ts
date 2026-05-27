import assert from "node:assert/strict";
import {
  buildAdminQualityRows,
  buildAdminQualityStats,
  issueCodes,
  type AdminQualityArticle,
  type AdminQualityEvidencePack,
  type AdminQualityProduct
} from "../apps/web/lib/admin/admin-quality-model";
import {
  hasSeoIssues,
  issueCodes as directIssueCodes,
  issuesWithPrefix
} from "../apps/web/lib/admin/admin-quality-issues";
import { buildAdminQualityRows as directBuildAdminQualityRows } from "../apps/web/lib/admin/admin-quality-rows";
import {
  average,
  buildAdminQualityStats as directBuildAdminQualityStats
} from "../apps/web/lib/admin/admin-quality-stats";
import type { QualityGateResult, ValidationIssue } from "@global-import-lab/validators";

assert.equal(buildAdminQualityRows, directBuildAdminQualityRows);
assert.equal(buildAdminQualityStats, directBuildAdminQualityStats);
assert.equal(issueCodes, directIssueCodes);
assert.equal(average([]), 0);
assert.equal(average([2, 4, 6]), 4);
assert.deepEqual(issuesWithPrefix([issue("schema_a"), issue("hreflang_b")], "schema").map((item) => item.code), [
  "schema_a"
]);

const articles: AdminQualityArticle[] = [
  {
    id: "article-a",
    productId: "product-a",
    locale: "en",
    indexStatus: "index",
    internalLinks: [
      { label: "Hub", href: "/en/hub/", reason: "category_hub" },
      { label: "Risk", href: "/en/risk/a/", reason: "risk" },
      { label: "Data", href: "/en/data/a/", reason: "data" }
    ],
    evidenceIds: ["ev-1", "ev-2"]
  },
  {
    id: "article-b",
    productId: "product-missing",
    locale: "en",
    indexStatus: "noindex",
    internalLinks: [{ label: "Guide", href: "/en/guide/", reason: "guide" }],
    evidenceIds: []
  },
  {
    id: "article-c",
    locale: "es",
    indexStatus: "pending",
    internalLinks: [],
    evidenceIds: ["ev-3"]
  }
];

const products: AdminQualityProduct[] = [
  {
    id: "product-a",
    sellerClaims: [{ id: "seller-1" }, { id: "seller-2" }] as AdminQualityProduct["sellerClaims"],
    verifiedClaims: [{ id: "verified-1" }] as AdminQualityProduct["verifiedClaims"]
  }
];

const evidencePacks: AdminQualityEvidencePack[] = [
  { productId: "product-a", locale: "en" },
  { productId: "product-a", locale: "es" }
];

const evaluated: Array<{
  articleId: string;
  productId?: string;
  evidencePackLocale?: string;
}> = [];

const rows = buildAdminQualityRows({
  articles,
  products,
  evidencePacks,
  duplicateCandidateCounts: { "product-a": 2, "product-missing": 7 },
  evaluateQualityGate: ({ article, product, evidencePack }) => {
    evaluated.push({ articleId: article.id, productId: product?.id, evidencePackLocale: evidencePack?.locale });
    return gateResultForArticle(article.id);
  }
});

assert.equal(rows.length, 3);
assert.deepEqual(evaluated, [
  { articleId: "article-a", productId: "product-a", evidencePackLocale: "en" },
  { articleId: "article-b", productId: undefined, evidencePackLocale: undefined },
  { articleId: "article-c", productId: undefined, evidencePackLocale: undefined }
]);

assert.equal(rows[0]?.evidenceCount, 5);
assert.equal(rows[0]?.duplicateCandidateCount, 2);
assert.deepEqual(rows[0]?.hreflangIssues.map((issue) => issue.code), ["hreflang_missing_return"]);
assert.deepEqual(rows[0]?.schemaIssues.map((issue) => issue.code), ["schema_invalid_product"]);
assert.deepEqual(rows[0]?.affiliateIssues.map((issue) => issue.code), ["affiliate_rel_missing"]);

assert.equal(rows[1]?.evidenceCount, 0);
assert.equal(rows[1]?.duplicateCandidateCount, 7);
assert.equal(rows[2]?.duplicateCandidateCount, 0);

assert.deepEqual(buildAdminQualityStats(rows), {
  indexedPages: 1,
  avgInternalLinks: 4 / 3,
  seoIssueRows: 1,
  duplicateCandidates: 9
});

assert.equal(issueCodes(rows[0]?.hreflangIssues ?? []), "hreflang_missing_return");
assert.equal(issueCodes([]), "-");
assert.equal(hasSeoIssues(rows[0]!), true);
assert.equal(hasSeoIssues(rows[1]!), false);

function gateResultForArticle(articleId: string): QualityGateResult {
  if (articleId === "article-a") {
    return {
      score: 72,
      indexStatus: "noindex",
      issues: [
        issue("hreflang_missing_return"),
        issue("schema_invalid_product"),
        issue("affiliate_rel_missing"),
        issue("thin_content")
      ],
      breakdown: {}
    };
  }

  return {
    score: 90,
    indexStatus: "index",
    issues: [],
    breakdown: {}
  };
}

function issue(code: string): ValidationIssue {
  return { code, message: code, severity: "blocker" };
}

console.log("Admin quality model unit tests passed");
