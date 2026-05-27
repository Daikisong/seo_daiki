import type { Prisma } from "./generated/prisma/client";
import {
  archiveMutationData,
  type AdminEntityType
} from "./adminMutationRules";

export type AdminMutationTransaction = Prisma.TransactionClient;

export async function findAdminRecord(tx: AdminMutationTransaction, entityType: AdminEntityType, entityId: string) {
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

export async function updateArchivedAt(
  tx: AdminMutationTransaction,
  entityType: AdminEntityType,
  entityId: string,
  archivedAt: Date
) {
  const data = archiveMutationData(entityType, archivedAt);
  if (entityType === "product") {
    return tx.product.update({ where: { id: entityId }, data });
  }
  if (entityType === "variant") {
    return tx.variant.update({ where: { id: entityId }, data });
  }
  if (entityType === "seller-claim") {
    return tx.sellerClaim.update({ where: { id: entityId }, data });
  }
  if (entityType === "verified-claim") {
    return tx.verifiedClaim.update({ where: { id: entityId }, data });
  }
  if (entityType === "market-risk") {
    return tx.marketRisk.update({ where: { id: entityId }, data });
  }
  if (entityType === "evidence-pack") {
    return tx.evidencePack.update({ where: { id: entityId }, data });
  }
  return tx.article.update({ where: { id: entityId }, data });
}

export async function deleteAdminRecordByType(tx: AdminMutationTransaction, entityType: AdminEntityType, entityId: string) {
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
