import type { Product } from "@global-import-lab/types";
import { generatedProductFixtures } from "./product-fixtures";

export function buildSampleProducts(updatedAt: string): Product[] {
  return [
    {
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
    },
    {
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
    },
    {
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
    },
    ...generatedProductFixtures(updatedAt)
  ];
}
