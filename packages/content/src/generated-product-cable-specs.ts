import type { GeneratedProductSpec } from "./generated-product-fixture-types";

export const generatedCableProductSpecs: GeneratedProductSpec[] = [
  {
    id: "prod-essager-cable-240w",
    canonicalName: "Essager-style 240W USB-C Cable",
    slug: "essager-240w-usb-c-cable",
    category: "usb-c-cables",
    brandClaim: "Essager",
    claimType: "power_rating",
    claimValue: "240W",
    verifiedTestType: "e_marker",
    verifiedResult: "240W e-marker detected",
    optionName: "240W 1m e-marker cable",
    trapOptionName: "60W 2m cable option",
    wattageClaim: 240,
    trapWattageClaim: 60,
    sourceSlug: "essager-240w-cable",
    price: 7.8,
    shipping: 0,
    sellerName: "Essager Cable Store",
    riskTopic: "longer cable option may not be the 240W SKU"
  }
];
