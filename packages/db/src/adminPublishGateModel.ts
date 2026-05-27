import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import type { QualityGateResult, ValidationIssue } from "@global-import-lab/validators";
import {
  collectArticleStateGateBlockers,
  type ArticleStateInput
} from "./adminMutationRules";

export type ArticleStateGateDecision =
  | { ok: true }
  | {
      ok: false;
      before: Article;
      issues: ValidationIssue[];
      gateStatus: string;
      gateScore: number;
    };

export function buildArticleStateCandidate(article: Article, input: ArticleStateInput): Article {
  return {
    ...article,
    indexStatus: input.indexStatus ?? article.indexStatus,
    publishStatus: input.publishStatus ?? article.publishStatus,
    qualityScore: input.qualityScore ?? article.qualityScore
  };
}

export function needsStrictArticleStateGate(candidate: Pick<Article, "indexStatus">) {
  return candidate.indexStatus === "index";
}

export function selectArticleStateProduct(candidate: Pick<Article, "productId">, products: Product[]) {
  return candidate.productId ? products.find((item) => item.id === candidate.productId) : undefined;
}

export function selectArticleStateEvidencePack(
  candidate: Pick<Article, "locale" | "productId">,
  evidencePacks: EvidencePack[]
) {
  return evidencePacks.find(
    (pack) => pack.productId === candidate.productId && pack.locale === candidate.locale
  );
}

export function articleStateGateDecision(
  before: Article,
  candidate: Article,
  result: QualityGateResult
): ArticleStateGateDecision {
  const blockers = collectArticleStateGateBlockers(candidate, result);
  if (blockers.length === 0) {
    return { ok: true };
  }

  return {
    ok: false,
    before,
    issues: blockers,
    gateStatus: result.indexStatus,
    gateScore: result.score
  };
}
