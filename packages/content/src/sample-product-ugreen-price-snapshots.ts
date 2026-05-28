import type { PriceSnapshot } from "@global-import-lab/types";

export function buildUgreenPriceSnapshots(updatedAt: string): PriceSnapshot[] {
  return [
    {
      id: "ps-ugreen-us",
      productId: "prod-ugreen-100w",
      variantId: "var-ugreen-100w-us",
      country: "US",
      currency: "USD",
      price: 34.9,
      shipping: 2.2,
      finalPrice: 37.1,
      capturedAt: updatedAt
    }
  ];
}
