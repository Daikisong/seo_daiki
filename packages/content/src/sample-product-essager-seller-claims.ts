import type { SellerClaim } from "@global-import-lab/types";

export function buildEssagerCableSellerClaims(updatedAt: string): SellerClaim[] {
  return [
    {
      id: "sc-essager-100w",
      productId: "prod-essager-cable-100w",
      claimType: "power_rating",
      claimValue: "100W",
      rawText: "100W PD fast charging cable",
      sourceUrl: "https://example.com/source/essager-100w-cable",
      capturedAt: updatedAt,
      confidence: 0.7
    },
    {
      id: "sc-essager-emarker",
      productId: "prod-essager-cable-100w",
      claimType: "e_marker",
      claimValue: "E-marker claimed",
      rawText: "E-marker chip for 100W PD",
      sourceUrl: "https://example.com/source/essager-100w-cable",
      capturedAt: updatedAt,
      confidence: 0.64
    },
    {
      id: "sc-essager-length",
      productId: "prod-essager-cable-100w",
      claimType: "length_option",
      claimValue: "1m and 2m variants differ",
      rawText: "Choose cable length before checkout",
      sourceUrl: "https://example.com/source/essager-100w-cable",
      capturedAt: updatedAt,
      confidence: 0.66
    }
  ];
}
