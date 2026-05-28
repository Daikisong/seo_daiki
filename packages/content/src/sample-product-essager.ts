import type { Product } from "@global-import-lab/types";
import type { SampleProductContext } from "./sample-product-context";

export function buildEssagerCableProduct({ updatedAt }: SampleProductContext): Product {
  return {
    id: "prod-essager-cable-100w",
    canonicalName: "Essager-style 100W USB-C Cable",
    slug: "essager-100w-usb-c-cable",
    category: "usb-c-cables",
    brandClaim: "Essager",
    identityConfidence: 0.77,
    imageHash: "pHash:essager100w:c94d31",
    variants: [
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
    ],
    sellerClaims: [
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
    ],
    verifiedClaims: [
      {
        id: "vc-essager-emarker",
        productId: "prod-essager-cable-100w",
        testType: "e_marker",
        resultValue: "Detected",
        method: "USB-C tester e-marker readout",
        evidenceUrl: "/en/data/usb-c-cable-100w-verification-table/",
        confidence: 0.75,
        testedAt: updatedAt
      }
    ],
    reviewSignals: [
      {
        id: "rs-essager-length-en",
        productId: "prod-essager-cable-100w",
        locale: "en",
        topic: "short cable length surprise",
        sentiment: "negative",
        count: 9,
        confidence: 0.64,
        window: "90d"
      }
    ],
    priceSnapshots: [
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
    ],
    marketRisks: [
      {
        id: "risk-essager-us",
        productId: "prod-essager-cable-100w",
        locale: "en",
        country: "US",
        plugRisk: "none",
        customsRisk: "low",
        certificationRisk: "low",
        returnRisk: "medium",
        localAlternativeNote: "Buy locally when cable authenticity matters more than price.",
        score: 0.36
      },
      {
        id: "risk-essager-es",
        productId: "prod-essager-cable-100w",
        locale: "es",
        country: "ES",
        plugRisk: "none",
        customsRisk: "medium",
        certificationRisk: "low",
        returnRisk: "medium",
        localAlternativeNote: "Check local cable pricing if shipping removes the import advantage.",
        score: 0.43
      },
      {
        id: "risk-essager-br",
        productId: "prod-essager-cable-100w",
        locale: "pt-br",
        country: "BR",
        plugRisk: "none",
        customsRisk: "high",
        certificationRisk: "low",
        returnRisk: "high",
        localAlternativeNote: "Prefer local sellers if tax or delay makes a low-price cable expensive.",
        score: 0.61
      }
    ]
  };
}
