import type { SellerClaim } from "@global-import-lab/types";

export function buildBaseusSellerClaims(updatedAt: string): SellerClaim[] {
  return [
    {
      id: "sc-baseus-65w-title",
      productId: "prod-baseus-65w",
      claimType: "max_output",
      claimValue: "65W",
      rawText: "65W GaN fast charger",
      sourceUrl: "https://example.com/source/baseus-65w",
      capturedAt: updatedAt,
      confidence: 0.74
    },
    {
      id: "sc-baseus-pps",
      productId: "prod-baseus-65w",
      claimType: "charging_profile",
      claimValue: "PPS",
      rawText: "PD PPS fast charging",
      sourceUrl: "https://example.com/source/baseus-65w",
      capturedAt: updatedAt,
      confidence: 0.62
    },
    {
      id: "sc-baseus-cable",
      productId: "prod-baseus-65w",
      claimType: "bundle",
      claimValue: "Cable included on selected bundle only",
      rawText: "Cable bundle is a separate SKU",
      sourceUrl: "https://example.com/source/baseus-65w",
      capturedAt: updatedAt,
      confidence: 0.82
    }
  ];
}
