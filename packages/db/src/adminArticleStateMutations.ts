import type { ValidationIssue } from "@global-import-lab/validators";
import { runQualityGate } from "@global-import-lab/validators";
import { prisma } from "./client";
import { getDbArticles, getDbEvidencePacks, getDbProducts } from "./contentRepository";
import {
  articleStateGateBlockedAuditData,
  articleStateUpdatedAuditData
} from "./adminMutationAuditPayloads";
import {
  articleStateGateDecision,
  buildArticleStateCandidate,
  needsStrictArticleStateGate,
  selectArticleStateEvidencePack,
  selectArticleStateProduct
} from "./adminPublishGateModel";
import {
  normalizeArticleStateInput,
  type ArticleStateInput,
  type IndexStatusInput,
  type PublishStatusInput
} from "./adminMutationRules";
import { AdminPublishGateError } from "./adminPublishGateError";

export async function updateArticleState(input: {
  id: string;
  indexStatus?: IndexStatusInput;
  publishStatus?: PublishStatusInput;
  qualityScore?: number;
}) {
  const updateInput = normalizeArticleStateInput(input);
  const gate = await evaluateArticleStateChange(updateInput);
  if (!gate.ok) {
    await prisma.auditLog.create({
      data: articleStateGateBlockedAuditData({
        effective: updateInput,
        requested: input,
        before: gate.before,
        gateStatus: gate.gateStatus,
        gateScore: gate.gateScore,
        issues: gate.issues
      })
    });
    throw new AdminPublishGateError({
      articleId: updateInput.id,
      issues: gate.issues,
      gateStatus: gate.gateStatus,
      gateScore: gate.gateScore
    });
  }

  return prisma.$transaction(async (tx) => {
    const before = await tx.article.findUnique({ where: { id: updateInput.id } });
    const row = await tx.article.update({
      where: { id: updateInput.id },
      data: {
        indexStatus: updateInput.indexStatus,
        publishStatus: updateInput.publishStatus,
        qualityScore: updateInput.qualityScore
      },
      select: { id: true, indexStatus: true, publishStatus: true, qualityScore: true }
    });

    await tx.auditLog.create({
      data: articleStateUpdatedAuditData({
        row,
        before,
        after: row
      })
    });

    return row;
  });
}

async function evaluateArticleStateChange(input: ArticleStateInput): Promise<
  | { ok: true }
  | {
      ok: false;
      before: unknown;
      issues: ValidationIssue[];
      gateStatus: string;
      gateScore: number;
    }
> {
  const articles = await getDbArticles();
  const article = articles.find((item) => item.id === input.id);
  if (!article) {
    throw new Error(`Article ${input.id} was not found.`);
  }

  const candidate = buildArticleStateCandidate(article, input);
  if (!needsStrictArticleStateGate(candidate)) {
    return { ok: true };
  }

  const [products, evidencePacks] = await Promise.all([getDbProducts(), getDbEvidencePacks()]);
  const product = selectArticleStateProduct(candidate, products);
  const evidencePack = selectArticleStateEvidencePack(candidate, evidencePacks);
  const result = runQualityGate({ article: candidate, product, evidencePack });
  return articleStateGateDecision(article, candidate, result);
}
