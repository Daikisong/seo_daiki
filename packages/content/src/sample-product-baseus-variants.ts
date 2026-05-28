import type { Variant } from "@global-import-lab/types";

export const baseusVariants: Variant[] = [
  {
    id: "var-baseus-65w-us",
    productId: "prod-baseus-65w",
    sourceSku: "B65-US-NC",
    optionName: "65W US plug, no cable",
    wattageClaim: 65,
    plugType: "US",
    cableIncluded: false,
    sourceUrl: "https://example.com/source/baseus-65w",
    affiliateUrl: "https://example.com/go/baseus-65w-us",
    sellerName: "Baseus Global Store",
    sellerId: "seller-baseus-global",
    riskFlags: ["No cable included in the default 65W option"]
  },
  {
    id: "var-baseus-65w-eu-cable",
    productId: "prod-baseus-65w",
    sourceSku: "B65-EU-C",
    optionName: "65W EU plug with cable",
    wattageClaim: 65,
    plugType: "EU",
    cableIncluded: true,
    sourceUrl: "https://example.com/source/baseus-65w",
    affiliateUrl: "https://example.com/go/baseus-65w-eu",
    sellerName: "Baseus Global Store",
    sellerId: "seller-baseus-global",
    riskFlags: ["EU plug photo matches the selected SKU"]
  },
  {
    id: "var-baseus-45w-trap",
    productId: "prod-baseus-65w",
    sourceSku: "B45-US-CHEAP",
    optionName: "45W cheapest option",
    wattageClaim: 45,
    plugType: "US",
    cableIncluded: false,
    sourceUrl: "https://example.com/source/baseus-65w",
    affiliateUrl: "https://example.com/go/baseus-45w",
    sellerName: "Baseus Global Store",
    sellerId: "seller-baseus-global",
    riskFlags: ["Title says 65W, but this option is a 45W SKU", "Laptop charging claims do not apply"]
  }
];
