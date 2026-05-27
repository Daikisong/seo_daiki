import { mapLabEvidenceAssetRow } from "./admin-section-db-mappers";

export async function readLabEvidenceAssets() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listLabEvidenceAssets } = await import("@global-import-lab/db/lab-evidence");
    const assets = await listLabEvidenceAssets();
    return assets.map(mapLabEvidenceAssetRow);
  } catch (error) {
    console.warn("Lab evidence assets unavailable.", error);
    return [];
  }
}
