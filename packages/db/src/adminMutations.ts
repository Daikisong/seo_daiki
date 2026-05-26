import { prisma } from "./client";
import type { Prisma } from "./generated/prisma/client";

export const indexStatuses = ["index", "noindex", "pending", "refresh_needed", "merge_candidate"] as const;
export const publishStatuses = ["draft", "pending", "published"] as const;
export const adminEntityTypes = [
  "product",
  "variant",
  "seller-claim",
  "verified-claim",
  "market-risk",
  "evidence-pack",
  "article"
] as const;
export const adminRecordActions = ["archive", "delete"] as const;

export type IndexStatusInput = (typeof indexStatuses)[number];
export type PublishStatusInput = (typeof publishStatuses)[number];
export type AdminEntityType = (typeof adminEntityTypes)[number];
export type AdminRecordAction = (typeof adminRecordActions)[number];

export async function updateArticleState(input: {
  id: string;
  indexStatus?: IndexStatusInput;
  publishStatus?: PublishStatusInput;
  qualityScore?: number;
}) {
  return prisma.article.update({
    where: { id: input.id },
    data: {
      indexStatus: input.indexStatus,
      publishStatus: input.publishStatus,
      qualityScore: input.qualityScore
    },
    select: { id: true, indexStatus: true, publishStatus: true, qualityScore: true }
  });
}

export async function upsertProduct(input: {
  id?: string;
  canonicalName: string;
  slug: string;
  category: string;
  brandClaim?: string;
  identityConfidence?: number;
  imageHash?: string;
}) {
  const data = {
    canonicalName: input.canonicalName,
    slug: input.slug,
    category: input.category,
    brandClaim: input.brandClaim,
    identityConfidence: input.identityConfidence ?? 0.7,
    imageHash: input.imageHash
  };

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

export async function upsertVariant(input: {
  id?: string;
  productId: string;
  optionName: string;
  sourceUrl: string;
  sourceSku?: string;
  wattageClaim?: number;
  plugType?: string;
  cableIncluded?: boolean;
  affiliateUrl?: string;
  sellerName?: string;
  sellerId?: string;
  riskFlags?: string[];
}) {
  const data = {
    productId: input.productId,
    optionName: input.optionName,
    sourceUrl: input.sourceUrl,
    sourceSku: input.sourceSku,
    wattageClaim: input.wattageClaim,
    plugType: input.plugType,
    cableIncluded: input.cableIncluded,
    affiliateUrl: input.affiliateUrl,
    sellerName: input.sellerName,
    sellerId: input.sellerId,
    riskFlags: toJson(input.riskFlags ?? [])
  };

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

export async function upsertSellerClaim(input: {
  id?: string;
  productId: string;
  claimType: string;
  claimValue: string;
  rawText?: string;
  sourceUrl?: string;
  confidence?: number;
}) {
  const data = {
    productId: input.productId,
    claimType: input.claimType,
    claimValue: input.claimValue,
    rawText: input.rawText,
    sourceUrl: input.sourceUrl,
    confidence: input.confidence ?? 0.5
  };

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

export async function upsertVerifiedClaim(input: {
  id?: string;
  productId: string;
  testType: string;
  resultValue: string;
  unit?: string;
  method: string;
  evidenceUrl?: string;
  confidence?: number;
  testedAt?: Date;
}) {
  const data = {
    productId: input.productId,
    testType: input.testType,
    resultValue: input.resultValue,
    unit: input.unit,
    method: input.method,
    evidenceUrl: input.evidenceUrl,
    confidence: input.confidence ?? 0.8,
    testedAt: input.testedAt
  };

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

export async function upsertMarketRisk(input: {
  id?: string;
  productId: string;
  locale: string;
  country?: string;
  plugRisk?: string;
  customsRisk?: string;
  certificationRisk?: string;
  returnRisk?: string;
  localAlternativeNote?: string;
  score?: number;
}) {
  const data = {
    productId: input.productId,
    locale: input.locale,
    country: input.country,
    plugRisk: input.plugRisk,
    customsRisk: input.customsRisk,
    certificationRisk: input.certificationRisk,
    returnRisk: input.returnRisk,
    localAlternativeNote: input.localAlternativeNote,
    score: input.score ?? 0.5
  };

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

export async function upsertEvidencePack(input: {
  id?: string;
  productId?: string;
  locale: string;
  packJson: unknown;
}) {
  const data = {
    productId: input.productId,
    locale: input.locale,
    packJson: toJson(input.packJson)
  };

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
    if (input.entityType === "product") {
      await tx.article.updateMany({
        where: { productId: input.entityId, archivedAt: null },
        data: { archivedAt, indexStatus: "noindex", publishStatus: "draft" }
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

    await deleteRecord(tx, input.entityType, input.entityId);
    await tx.auditLog.create({
      data: {
        entityType: input.entityType,
        entityId: input.entityId,
        action: "delete",
        actor: input.actor,
        summary: `Deleted ${input.entityType}.`,
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
  afterJson?: unknown;
}) {
  return prisma.auditLog.create({
    data: {
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      actor: input.actor,
      summary: input.summary,
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

export function isIndexStatus(value: string): value is IndexStatusInput {
  return indexStatuses.includes(value as IndexStatusInput);
}

export function isPublishStatus(value: string): value is PublishStatusInput {
  return publishStatuses.includes(value as PublishStatusInput);
}

export function isAdminEntityType(value: string): value is AdminEntityType {
  return adminEntityTypes.includes(value as AdminEntityType);
}

export function isAdminRecordAction(value: string): value is AdminRecordAction {
  return adminRecordActions.includes(value as AdminRecordAction);
}

type AdminMutationTransaction = Prisma.TransactionClient;

async function findAdminRecord(tx: AdminMutationTransaction, entityType: AdminEntityType, entityId: string) {
  if (entityType === "product") {
    return tx.product.findUnique({ where: { id: entityId } });
  }
  if (entityType === "variant") {
    return tx.variant.findUnique({ where: { id: entityId } });
  }
  if (entityType === "seller-claim") {
    return tx.sellerClaim.findUnique({ where: { id: entityId } });
  }
  if (entityType === "verified-claim") {
    return tx.verifiedClaim.findUnique({ where: { id: entityId } });
  }
  if (entityType === "market-risk") {
    return tx.marketRisk.findUnique({ where: { id: entityId } });
  }
  if (entityType === "evidence-pack") {
    return tx.evidencePack.findUnique({ where: { id: entityId } });
  }
  return tx.article.findUnique({ where: { id: entityId } });
}

async function updateArchivedAt(
  tx: AdminMutationTransaction,
  entityType: AdminEntityType,
  entityId: string,
  archivedAt: Date
) {
  if (entityType === "product") {
    return tx.product.update({ where: { id: entityId }, data: { archivedAt } });
  }
  if (entityType === "variant") {
    return tx.variant.update({ where: { id: entityId }, data: { archivedAt } });
  }
  if (entityType === "seller-claim") {
    return tx.sellerClaim.update({ where: { id: entityId }, data: { archivedAt } });
  }
  if (entityType === "verified-claim") {
    return tx.verifiedClaim.update({ where: { id: entityId }, data: { archivedAt } });
  }
  if (entityType === "market-risk") {
    return tx.marketRisk.update({ where: { id: entityId }, data: { archivedAt } });
  }
  if (entityType === "evidence-pack") {
    return tx.evidencePack.update({ where: { id: entityId }, data: { archivedAt } });
  }
  return tx.article.update({
    where: { id: entityId },
    data: { archivedAt, indexStatus: "noindex", publishStatus: "draft" }
  });
}

async function deleteRecord(tx: AdminMutationTransaction, entityType: AdminEntityType, entityId: string) {
  if (entityType === "product") {
    await tx.product.delete({ where: { id: entityId } });
  } else if (entityType === "variant") {
    await tx.variant.delete({ where: { id: entityId } });
  } else if (entityType === "seller-claim") {
    await tx.sellerClaim.delete({ where: { id: entityId } });
  } else if (entityType === "verified-claim") {
    await tx.verifiedClaim.delete({ where: { id: entityId } });
  } else if (entityType === "market-risk") {
    await tx.marketRisk.delete({ where: { id: entityId } });
  } else if (entityType === "evidence-pack") {
    await tx.evidencePack.delete({ where: { id: entityId } });
  } else {
    await tx.article.delete({ where: { id: entityId } });
  }
}

function archiveSummary(entityType: AdminEntityType) {
  if (entityType === "product") {
    return "Archived product and marked related articles noindex/draft.";
  }
  if (entityType === "article") {
    return "Archived article and marked it noindex/draft.";
  }
  return `Archived ${entityType}.`;
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
