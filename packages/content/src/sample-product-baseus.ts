import type { Product } from "@global-import-lab/types";
import type { SampleProductContext } from "./sample-product-context";

export function buildBaseusProduct({ updatedAt }: SampleProductContext): Product {
  return {
    id: "prod-baseus-65w",
    canonicalName: "Baseus-style 65W GaN Charger",
    slug: "baseus-65w-gan-charger",
    category: "usb-c-chargers",
    brandClaim: "Baseus",
    identityConfidence: 0.86,
    imageHash: "pHash:baseus65w:8fe421",
    variants: [
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
    ],
    sellerClaims: [
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
    ],
    verifiedClaims: [
      {
        id: "vc-baseus-output",
        productId: "prod-baseus-65w",
        testType: "sustained_output",
        resultValue: "60",
        unit: "W for 20 minutes",
        method: "USB-C PD load test with thermal observation",
        evidenceUrl: "/en/lab/65w-gan-charger-real-output-test/",
        confidence: 0.84,
        testedAt: updatedAt
      },
      {
        id: "vc-baseus-temp",
        productId: "prod-baseus-65w",
        testType: "case_temperature",
        resultValue: "61",
        unit: "C",
        method: "Surface probe after 20 minute 60W load",
        evidenceUrl: "/en/lab/65w-gan-charger-real-output-test/",
        confidence: 0.8,
        testedAt: updatedAt
      },
      {
        id: "vc-baseus-pps-observed",
        productId: "prod-baseus-65w",
        testType: "pd_profile",
        resultValue: "PPS observed",
        method: "USB-C tester profile capture",
        evidenceUrl: "/en/data/65w-gan-charger-output-table/",
        confidence: 0.79,
        testedAt: updatedAt
      }
    ],
    reviewSignals: [
      {
        id: "rs-baseus-wrong-plug-en",
        productId: "prod-baseus-65w",
        locale: "en",
        topic: "wrong plug option",
        sentiment: "negative",
        count: 17,
        confidence: 0.72,
        window: "90d"
      },
      {
        id: "rs-baseus-laptop-en",
        productId: "prod-baseus-65w",
        locale: "en",
        topic: "laptop charging inconsistent on cheapest option",
        sentiment: "negative",
        count: 11,
        confidence: 0.68,
        window: "90d"
      },
      {
        id: "rs-baseus-compact-es",
        productId: "prod-baseus-65w",
        locale: "es",
        topic: "compact travel size",
        sentiment: "positive",
        count: 24,
        confidence: 0.76,
        window: "90d"
      },
      {
        id: "rs-baseus-customs-pt",
        productId: "prod-baseus-65w",
        locale: "pt-br",
        topic: "tax and delivery delay concern",
        sentiment: "negative",
        count: 19,
        confidence: 0.7,
        window: "90d"
      }
    ],
    priceSnapshots: [
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
    ],
    marketRisks: [
      {
        id: "risk-baseus-us",
        productId: "prod-baseus-65w",
        locale: "en",
        country: "US",
        plugRisk: "low",
        customsRisk: "low",
        certificationRisk: "medium",
        returnRisk: "medium",
        localAlternativeNote: "Compare with an Amazon-listed charger if office certification matters.",
        score: 0.42
      },
      {
        id: "risk-baseus-gb",
        productId: "prod-baseus-65w",
        locale: "en",
        country: "GB",
        plugRisk: "medium",
        customsRisk: "medium",
        certificationRisk: "medium",
        returnRisk: "medium",
        localAlternativeNote: "Use the UK plug path only when the final price beats a local UK retailer with easier returns.",
        score: 0.5
      },
      {
        id: "risk-baseus-es",
        productId: "prod-baseus-65w",
        locale: "es",
        country: "ES",
        plugRisk: "medium",
        customsRisk: "medium",
        certificationRisk: "medium",
        returnRisk: "medium",
        localAlternativeNote: "Use the EU plug SKU and check final VAT-inclusive price.",
        score: 0.51
      },
      {
        id: "risk-baseus-br",
        productId: "prod-baseus-65w",
        locale: "pt-br",
        country: "BR",
        plugRisk: "medium",
        customsRisk: "high",
        certificationRisk: "medium",
        returnRisk: "high",
        localAlternativeNote: "Compare with Mercado Livre if the final price rises above the buy zone.",
        score: 0.69
      }
    ]
  };
}
