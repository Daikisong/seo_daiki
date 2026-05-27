import { prisma } from "./client";
import { getDbArticles, getDbEvidencePacks, getDbProducts } from "./contentRepository";
import { runQualityGate, type ValidationIssue } from "@global-import-lab/validators";
import { deleteAdminRecordByType, findAdminRecord, updateArchivedAt } from "./adminRecordMutations";
import {
  evidencePackMutationData,
  marketRiskMutationData,
  productMutationData,
  sellerClaimMutationData,
  variantMutationData,
  verifiedClaimMutationData,
  type EvidencePackMutationInput,
  type MarketRiskMutationInput,
  type ProductMutationInput,
  type SellerClaimMutationInput,
  type VariantMutationInput,
  type VerifiedClaimMutationInput
} from "./adminMutationPayloads";
import {
  adminEntityTypes,
  adminRecordActions,
  archiveSummary,
  collectArticleStateGateBlockers,
  deleteSummary,
  indexStatuses,
  isAdminEntityType,
  isAdminRecordAction,
  isIndexStatus,
  isPublishStatus,
  normalizeArticleStateInput,
  publishStatuses,
  relatedArticleArchiveData,
  shouldArchiveRelatedArticles,
  toJson,
  type AdminEntityType,
  type AdminRecordAction,
  type ArticleStateInput,
  type IndexStatusInput,
  type PublishStatusInput
} from "./adminMutationRules";

export {
  adminEntityTypes,
  adminRecordActions,
  indexStatuses,
  isAdminEntityType,
  isAdminRecordAction,
  isIndexStatus,
  isPublishStatus,
  publishStatuses,
  type AdminEntityType,
  type AdminRecordAction,
  type IndexStatusInput,
  type PublishStatusInput
};

export class AdminPublishGateError extends Error {
  readonly articleId: string;
  readonly issues: ValidationIssue[];
  readonly gateStatus: string;
  readonly gateScore: number;

  constructor(input: { articleId: string; issues: ValidationIssue[]; gateStatus: string; gateScore: number }) {
    super("Article cannot be marked indexable because the publishing gate failed.");
    this.name = "AdminPublishGateError";
    this.articleId = input.articleId;
    this.issues = input.issues;
    this.gateStatus = input.gateStatus;
    this.gateScore = input.gateScore;
  }
}

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
      data: {
        entityType: "article",
        entityId: updateInput.id,
        action: "publish_gate_blocked",
        actor: "admin",
        summary: "Blocked article index/publish state update because the publishing gate failed.",
        beforeJson: toJson(gate.before),
        afterJson: toJson({
          requested: input,
          effective: updateInput,
          gateStatus: gate.gateStatus,
          gateScore: gate.gateScore,
          issues: gate.issues
        })
      }
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
      data: {
        entityType: "article",
        entityId: row.id,
        action: "update",
        actor: "admin",
        summary: "Updated article index/publish state after publishing gate validation.",
        beforeJson: before ? toJson(before) : undefined,
        afterJson: toJson(row)
      }
    });

    return row;
  });
}

export async function upsertProduct(input: ProductMutationInput) {
  const data = productMutationData(input);

  if (input.id) {
    return prisma.product.update({
      where: { id: input.id },
      data,
      select: { id: true, canonicalName: true, slug: true }
    });
  }

  return prisma.product.create({
    data,
    select: { id: true, canonicalName: true, slug: true }
  });
}

export async function upsertVariant(input: VariantMutationInput) {
  const data = variantMutationData(input);

  if (input.id) {
    return prisma.variant.update({
      where: { id: input.id },
      data,
      select: { id: true, productId: true, optionName: true }
    });
  }

  return prisma.variant.create({
    data,
    select: { id: true, productId: true, optionName: true }
  });
}

export async function upsertSellerClaim(input: SellerClaimMutationInput) {
  const data = sellerClaimMutationData(input);

  if (input.id) {
    return prisma.sellerClaim.update({
      where: { id: input.id },
      data,
      select: { id: true, productId: true, claimType: true, claimValue: true }
    });
  }

  return prisma.sellerClaim.create({
    data,
    select: { id: true, productId: true, claimType: true, claimValue: true }
  });
}

export async function upsertVerifiedClaim(input: VerifiedClaimMutationInput) {
  const data = verifiedClaimMutationData(input);

  if (input.id) {
    return prisma.verifiedClaim.update({
      where: { id: input.id },
      data,
      select: { id: true, productId: true, testType: true, resultValue: true }
    });
  }

  return prisma.verifiedClaim.create({
    data,
    select: { id: true, productId: true, testType: true, resultValue: true }
  });
}

export async function upsertMarketRisk(input: MarketRiskMutationInput) {
  const data = marketRiskMutationData(input);

  if (input.id) {
    return prisma.marketRisk.update({
      where: { id: input.id },
      data,
      select: { id: true, productId: true, locale: true, country: true }
    });
  }

  return prisma.marketRisk.create({
    data,
    select: { id: true, productId: true, locale: true, country: true }
  });
}

export async function upsertEvidencePack(input: EvidencePackMutationInput) {
  const data = evidencePackMutationData(input);

  if (input.id) {
    return prisma.evidencePack.update({
      where: { id: input.id },
      data,
      select: { id: true, productId: true, locale: true }
    });
  }

  return prisma.evidencePack.create({
    data,
    select: { id: true, productId: true, locale: true }
  });
}

export async function archiveAdminRecord(input: { entityType: AdminEntityType; entityId: string; actor?: string }) {
  const archivedAt = new Date();
  return prisma.$transaction(async (tx) => {
    const before = await findAdminRecord(tx, input.entityType, input.entityId);
    if (!before) {
      throw new Error(`${input.entityType} ${input.entityId} was not found.`);
    }

    const after = await updateArchivedAt(tx, input.entityType, input.entityId, archivedAt);
    if (shouldArchiveRelatedArticles(input.entityType)) {
      await tx.article.updateMany({
        where: { productId: input.entityId, archivedAt: null },
        data: relatedArticleArchiveData(archivedAt)
      });
    }

    await tx.auditLog.create({
      data: {
        entityType: input.entityType,
        entityId: input.entityId,
        action: "archive",
        actor: input.actor,
        summary: archiveSummary(input.entityType),
        beforeJson: toJson(before),
        afterJson: toJson(after)
      }
    });

    return after;
  });
}

export async function deleteAdminRecord(input: { entityType: AdminEntityType; entityId: string; actor?: string }) {
  return prisma.$transaction(async (tx) => {
    const before = await findAdminRecord(tx, input.entityType, input.entityId);
    if (!before) {
      throw new Error(`${input.entityType} ${input.entityId} was not found.`);
    }

    await deleteAdminRecordByType(tx, input.entityType, input.entityId);
    await tx.auditLog.create({
      data: {
        entityType: input.entityType,
        entityId: input.entityId,
        action: "delete",
        actor: input.actor,
        summary: deleteSummary(input.entityType),
        beforeJson: toJson(before)
      }
    });

    return { id: input.entityId };
  });
}

export async function recordAuditLog(input: {
  entityType: AdminEntityType;
  entityId: string;
  action: string;
  actor?: string;
  summary?: string;
  beforeJson?: unknown;
  afterJson?: unknown;
}) {
  return prisma.auditLog.create({
    data: {
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      actor: input.actor,
      summary: input.summary,
      beforeJson: input.beforeJson === undefined ? undefined : toJson(input.beforeJson),
      afterJson: input.afterJson === undefined ? undefined : toJson(input.afterJson)
    }
  });
}

export async function getAuditLogs(limit = 50) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit
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

  const candidate = {
    ...article,
    indexStatus: input.indexStatus ?? article.indexStatus,
    publishStatus: input.publishStatus ?? article.publishStatus,
    qualityScore: input.qualityScore ?? article.qualityScore
  };

  const needsStrictGate = candidate.indexStatus === "index";
  if (!needsStrictGate) {
    return { ok: true };
  }

  const [products, evidencePacks] = await Promise.all([getDbProducts(), getDbEvidencePacks()]);
  const product = candidate.productId ? products.find((item) => item.id === candidate.productId) : undefined;
  const evidencePack = evidencePacks.find(
    (pack) => pack.productId === candidate.productId && pack.locale === candidate.locale
  );
  const result = runQualityGate({ article: candidate, product, evidencePack });
  const blockers = collectArticleStateGateBlockers(candidate, result);
  if (blockers.length === 0) {
    return { ok: true };
  }

  return {
    ok: false,
    before: article,
    issues: blockers,
    gateStatus: result.indexStatus,
    gateScore: result.score
  };
}
