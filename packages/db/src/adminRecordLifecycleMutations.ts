import { prisma } from "./client";
import { deleteAdminRecordByType, findAdminRecord, updateArchivedAt } from "./adminRecordMutations";
import {
  adminRecordArchiveAuditData,
  adminRecordAuditLogData,
  adminRecordDeleteAuditData
} from "./adminMutationAuditPayloads";
import {
  relatedArticleArchiveData,
  shouldArchiveRelatedArticles,
  type AdminEntityType
} from "./adminMutationRules";

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
      data: adminRecordArchiveAuditData({
        entityType: input.entityType,
        entityId: input.entityId,
        actor: input.actor,
        before,
        after
      })
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
      data: adminRecordDeleteAuditData({
        entityType: input.entityType,
        entityId: input.entityId,
        actor: input.actor,
        before
      })
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
    data: adminRecordAuditLogData(input)
  });
}

export async function getAuditLogs(limit = 50) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit
  });
}
