import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import {
  runQualityGate,
  type QualityGateResult
} from "@global-import-lab/validators";
import { getDbArticles, getDbEvidencePacks, getDbProducts } from "./contentRepository";
import {
  articleStateGateDecision,
  buildArticleStateCandidate,
  needsStrictArticleStateGate,
  selectArticleStateEvidencePack,
  selectArticleStateProduct,
  type ArticleStateGateDecision
} from "./adminPublishGateModel";
import type { ArticleStateInput } from "./adminMutationRules";

export interface ArticleStateGateEvaluationDeps {
  getArticles(): Promise<Article[]>;
  getProducts(): Promise<Product[]>;
  getEvidencePacks(): Promise<EvidencePack[]>;
  runQualityGate(input: { article: Article; product?: Product; evidencePack?: EvidencePack }): QualityGateResult;
}

export function articleStateGateEvaluationDeps(): ArticleStateGateEvaluationDeps {
  return {
    getArticles: getDbArticles,
    getProducts: getDbProducts,
    getEvidencePacks: getDbEvidencePacks,
    runQualityGate
  };
}

export async function evaluateArticleStateChange(input: ArticleStateInput): Promise<ArticleStateGateDecision> {
  return evaluateArticleStateChangeWithDeps(input, articleStateGateEvaluationDeps());
}

export async function evaluateArticleStateChangeWithDeps(
  input: ArticleStateInput,
  deps: ArticleStateGateEvaluationDeps
): Promise<ArticleStateGateDecision> {
  const articles = await deps.getArticles();
  const article = articles.find((item) => item.id === input.id);
  if (!article) {
    throw new Error(`Article ${input.id} was not found.`);
  }

  const candidate = buildArticleStateCandidate(article, input);
  if (!needsStrictArticleStateGate(candidate)) {
    return { ok: true };
  }

  const [products, evidencePacks] = await Promise.all([deps.getProducts(), deps.getEvidencePacks()]);
  const product = selectArticleStateProduct(candidate, products);
  const evidencePack = selectArticleStateEvidencePack(candidate, evidencePacks);
  const result = deps.runQualityGate({ article: candidate, product, evidencePack });
  return articleStateGateDecision(article, candidate, result);
}
