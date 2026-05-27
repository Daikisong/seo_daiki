import assert from "node:assert/strict";
import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import type { ValidationIssue } from "@global-import-lab/validators";
import {
  evaluateArticleStateChangeWithDeps,
  type ArticleStateGateEvaluationDeps
} from "../packages/db/src/adminArticleStateGateEvaluation";
import { commitArticleStateUpdate } from "../packages/db/src/adminArticleStateUpdateTransaction";

const article: Article = {
  id: "article-a",
  productId: "product-a",
  locale: "en",
  slug: "sample-review",
  type: "review",
  title: "Sample Review",
  h1: "Sample Review",
  metaDescription: "A sample review meta description.",
  summary: "A long enough sample summary for test fixtures.",
  contentMdx: "variant evidence price risk",
  sections: [{ heading: "Evidence", body: "Measured output and risk notes." }],
  qualityScore: 76,
  indexStatus: "pending",
  publishStatus: "draft",
  hreflangMap: {},
  internalLinks: [],
  affiliateLinks: [],
  evidenceIds: [],
  lastUpdated: "2026-05-27"
};

const product: Product = {
  id: "product-a",
  canonicalName: "Sample Product",
  slug: "sample-product",
  category: "sample",
  identityConfidence: 0.8,
  variants: [],
  sellerClaims: [],
  verifiedClaims: [],
  reviewSignals: [],
  priceSnapshots: [],
  marketRisks: []
};

const evidencePack: EvidencePack = {
  id: "pack-a",
  productId: "product-a",
  locale: "en",
  packJson: {
    variants: [],
    sellerClaims: [],
    verifiedClaims: [],
    reviewSignals: [],
    priceSnapshots: [],
    marketRisks: [],
    allowedClaims: [],
    forbiddenClaims: []
  },
  createdAt: "2026-05-27"
};

async function main() {
  await testNoindexChangeSkipsStrictGate();
  await testStrictGateBlocksIndexing();
  await testMissingArticleThrows();
  await testCommitArticleStateUpdate();
  console.log("Admin article state mutation module tests passed");
}

async function testNoindexChangeSkipsStrictGate() {
  const calls: string[] = [];
  const decision = await evaluateArticleStateChangeWithDeps(
    { id: "article-a", indexStatus: "noindex", publishStatus: "draft" },
    fakeGateDeps({ calls })
  );

  assert.deepEqual(decision, { ok: true });
  assert.deepEqual(calls, ["getArticles"]);
}

async function testStrictGateBlocksIndexing() {
  const blocker: ValidationIssue = {
    code: "missing_evidence",
    message: "Evidence is missing.",
    severity: "blocker"
  };
  const calls: string[] = [];
  const decision = await evaluateArticleStateChangeWithDeps(
    { id: "article-a", indexStatus: "index", publishStatus: "published", qualityScore: 70 },
    fakeGateDeps({
      calls,
      gateResult: { score: 40, indexStatus: "noindex", issues: [blocker], breakdown: {} }
    })
  );

  assert.deepEqual(calls, ["getArticles", "getProducts", "getEvidencePacks", "runQualityGate"]);
  assert.equal(decision.ok, false);
  if (!decision.ok) {
    assert.equal(decision.before.id, "article-a");
    assert.equal(decision.gateStatus, "noindex");
    assert.equal(decision.gateScore, 40);
    assert.deepEqual(decision.issues.map((issue) => issue.code), [
      "missing_evidence",
      "quality_score_below_index_threshold",
      "quality_gate_not_index"
    ]);
  }
}

async function testMissingArticleThrows() {
  await assert.rejects(
    () => evaluateArticleStateChangeWithDeps({ id: "missing", indexStatus: "noindex" }, fakeGateDeps({ articles: [] })),
    /Article missing was not found/
  );
}

async function testCommitArticleStateUpdate() {
  const tx = fakeArticleStateUpdateTransaction();
  const row = await commitArticleStateUpdate(tx, {
    id: "article-a",
    indexStatus: "index",
    publishStatus: "published",
    qualityScore: 91
  });

  assert.deepEqual(row, {
    id: "article-a",
    indexStatus: "index",
    publishStatus: "published",
    qualityScore: 91
  });
  assert.deepEqual(tx.calls.map((call) => call.method), ["findUnique", "update", "create"]);
  assert.equal(tx.calls[2].args.data.action, "update");
  assert.equal(tx.calls[2].args.data.entityId, "article-a");
}

function fakeGateDeps(input: {
  calls?: string[];
  articles?: Article[];
  gateResult?: ReturnType<ArticleStateGateEvaluationDeps["runQualityGate"]>;
} = {}): ArticleStateGateEvaluationDeps {
  const calls = input.calls ?? [];
  return {
    async getArticles() {
      calls.push("getArticles");
      return input.articles ?? [article];
    },
    async getProducts() {
      calls.push("getProducts");
      return [product];
    },
    async getEvidencePacks() {
      calls.push("getEvidencePacks");
      return [evidencePack];
    },
    runQualityGate(gateInput) {
      calls.push("runQualityGate");
      assert.equal(gateInput.article.id, "article-a");
      assert.equal(gateInput.product?.id, "product-a");
      assert.equal(gateInput.evidencePack?.id, "pack-a");
      return input.gateResult ?? { score: 95, indexStatus: "index", issues: [], breakdown: {} };
    }
  };
}

function fakeArticleStateUpdateTransaction() {
  const calls: Array<{ method: string; args: any }> = [];
  return {
    calls,
    article: {
      async findUnique(args: { where: { id: string } }) {
        calls.push({ method: "findUnique", args });
        return { id: args.where.id, indexStatus: "pending", publishStatus: "draft", qualityScore: 76 };
      },
      async update(args: any) {
        calls.push({ method: "update", args });
        return {
          id: args.where.id,
          indexStatus: args.data.indexStatus,
          publishStatus: args.data.publishStatus,
          qualityScore: args.data.qualityScore
        };
      }
    },
    auditLog: {
      async create(args: any) {
        calls.push({ method: "create", args });
        return args.data;
      }
    }
  };
}

main();
