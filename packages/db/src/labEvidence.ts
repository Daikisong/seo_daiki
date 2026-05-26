import { prisma } from "./client";

export interface LabEvidenceAssetInput {
  productId?: string;
  verifiedClaimId?: string;
  measurementType: string;
  fileName: string;
  storageKey: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  notes?: string;
}

export async function createLabEvidenceAsset(input: LabEvidenceAssetInput) {
  return prisma.labEvidenceAsset.create({
    data: {
      productId: input.productId,
      verifiedClaimId: input.verifiedClaimId,
      measurementType: input.measurementType,
      fileName: input.fileName,
      storageKey: input.storageKey,
      publicUrl: input.publicUrl,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      checksumSha256: input.checksumSha256,
      notes: input.notes
    }
  });
}

export async function listLabEvidenceAssets() {
  return prisma.labEvidenceAsset.findMany({
    orderBy: { uploadedAt: "desc" },
    take: 50
  });
}

