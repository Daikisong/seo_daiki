import type { PriceSnapshot } from "@global-import-lab/types";

export function buildBaseusPriceSnapshots(updatedAt: string): PriceSnapshot[] {
  return [
    {
      id: "ps-baseus-us",
      productId: "prod-baseus-65w",
      variantId: "var-baseus-65w-us",
      country: "US",
      currency: "USD",
      price: 19.8,
      shipping: 1.6,
      coupon: 0,
      finalPrice: 21.4,
      capturedAt: updatedAt
    },
    {
      id: "ps-baseus-gb",
      productId: "prod-baseus-65w",
      variantId: "var-baseus-65w-eu-cable",
      country: "GB",
      currency: "GBP",
      price: 18.9,
      shipping: 2.4,
      coupon: 0,
      finalPrice: 21.3,
      capturedAt: updatedAt
    },
    {
      id: "ps-baseus-es",
      productId: "prod-baseus-65w",
      variantId: "var-baseus-65w-eu-cable",
      country: "ES",
      currency: "EUR",
      price: 21.2,
      shipping: 1.9,
      coupon: 0,
      finalPrice: 23.1,
      capturedAt: updatedAt
    },
    {
      id: "ps-baseus-br",
      productId: "prod-baseus-65w",
      variantId: "var-baseus-65w-us",
      country: "BR",
      currency: "USD",
      price: 20.1,
      shipping: 4.3,
      coupon: 0,
      finalPrice: 24.4,
      capturedAt: updatedAt
    }
  ];
}
