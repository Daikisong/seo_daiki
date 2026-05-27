import { affiliateMerchantRow, affiliateOfferRow, affiliatePlacementRow } from "./admin-affiliate-row-model";

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
