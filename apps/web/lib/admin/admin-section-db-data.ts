import { affiliateMerchantRow, affiliateOfferRow, affiliatePlacementRow } from "./admin-affiliate-row-model";
import {
  mapAuditLogRow,
  mapLabEvidenceAssetRow
} from "./admin-section-db-mappers";
import { normalizePersistedRefreshSuggestion } from "./admin-section-normalizers";

export async function readPersistedRefreshSuggestions() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listRefreshSuggestions } = await import("@global-import-lab/db/search-console");
    const rows = await listRefreshSuggestions({ limit: 100 });
    return rows.map((row) => ({
      ...normalizePersistedRefreshSuggestion(row)
    }));
  } catch (error) {
    console.warn("Persisted refresh suggestions unavailable.", error);
    return [];
  }
}

export async function readAuditLogs() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { getAuditLogs } = await import("@global-import-lab/db/admin-mutations");
    const logs = await getAuditLogs(50);
    return logs.map(mapAuditLogRow);
  } catch (error) {
    console.warn("Audit logs unavailable.", error);
    return [];
  }
}

export async function readAffiliateMerchants() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listAffiliateMerchants } = await import("@global-import-lab/db/affiliate-clicks");
    const rows = await listAffiliateMerchants();
    return rows.map(affiliateMerchantRow);
  } catch (error) {
    console.warn("Affiliate merchants unavailable.", error);
    return [];
  }
}

export async function readAffiliateOffers() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listAffiliateOffers } = await import("@global-import-lab/db/affiliate-clicks");
    const rows = await listAffiliateOffers();
    return rows.map(affiliateOfferRow);
  } catch (error) {
    console.warn("Affiliate offers unavailable.", error);
    return [];
  }
}

export async function readAffiliatePlacements() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listAffiliatePlacements } = await import("@global-import-lab/db/affiliate-clicks");
    const rows = await listAffiliatePlacements();
    return rows.map(affiliatePlacementRow);
  } catch (error) {
    console.warn("Affiliate placements unavailable.", error);
    return [];
  }
}

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
