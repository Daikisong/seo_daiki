import type { AuditLogRow, LabEvidenceAssetRow } from "./admin-section-db-row-types";

export function mapAuditLogRow(log: AuditLogRow) {
  return {
    id: log.id,
    entityType: log.entityType,
    entityId: log.entityId,
    action: log.action,
    actor: log.actor,
    summary: log.summary,
    createdAt: log.createdAt.toISOString()
  };
}

export function mapLabEvidenceAssetRow(asset: LabEvidenceAssetRow) {
  return {
    id: asset.id,
    productId: asset.productId,
    verifiedClaimId: asset.verifiedClaimId,
    measurementType: asset.measurementType,
    fileName: asset.fileName,
    publicUrl: asset.publicUrl,
    sizeBytes: asset.sizeBytes,
    uploadedAt: asset.uploadedAt.toISOString()
  };
}
