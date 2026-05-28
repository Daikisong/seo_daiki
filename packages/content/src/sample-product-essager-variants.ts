import type { Variant } from "@global-import-lab/types";

export const essagerCableVariants: Variant[] = [
  {
    id: "var-essager-100w-1m",
    productId: "prod-essager-cable-100w",
    sourceSku: "ES-100W-1M",
    optionName: "100W 1m cable",
    wattageClaim: 100,
    cableIncluded: true,
    sourceUrl: "https://example.com/source/essager-100w-cable",
    affiliateUrl: "https://example.com/go/essager-100w-cable",
    sellerName: "Essager Cable Store",
    sellerId: "seller-essager",
    riskFlags: ["100W claim depends on e-marker verification"]
  }
];
