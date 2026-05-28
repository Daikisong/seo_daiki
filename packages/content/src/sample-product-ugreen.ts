import type { Product } from "@global-import-lab/types";
import type { SampleProductContext } from "./sample-product-context";

export function buildUgreenProduct({ updatedAt }: SampleProductContext): Product {
  return {
    id: "prod-ugreen-100w",
    canonicalName: "Ugreen-style 100W GaN Charger",
    slug: "ugreen-100w-gan-charger",
    category: "usb-c-chargers",
    brandClaim: "Ugreen",
    identityConfidence: 0.81,
    imageHash: "pHash:ugreen100w:4ab192",
    variants: [
      {
        id: "var-ugreen-100w-us",
        productId: "prod-ugreen-100w",
        sourceSku: "UG100-US",
        optionName: "100W US plug",
        wattageClaim: 100,
        plugType: "US",
        cableIncluded: false,
        sourceUrl: "https://example.com/source/ugreen-100w",
        affiliateUrl: "https://example.com/go/ugreen-100w",
        sellerName: "Ugreen Flagship Store",
        sellerId: "seller-ugreen",
        riskFlags: ["Higher sustained output needs better cable selection"]
      }
    ],
    sellerClaims: [
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
    ],
    verifiedClaims: [
      {
        id: "vc-ugreen-output",
        productId: "prod-ugreen-100w",
        testType: "sustained_output",
        resultValue: "92",
        unit: "W for 20 minutes",
        method: "USB-C PD load test with e-marker cable",
        evidenceUrl: "/en/data/65w-gan-charger-output-table/",
        confidence: 0.78,
        testedAt: updatedAt
      }
    ],
    reviewSignals: [
      {
        id: "rs-ugreen-heat-en",
        productId: "prod-ugreen-100w",
        locale: "en",
        topic: "heat under laptop load",
        sentiment: "neutral",
        count: 14,
        confidence: 0.66,
        window: "90d"
      }
    ],
    priceSnapshots: [
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
    ],
    marketRisks: [
      {
        id: "risk-ugreen-us",
        productId: "prod-ugreen-100w",
        locale: "en",
        country: "US",
        plugRisk: "low",
        customsRisk: "low",
        certificationRisk: "medium",
        returnRisk: "medium",
        localAlternativeNote: "A local retailer is safer if you need easy warranty handling.",
        score: 0.47
      },
      {
        id: "risk-ugreen-es",
        productId: "prod-ugreen-100w",
        locale: "es",
        country: "ES",
        plugRisk: "medium",
        customsRisk: "medium",
        certificationRisk: "medium",
        returnRisk: "medium",
        localAlternativeNote: "Compare with a local EU seller when warranty handling matters.",
        score: 0.53
      },
      {
        id: "risk-ugreen-br",
        productId: "prod-ugreen-100w",
        locale: "pt-br",
        country: "BR",
        plugRisk: "medium",
        customsRisk: "high",
        certificationRisk: "medium",
        returnRisk: "high",
        localAlternativeNote: "Compare with Mercado Livre before importing a higher-price 100W charger.",
        score: 0.72
      }
    ]
  };
}
