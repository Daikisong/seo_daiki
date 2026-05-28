import type { SellerClaim } from "@global-import-lab/types";

export function buildUgreenSellerClaims(updatedAt: string): SellerClaim[] {
  return [
    {
      id: "sc-ugreen-100w-title",
      productId: "prod-ugreen-100w",
      claimType: "max_output",
      claimValue: "100W",
      rawText: "100W GaN fast charger",
      sourceUrl: "https://example.com/source/ugreen-100w",
      capturedAt: updatedAt,
      confidence: 0.72
    },
    {
      id: "sc-ugreen-ports",
      productId: "prod-ugreen-100w",
      claimType: "ports",
      claimValue: "3C1A",
      rawText: "Three USB-C ports and one USB-A port",
      sourceUrl: "https://example.com/source/ugreen-100w",
      capturedAt: updatedAt,
      confidence: 0.76
    }
  ];
}
