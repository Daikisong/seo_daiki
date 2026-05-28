import type { PriceSnapshot } from "@global-import-lab/types";

export function buildEssagerCablePriceSnapshots(updatedAt: string): PriceSnapshot[] {
  return [
    {
      id: "ps-essager-us",
      productId: "prod-essager-cable-100w",
      variantId: "var-essager-100w-1m",
      country: "US",
      currency: "USD",
      price: 5.9,
      shipping: 0,
      finalPrice: 5.9,
      capturedAt: updatedAt
    }
  ];
}
