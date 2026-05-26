import { absoluteUrl, articlePath, hreflangKeyForArticle } from "@global-import-lab/seo";
import type {
  Article,
  ArticleSection,
  ArticleType,
  EvidencePack,
  HreflangMap,
  InternalLink,
  Locale,
  Product
} from "@global-import-lab/types";

const siteUrl = "https://example.com";
const updatedAt = "2026-05-25";

interface GeneratedProductSpec {
  id: string;
  canonicalName: string;
  slug: string;
  category: string;
  brandClaim: string;
  claimType: string;
  claimValue: string;
  verifiedTestType: string;
  verifiedResult: string;
  verifiedUnit?: string;
  optionName: string;
  trapOptionName: string;
  wattageClaim?: number;
  trapWattageClaim?: number;
  plugType?: string;
  sourceSlug: string;
  price: number;
  shipping: number;
  sellerName: string;
  riskTopic: string;
}

const generatedProductSpecs: GeneratedProductSpec[] = [
  {
    id: "prod-toocki-67w",
    canonicalName: "Toocki-style 67W GaN Charger",
    slug: "toocki-67w-gan-charger",
    category: "usb-c-chargers",
    brandClaim: "Toocki",
    claimType: "max_output",
    claimValue: "67W",
    verifiedTestType: "sustained_output",
    verifiedResult: "61",
    verifiedUnit: "W for 20 minutes",
    optionName: "67W US plug, no cable",
    trapOptionName: "33W cheapest option",
    wattageClaim: 67,
    trapWattageClaim: 33,
    plugType: "US",
    sourceSlug: "toocki-67w",
    price: 18.4,
    shipping: 2.1,
    sellerName: "Toocki Official Store",
    riskTopic: "headline wattage depends on selected 67W SKU"
  },
  {
    id: "prod-rocoren-140w",
    canonicalName: "Rocoren-style 140W GaN Charger",
    slug: "rocoren-140w-gan-charger",
    category: "usb-c-chargers",
    brandClaim: "Rocoren",
    claimType: "max_output",
    claimValue: "140W",
    verifiedTestType: "sustained_output",
    verifiedResult: "118",
    verifiedUnit: "W peak before thermal step-down",
    optionName: "140W US plug, no cable",
    trapOptionName: "100W EU plug option",
    wattageClaim: 140,
    trapWattageClaim: 100,
    plugType: "US",
    sourceSlug: "rocoren-140w",
    price: 42.6,
    shipping: 3.8,
    sellerName: "Rocoren Direct Store",
    riskTopic: "high output claim needs cable and thermal checks"
  },
  {
    id: "prod-kuulaa-30w",
    canonicalName: "Kuulaa-style 30W Mini Charger",
    slug: "kuulaa-30w-mini-charger",
    category: "usb-c-chargers",
    brandClaim: "Kuulaa",
    claimType: "max_output",
    claimValue: "30W",
    verifiedTestType: "sustained_output",
    verifiedResult: "27",
    verifiedUnit: "W for 20 minutes",
    optionName: "30W EU plug",
    trapOptionName: "20W compact option",
    wattageClaim: 30,
    trapWattageClaim: 20,
    plugType: "EU",
    sourceSlug: "kuulaa-30w",
    price: 8.7,
    shipping: 1.4,
    sellerName: "Kuulaa Charger Store",
    riskTopic: "small charger may not match laptop charging intent"
  },
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
  },
  {
    id: "prod-zmi-20000-power-bank",
    canonicalName: "ZMI-style 20000mAh 65W Power Bank",
    slug: "zmi-20000mah-65w-power-bank",
    category: "power-banks",
    brandClaim: "ZMI",
    claimType: "capacity",
    claimValue: "20000mAh",
    verifiedTestType: "usable_energy",
    verifiedResult: "63",
    verifiedUnit: "Wh observed",
    optionName: "20000mAh 65W USB-C power bank",
    trapOptionName: "10000mAh lower-capacity option",
    wattageClaim: 65,
    trapWattageClaim: 30,
    sourceSlug: "zmi-20000-power-bank",
    price: 46.5,
    shipping: 5.2,
    sellerName: "ZMI Power Store",
    riskTopic: "capacity claim must be interpreted as cell rating, not USB output energy"
  },
  {
    id: "prod-hoto-screwdriver",
    canonicalName: "HOTO-style Electric Screwdriver Kit",
    slug: "hoto-electric-screwdriver-kit",
    category: "electric-screwdrivers",
    brandClaim: "HOTO",
    claimType: "torque",
    claimValue: "4Nm",
    verifiedTestType: "torque_check",
    verifiedResult: "3.4",
    verifiedUnit: "Nm observed",
    optionName: "Screwdriver kit with battery and bits",
    trapOptionName: "Bits-only accessory option",
    sourceSlug: "hoto-screwdriver-kit",
    price: 22.3,
    shipping: 4.5,
    sellerName: "HOTO Tool Store",
    riskTopic: "accessory-only option can be mistaken for the full kit"
  },
  {
    id: "prod-tuya-zigbee-sensor",
    canonicalName: "Tuya-style Zigbee Door Sensor",
    slug: "tuya-zigbee-door-sensor",
    category: "smart-home-sensors",
    brandClaim: "Tuya",
    claimType: "protocol",
    claimValue: "Zigbee",
    verifiedTestType: "pairing_check",
    verifiedResult: "Zigbee2MQTT paired",
    optionName: "Zigbee door sensor",
    trapOptionName: "Wi-Fi sensor option",
    sourceSlug: "tuya-zigbee-sensor",
    price: 6.4,
    shipping: 1.2,
    sellerName: "Tuya Smart Store",
    riskTopic: "Wi-Fi and Zigbee options share one listing"
  }
];

function generatedSampleProduct(spec: GeneratedProductSpec): Product {
  const sourceUrl = `https://example.com/source/${spec.sourceSlug}`;
  const affiliateUrl = `https://example.com/go/${spec.sourceSlug}`;
  const primaryVariantId = `var-${spec.sourceSlug}-primary`;
  const trapVariantId = `var-${spec.sourceSlug}-trap`;
  const sellerId = `seller-${spec.sourceSlug}`;
  const isCable = spec.category.includes("cable");

  return {
    id: spec.id,
    canonicalName: spec.canonicalName,
    slug: spec.slug,
    category: spec.category,
    brandClaim: spec.brandClaim,
    identityConfidence: 0.74,
    imageHash: `pHash:${spec.sourceSlug}:generated`,
    variants: [
      {
        id: primaryVariantId,
        productId: spec.id,
        sourceSku: `${spec.sourceSlug.toUpperCase()}-MAIN`,
        optionName: spec.optionName,
        wattageClaim: spec.wattageClaim,
        plugType: spec.plugType,
        cableIncluded: isCable || !spec.optionName.toLowerCase().includes("no cable"),
        sourceUrl,
        affiliateUrl,
        sellerName: spec.sellerName,
        sellerId,
        riskFlags: [`Use this SKU when citing the ${spec.claimValue} claim.`]
      },
      {
        id: trapVariantId,
        productId: spec.id,
        sourceSku: `${spec.sourceSlug.toUpperCase()}-TRAP`,
        optionName: spec.trapOptionName,
        wattageClaim: spec.trapWattageClaim,
        plugType: spec.plugType,
        cableIncluded: false,
        sourceUrl,
        affiliateUrl,
        sellerName: spec.sellerName,
        sellerId,
        riskFlags: [`Listing headline can be misread; ${spec.trapOptionName} does not support the main claim.`]
      }
    ],
    sellerClaims: [
      {
        id: `sc-${spec.sourceSlug}-primary`,
        productId: spec.id,
        claimType: spec.claimType,
        claimValue: spec.claimValue,
        rawText: `${spec.canonicalName} ${spec.claimValue}`,
        sourceUrl,
        capturedAt: updatedAt,
        confidence: 0.68
      },
      {
        id: `sc-${spec.sourceSlug}-bundle`,
        productId: spec.id,
        claimType: "variant_scope",
        claimValue: spec.trapOptionName,
        rawText: `Options include ${spec.optionName} and ${spec.trapOptionName}`,
        sourceUrl,
        capturedAt: updatedAt,
        confidence: 0.7
      }
    ],
    verifiedClaims: [
      {
        id: `vc-${spec.sourceSlug}-primary`,
        productId: spec.id,
        testType: spec.verifiedTestType,
        resultValue: spec.verifiedResult,
        unit: spec.verifiedUnit,
        method: "Bench check recorded in the sample evidence ledger",
        evidenceUrl: "/en/data/65w-gan-charger-output-table/",
        confidence: 0.73,
        testedAt: updatedAt
      }
    ],
    reviewSignals: [
      {
        id: `rs-${spec.sourceSlug}-en`,
        productId: spec.id,
        locale: "en",
        topic: spec.riskTopic,
        sentiment: "negative",
        count: 7,
        confidence: 0.62,
        window: "90d"
      },
      {
        id: `rs-${spec.sourceSlug}-es`,
        productId: spec.id,
        locale: "es",
        topic: "confusion about selected variant",
        sentiment: "negative",
        count: 5,
        confidence: 0.58,
        window: "90d"
      },
      {
        id: `rs-${spec.sourceSlug}-pt`,
        productId: spec.id,
        locale: "pt-br",
        topic: "tax and return risk after import",
        sentiment: "negative",
        count: 6,
        confidence: 0.6,
        window: "90d"
      }
    ],
    priceSnapshots: [
      {
        id: `ps-${spec.sourceSlug}-us`,
        productId: spec.id,
        variantId: primaryVariantId,
        country: "US",
        currency: "USD",
        price: spec.price,
        shipping: spec.shipping,
        coupon: 0,
        finalPrice: Number((spec.price + spec.shipping).toFixed(2)),
        capturedAt: updatedAt
      }
    ],
    marketRisks: ["en", "es", "pt-br"].map((locale) => localeRisk(spec, locale as Locale))
  };
}

function localeRisk(spec: GeneratedProductSpec, locale: Locale) {
  const country = locale === "en" ? "US" : locale === "es" ? "ES" : "BR";
  const customsRisk = locale === "pt-br" ? "high" : locale === "es" ? "medium" : "low";
  return {
    id: `risk-${spec.sourceSlug}-${locale}`,
    productId: spec.id,
    locale,
    country,
    plugRisk: spec.plugType ? "medium" : "none",
    customsRisk,
    certificationRisk: "medium",
    returnRisk: locale === "pt-br" ? "high" : "medium",
    localAlternativeNote:
      locale === "pt-br"
        ? "Compare with Mercado Livre if tax or delayed returns remove the import discount."
        : "Compare with a local seller when warranty or certification matters.",
    score: locale === "pt-br" ? 0.7 : locale === "es" ? 0.52 : 0.44
  };
}

export const products: Product[] = [
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
  ...generatedProductSpecs.map(generatedSampleProduct)
];

export const evidencePacks: EvidencePack[] = products.flatMap((product) =>
  (["en", "es", "pt-br"] as Locale[]).map((locale) => ({
    id: `ep-${product.slug}-${locale}`,
    productId: product.id,
    locale,
    packJson: {
      product: {
        id: product.id,
        canonicalName: product.canonicalName,
        slug: product.slug,
        category: product.category
      },
      variants: product.variants,
      sellerClaims: product.sellerClaims,
      verifiedClaims: product.verifiedClaims,
      reviewSignals: product.reviewSignals.filter((signal) => signal.locale === locale || signal.locale === "en"),
      priceSnapshots: product.priceSnapshots,
      marketRisks: product.marketRisks.filter((risk) => risk.locale === locale || risk.locale === "en"),
      allowedClaims: [
        "Seller claims must be labeled as seller claims until verified.",
        "Use sustained-output values only when a VerifiedClaim exists.",
        "Variant, plug, cable, customs, and return risks can be described from evidence."
      ],
      forbiddenClaims: [
        "Do not say safety certification is verified unless a certification evidence record exists.",
        "Do not copy review text.",
        "Do not say every SKU supports the headline wattage."
      ]
    },
    createdAt: updatedAt
  }))
);

function internalLinks(locale: Locale): InternalLink[] {
  const prefix = `/${locale}`;
  const hubSlug = locale === "en" ? "usb-c-chargers" : locale === "es" ? "cargadores-usb-c" : "carregadores-usb-c";
  return [
    { label: "USB-C charger hub", href: `${prefix}/${hubSlug}/`, reason: "category_hub" },
    {
      label: "How we test USB-C chargers",
      href: `${prefix}/methodology/how-we-test-usb-c-chargers/`,
      reason: "methodology"
    },
    {
      label: "65W charger output table",
      href: `${prefix}/data/65w-gan-charger-output-table/`,
      reason: "data"
    },
    {
      label: "65W vs 100W charger comparison",
      href: `${prefix}/compare/65w-vs-100w-gan-charger/`,
      reason: "compare"
    },
    {
      label: "Fake watts buying guide",
      href: `${prefix}/guides/aliexpress-charger-fake-watts/`,
      reason: "guide"
    },
    {
      label: "Wrong plug option guide",
      href: `${prefix}/guides/aliexpress-charger-wrong-plug-option/`,
      reason: "guide"
    }
  ];
}

function sections(headings: string[], evidenceIds: string[]): ArticleSection[] {
  return headings.map((heading, index) => ({
    heading,
    body:
      index % 2 === 0
        ? "This section separates seller claims from verified evidence, then explains the variant, plug, price, and return-risk implications before a buyer clicks an affiliate link."
        : "The decision rule is intentionally conservative: buy only when the selected SKU matches the tested claim, the final shipped price stays in the buy zone, and the local risk matrix is acceptable.",
    evidenceIds: evidenceIds.slice(index, index + 2)
  }));
}

type ArticleDraft = Omit<Article, "canonicalUrl" | "hreflangMap"> & { group: string };
type UrlPlanRow = {
  locale: Locale;
  type: ArticleType;
  count: number;
  indexTarget: number;
  cluster: string;
};

function englishCategoryHubDraft({
  id,
  slug,
  title,
  summary,
  evidenceIds,
  indexStatus = "index",
  qualityScore = 84
}: {
  id: string;
  slug: string;
  title: string;
  summary: string;
  evidenceIds: string[];
  indexStatus?: Article["indexStatus"];
  qualityScore?: number;
}): ArticleDraft {
  return {
    group: `hub-${slug}`,
    id,
    locale: "en",
    slug,
    type: "hub",
    title,
    h1: title,
    metaDescription: `${title} with seller claims, verified evidence, variant traps, price truth, and import risk notes.`,
    summary,
    contentMdx: "category hub product evidence variant price verified market risk methodology data lab guide compare",
    sections: sections(
      ["What this category verifies", "Products under watch", "Common traps", "Data, lab, and guides"],
      evidenceIds
    ),
    qualityScore,
    indexStatus,
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds,
    lastUpdated: updatedAt
  };
}

const baseDraftArticles: ArticleDraft[] = [
  {
    group: "hub-usb-c-chargers",
    id: "art-en-hub-chargers",
    locale: "en",
    slug: "usb-c-chargers",
    type: "hub",
    title: "USB-C Charger Verification Hub",
    h1: "USB-C Charger Verification Hub",
    metaDescription:
      "Compare AliExpress USB-C chargers by seller claims, verified output, plug options, price zones, and buyer risk.",
    summary:
      "A category hub for USB-C chargers that links product reviews, lab data, problem guides, and country risk notes.",
    contentMdx: "variant plug cable evidence price verified customs return alternative",
    sections: sections(
      ["What we verify", "Top products under watch", "Country risks", "Data and lab pages"],
      ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-us", "sc-ugreen-100w-title"]
    ),
    qualityScore: 91,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-us", "sc-ugreen-100w-title"],
    lastUpdated: updatedAt
  },
  {
    group: "hub-usb-c-chargers",
    id: "art-es-hub-chargers",
    locale: "es",
    slug: "cargadores-usb-c",
    type: "hub",
    title: "Centro de verificación de cargadores USB-C",
    h1: "Centro de verificación de cargadores USB-C",
    metaDescription:
      "Compara cargadores USB-C de importación por potencia verificada, opciones de enchufe, precio final y riesgo local.",
    summary:
      "Un hub para separar promesas del vendedor, datos medidos, variantes peligrosas y riesgos de compra en español.",
    contentMdx: "variant plug cable evidence price verified customs return alternative",
    sections: sections(
      ["Qué verificamos", "Productos bajo seguimiento", "Riesgos para España", "Datos y laboratorio"],
      ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-es", "sc-baseus-cable"]
    ),
    qualityScore: 88,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("es"),
    affiliateLinks: [],
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-es", "sc-baseus-cable"],
    lastUpdated: updatedAt
  },
  {
    group: "hub-usb-c-chargers",
    id: "art-pt-hub-chargers",
    locale: "pt-br",
    slug: "carregadores-usb-c",
    type: "hub",
    title: "Central de verificação de carregadores USB-C",
    h1: "Central de verificação de carregadores USB-C",
    metaDescription:
      "Compare carregadores USB-C importados por potência verificada, opções de plugue, preço final e risco no Brasil.",
    summary:
      "Um hub em português do Brasil para entender dados medidos, armadilhas de variante e riscos de importação.",
    contentMdx: "variant plug cable evidence price verified customs return alternative",
    sections: sections(
      ["O que verificamos", "Produtos monitorados", "Riscos no Brasil", "Dados e laboratório"],
      ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-br", "sc-baseus-cable"]
    ),
    qualityScore: 87,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("pt-br"),
    affiliateLinks: [],
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-br", "sc-baseus-cable"],
    lastUpdated: updatedAt
  },
  englishCategoryHubDraft({
    id: "art-en-hub-usb-c-cables",
    slug: "usb-c-cables",
    title: "USB-C Cable Verification Hub",
    summary:
      "A category hub for USB-C cables that focuses on e-marker evidence, wattage labels, length variants, and import price risk.",
    evidenceIds: ["vc-essager-emarker", "sc-essager-100w", "sc-essager-emarker", "risk-essager-us"]
  }),
  englishCategoryHubDraft({
    id: "art-en-hub-power-banks",
    slug: "power-banks",
    title: "Power Bank Verification Hub",
    summary:
      "A category hub for imported power banks that separates claimed mAh, usable Wh, USB-C output, shipping cost, and return risk.",
    evidenceIds: [
      "vc-zmi-20000-power-bank-primary",
      "sc-zmi-20000-power-bank-primary",
      "sc-zmi-20000-power-bank-bundle",
      "risk-zmi-20000-power-bank-en"
    ]
  }),
  englishCategoryHubDraft({
    id: "art-en-hub-electric-screwdrivers",
    slug: "electric-screwdrivers",
    title: "Electric Screwdriver Verification Hub",
    summary:
      "A pending category hub for imported electric screwdriver kits where accessory-only options can be mistaken for full kits.",
    evidenceIds: [
      "vc-hoto-screwdriver-kit-primary",
      "sc-hoto-screwdriver-kit-primary",
      "sc-hoto-screwdriver-kit-bundle",
      "risk-hoto-screwdriver-kit-en"
    ],
    indexStatus: "pending",
    qualityScore: 72
  }),
  englishCategoryHubDraft({
    id: "art-en-hub-smart-home-sensors",
    slug: "smart-home-sensors",
    title: "Smart Home Sensor Verification Hub",
    summary:
      "A pending category hub for imported smart-home sensors where Wi-Fi and Zigbee options can share one listing.",
    evidenceIds: [
      "vc-tuya-zigbee-sensor-primary",
      "sc-tuya-zigbee-sensor-primary",
      "sc-tuya-zigbee-sensor-bundle",
      "risk-tuya-zigbee-sensor-en"
    ],
    indexStatus: "pending",
    qualityScore: 72
  }),
  {
    group: "risk-usb-c-import",
    id: "art-en-risk-usb-c-import",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "aliexpress-chargers-us-buyers",
    type: "risk",
    title: "AliExpress USB-C Chargers for US Buyers: Safety, Returns, and SKU Risk",
    h1: "AliExpress USB-C charger risks for US buyers",
    metaDescription:
      "A country-risk page for US buyers comparing plug fit, certification uncertainty, returns, local alternatives, and SKU traps before importing USB-C chargers.",
    summary:
      "US buyers face low customs risk, but certification uncertainty, return friction, and misleading charger variants still matter before clicking an affiliate link.",
    contentMdx: "country customs certification return local alternative variant plug cable evidence price verified risk",
    sections: sections(
      ["US buyer risk summary", "Certification and return tradeoffs", "Local alternatives", "Products to treat carefully", "Evidence"],
      ["risk-baseus-us", "sc-baseus-65w-title", "vc-baseus-output", "rs-baseus-wrong-plug-en"]
    ),
    qualityScore: 88,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["risk-baseus-us", "sc-baseus-65w-title", "vc-baseus-output", "rs-baseus-wrong-plug-en"],
    lastUpdated: updatedAt
  },
  {
    group: "risk-usb-c-import",
    id: "art-en-risk-usb-c-import-uk",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "aliexpress-chargers-uk-buyers",
    type: "risk",
    title: "AliExpress USB-C Chargers for UK Buyers: Plug, VAT, CE and Return Risk",
    h1: "AliExpress USB-C charger risks for UK buyers",
    metaDescription:
      "A country-risk page for UK buyers comparing plug choice, VAT-inclusive price, CE marking uncertainty, local returns, and AliExpress charger SKU traps.",
    summary:
      "UK buyers need a different rule from US buyers: check plug fit, VAT-inclusive landed price, CE claims, and whether a local retailer is safer.",
    contentMdx: "country uk vat ce plug return local alternative variant cable evidence price verified risk",
    sections: sections(
      ["UK buyer risk summary", "Plug and VAT tradeoffs", "CE marking and warranty", "When a local UK seller wins", "Evidence"],
      ["risk-baseus-gb", "sc-baseus-cable", "vc-baseus-output", "rs-baseus-wrong-plug-en"]
    ),
    qualityScore: 86,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["risk-baseus-gb", "sc-baseus-cable", "vc-baseus-output", "rs-baseus-wrong-plug-en"],
    lastUpdated: updatedAt
  },
  {
    group: "risk-usb-c-import",
    id: "art-es-risk-usb-c-import",
    productId: "prod-baseus-65w",
    locale: "es",
    slug: "cargadores-aliexpress-espana",
    type: "risk",
    title: "Cargadores AliExpress para España: enchufe, IVA, CE y devoluciones",
    h1: "Riesgos de comprar cargadores AliExpress desde España",
    metaDescription:
      "Riesgos locales para España: enchufe EU, IVA, declaraciones CE, devoluciones y alternativas locales antes de importar cargadores USB-C.",
    summary:
      "En España el enchufe EU ayuda, pero el precio final, la marca CE no verificada y las devoluciones pueden eliminar la ventaja de importar.",
    contentMdx: "country customs certification return local alternative variant plug cable evidence price verified risk españa",
    sections: sections(
      ["Resumen para España", "Enchufe EU e IVA", "CE y garantía", "Cuándo comprar local", "Evidencia"],
      ["risk-baseus-es", "sc-baseus-cable", "vc-baseus-output", "rs-baseus-compact-es"]
    ),
    qualityScore: 87,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("es"),
    affiliateLinks: [],
    evidenceIds: ["risk-baseus-es", "sc-baseus-cable", "vc-baseus-output", "rs-baseus-compact-es"],
    lastUpdated: updatedAt
  },
  {
    group: "risk-usb-c-import",
    id: "art-pt-risk-usb-c-import",
    productId: "prod-baseus-65w",
    locale: "pt-br",
    slug: "carregadores-aliexpress-brasil",
    type: "risk",
    title: "Carregadores AliExpress no Brasil: imposto, atraso, plugue e devolução",
    h1: "Riscos de importar carregadores AliExpress para o Brasil",
    metaDescription:
      "Página de risco local para o Brasil: imposto, frete, atraso, plugue, devolução e quando comparar com Mercado Livre.",
    summary:
      "No Brasil, o risco principal não é só o carregador; imposto, atraso, plugue e devolução podem apagar o preço baixo.",
    contentMdx: "country customs certification return local alternative variant plug cable evidence price verified risk brasil",
    sections: sections(
      ["Resumo para o Brasil", "Imposto e atraso", "Plugue e certificação", "Quando comprar local", "Evidências"],
      ["risk-baseus-br", "rs-baseus-customs-pt", "sc-baseus-cable", "vc-baseus-output"]
    ),
    qualityScore: 87,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("pt-br"),
    affiliateLinks: [],
    evidenceIds: ["risk-baseus-br", "rs-baseus-customs-pt", "sc-baseus-cable", "vc-baseus-output"],
    lastUpdated: updatedAt
  },
  {
    group: "review-baseus-65w",
    id: "art-en-review-baseus",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "baseus-65w-gan-charger-real-output",
    type: "review",
    title: "AliExpress 65W GaN Charger Test: Real Output, Plug Options, and Variant Traps",
    h1: "AliExpress 65W GaN Charger Test: Which Variant Is Actually Worth Buying?",
    metaDescription:
      "We map the seller claims, verified output, plug variants, price history, review signals, and buyer risks for this AliExpress 65W GaN charger.",
    summary:
      "Good as a cheap travel charger only if the selected SKU is the real 65W variant; avoid it for certified office use.",
    contentMdx:
      "AffiliateDisclosure VerdictCard BuyAvoidCard SellerClaimTable VerifiedClaimTable VariantTrapMap PriceTruthCard ReviewSignalSummary MarketRiskMatrix AlternativesGrid EvidenceList UpdateLog variant plug cable evidence price verified",
    sections: sections(
      [
        "30-second verdict",
        "Who should buy or avoid it",
        "Seller claims vs verified facts",
        "Variant trap map",
        "Price truth",
        "Market risk by country",
        "Evidence and update log"
      ],
      ["vc-baseus-output", "vc-baseus-temp", "vc-baseus-pps-observed", "sc-baseus-65w-title", "risk-baseus-us"]
    ),
    qualityScore: 94,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [
      {
        label: "Check current AliExpress price",
        href: "https://example.com/go/baseus-65w-us",
        rel: "sponsored nofollow"
      }
    ],
    evidenceIds: [
      "vc-baseus-output",
      "vc-baseus-temp",
      "vc-baseus-pps-observed",
      "sc-baseus-65w-title",
      "risk-baseus-us"
    ],
    lastUpdated: updatedAt
  },
  {
    group: "review-baseus-65w",
    id: "art-es-review-baseus",
    productId: "prod-baseus-65w",
    locale: "es",
    slug: "cargador-gan-65w-baseus-potencia-real",
    type: "review",
    title: "Prueba del cargador GaN 65W de AliExpress: potencia real y variantes",
    h1: "Cargador GaN 65W de AliExpress: qué variante merece la pena",
    metaDescription:
      "Revisamos promesas del vendedor, potencia verificada, enchufe EU, señales de reseñas, precio final y riesgo de compra.",
    summary:
      "Conviene solo si eliges la variante real de 65W y el precio final no supera la zona de compra.",
    contentMdx:
      "AffiliateDisclosure VerdictCard BuyAvoidCard SellerClaimTable VerifiedClaimTable VariantTrapMap PriceTruthCard ReviewSignalSummary MarketRiskMatrix AlternativesGrid EvidenceList UpdateLog variant plug cable evidence price verified",
    sections: sections(
      [
        "Veredicto rápido",
        "Quién debería comprarlo",
        "Promesas frente a hechos",
        "Mapa de variantes",
        "Precio real",
        "Riesgo en España",
        "Evidencia"
      ],
      ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-es", "rs-baseus-compact-es"]
    ),
    qualityScore: 90,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("es"),
    affiliateLinks: [
      {
        label: "Ver precio actual en AliExpress",
        href: "https://example.com/go/baseus-65w-eu",
        rel: "sponsored nofollow"
      }
    ],
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-es", "rs-baseus-compact-es"],
    lastUpdated: updatedAt
  },
  {
    group: "review-baseus-65w",
    id: "art-pt-review-baseus",
    productId: "prod-baseus-65w",
    locale: "pt-br",
    slug: "carregador-gan-65w-baseus-potencia-real",
    type: "review",
    title: "Teste do carregador GaN 65W do AliExpress: potência real e variantes",
    h1: "Carregador GaN 65W do AliExpress: qual variante vale a pena?",
    metaDescription:
      "Mapeamos potência verificada, opções de plugue, preço final, sinais de avaliações e riscos para compradores no Brasil.",
    summary:
      "Vale como carregador de viagem barato apenas se a variante for 65W real e o risco de imposto não apagar a vantagem.",
    contentMdx:
      "AffiliateDisclosure VerdictCard BuyAvoidCard SellerClaimTable VerifiedClaimTable VariantTrapMap PriceTruthCard ReviewSignalSummary MarketRiskMatrix AlternativesGrid EvidenceList UpdateLog variant plug cable evidence price verified customs return",
    sections: sections(
      [
        "Veredito em 30 segundos",
        "Quem deve comprar ou evitar",
        "Promessas vs fatos",
        "Mapa de variantes",
        "Preço real",
        "Risco no Brasil",
        "Evidências"
      ],
      ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-br", "rs-baseus-customs-pt"]
    ),
    qualityScore: 89,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("pt-br"),
    affiliateLinks: [
      {
        label: "Ver preço atual no AliExpress",
        href: "https://example.com/go/baseus-65w-us",
        rel: "sponsored nofollow"
      }
    ],
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-br", "rs-baseus-customs-pt"],
    lastUpdated: updatedAt
  },
  {
    group: "guide-fake-watts",
    id: "art-en-guide-fake-watts",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "aliexpress-charger-fake-watts",
    type: "guide",
    title: "AliExpress Charger Fake Watts: How to Spot Misleading 65W Listings",
    h1: "How to spot fake or misleading watts on AliExpress chargers",
    metaDescription:
      "Use variant checks, PD profile evidence, cable rating, and price zones to avoid charger listings where the headline wattage does not match the selected SKU.",
    summary:
      "The common problem is not always a fake product; it is often a 45W or no-cable option hiding under a 65W listing title.",
    contentMdx: "variant option plug cable evidence price verified seller claim",
    sections: sections(
      ["30-second answer", "Most common causes", "How to check before buying", "Flagged products", "Evidence"],
      ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-pps-observed", "vc-baseus-output"]
    ),
    qualityScore: 86,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-pps-observed", "vc-baseus-output"],
    lastUpdated: updatedAt
  },
  {
    group: "guide-not-charging",
    id: "art-en-guide-not-charging",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "aliexpress-charger-not-charging-laptop",
    type: "guide",
    title: "AliExpress 65W Charger Not Charging a Laptop: Variant and Cable Checks",
    h1: "Why an AliExpress 65W charger may not charge your laptop",
    metaDescription:
      "Check the selected wattage variant, USB-C cable rating, PD/PPS profile evidence, and heat behavior before assuming the charger is defective.",
    summary:
      "Laptop charging failures usually trace back to the selected SKU, cable rating, or a PD profile mismatch.",
    contentMdx: "variant option plug cable evidence price verified laptop",
    sections: sections(
      ["30-second answer", "Selected SKU mismatch", "Cable rating check", "PD profile evidence", "Safer alternatives"],
      ["rs-baseus-laptop-en", "var-baseus-45w-trap", "vc-baseus-pps-observed", "vc-baseus-output"]
    ),
    qualityScore: 84,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["rs-baseus-laptop-en", "var-baseus-45w-trap", "vc-baseus-pps-observed", "vc-baseus-output"],
    lastUpdated: updatedAt
  },
  {
    group: "guide-wrong-plug",
    id: "art-en-guide-wrong-plug",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "aliexpress-charger-wrong-plug-option",
    type: "guide",
    title: "Wrong Plug Option on AliExpress Chargers: How to Avoid the SKU Trap",
    h1: "How to avoid the wrong plug option on AliExpress chargers",
    metaDescription:
      "A practical guide to checking US, EU, and bundle variants before buying a USB-C charger from AliExpress.",
    summary:
      "The plug problem is a variant-selection problem, so the page maps which option carries which plug and cable bundle.",
    contentMdx: "variant option plug cable evidence price verified return",
    sections: sections(
      ["30-second answer", "Plug option map", "Bundle traps", "Return risk", "Evidence"],
      ["rs-baseus-wrong-plug-en", "sc-baseus-cable", "risk-baseus-us", "var-baseus-65w-eu-cable"]
    ),
    qualityScore: 84,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["rs-baseus-wrong-plug-en", "sc-baseus-cable", "risk-baseus-us", "var-baseus-65w-eu-cable"],
    lastUpdated: updatedAt
  },
  {
    group: "compare-65w-100w",
    id: "art-en-compare-65w-100w",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "65w-vs-100w-gan-charger",
    type: "compare",
    title: "65W vs 100W GaN Charger: Real Output, Price, and Buyer Risk",
    h1: "65W vs 100W GaN Charger: which one should you import?",
    metaDescription:
      "Compare 65W and 100W GaN charger claims against verified output, heat, cable requirements, price zones, and local buyer risk.",
    summary:
      "A 65W charger is usually the lower-risk travel buy; 100W makes sense only when your laptop and cable setup can use it.",
    contentMdx: "variant option plug cable evidence price verified comparison alternative",
    sections: sections(
      ["Comparison table", "Verified output gap", "Cable requirement", "Price zones", "Who should avoid each"],
      ["vc-baseus-output", "vc-ugreen-output", "sc-ugreen-100w-title", "ps-ugreen-us"]
    ),
    qualityScore: 88,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["vc-baseus-output", "vc-ugreen-output", "sc-ugreen-100w-title", "ps-ugreen-us"],
    lastUpdated: updatedAt
  },
  {
    group: "compare-import-local-alternative",
    id: "art-en-compare-import-local-alternative",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "aliexpress-charger-vs-amazon-alternative",
    type: "compare",
    title: "AliExpress Charger vs Local Alternative: Price, Returns, and Evidence",
    h1: "AliExpress charger vs local alternative: when import savings are not enough",
    metaDescription:
      "Compare imported USB-C charger savings against local marketplace returns, certification confidence, final shipped price, and SKU risk.",
    summary:
      "Importing makes sense only when the selected SKU is verified and the final price gap beats return and certification friction.",
    contentMdx: "compare local alternative price return certification customs variant evidence verified",
    sections: sections(
      ["Comparison rule", "Price gap", "Return and certification risk", "When local wins", "Evidence"],
      ["vc-baseus-output", "sc-baseus-65w-title", "risk-baseus-us", "ps-baseus-us"]
    ),
    qualityScore: 86,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["vc-baseus-output", "sc-baseus-65w-title", "risk-baseus-us", "ps-baseus-us"],
    lastUpdated: updatedAt
  },
  {
    group: "data-output-table",
    id: "art-en-data-output",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "65w-gan-charger-output-table",
    type: "data",
    title: "AliExpress 65W GaN Charger Output Verification Table",
    h1: "AliExpress 65W GaN charger output verification table",
    metaDescription:
      "A structured table of seller wattage claims, sustained output evidence, temperature notes, SKU traps, and update history.",
    summary:
      "This dataset is the evidence source for charger reviews, comparison pages, and problem-solving guides.",
    contentMdx: "BenchmarkTable DatasetDownload variant option plug cable evidence price verified",
    sections: sections(
      ["Methodology", "Benchmark table", "Suspicious claim gaps", "Dataset download", "Update log"],
      ["vc-baseus-output", "vc-baseus-temp", "vc-ugreen-output", "sc-baseus-65w-title"]
    ),
    qualityScore: 92,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "vc-ugreen-output", "sc-baseus-65w-title"],
    lastUpdated: updatedAt
  },
  {
    group: "data-cable-100w-table",
    id: "art-en-data-cable-100w",
    productId: "prod-essager-cable-100w",
    locale: "en",
    slug: "usb-c-cable-100w-verification-table",
    type: "data",
    title: "USB-C Cable 100W Verification Table",
    h1: "USB-C cable 100W verification table",
    metaDescription:
      "A structured evidence table for USB-C cable wattage labels, e-marker checks, length variants, and import price risk.",
    summary:
      "This data page records which cable claims are seller labels, which e-marker checks exist, and when a cheap cable still carries variant risk.",
    contentMdx: "DatasetDownload BenchmarkTable cable e-marker 100W variant length evidence price verified",
    sections: sections(
      ["Dataset scope", "E-marker evidence", "Length and SKU traps", "Price truth", "Reusable evidence"],
      ["vc-essager-emarker", "sc-essager-100w", "sc-essager-emarker", "sc-essager-length", "risk-essager-us"]
    ),
    qualityScore: 89,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["vc-essager-emarker", "sc-essager-100w", "sc-essager-emarker", "sc-essager-length", "risk-essager-us"],
    lastUpdated: updatedAt
  },
  {
    group: "data-power-bank-mah-wh",
    id: "art-en-data-power-bank-wh",
    productId: "prod-zmi-20000-power-bank",
    locale: "en",
    slug: "power-bank-claimed-mah-vs-real-wh",
    type: "data",
    title: "Power Bank Claimed mAh vs Usable Wh Table",
    h1: "Power bank claimed mAh vs usable Wh table",
    metaDescription:
      "A data page explaining imported power bank mAh claims, observed Wh, USB-C output, shipping price, and local return risk.",
    summary:
      "Power bank capacity claims must be interpreted as cell rating first, then compared with usable output energy and import risk.",
    contentMdx: "DatasetDownload BenchmarkTable power bank capacity mAh Wh USB-C output evidence price customs return",
    sections: sections(
      ["Dataset scope", "mAh versus Wh", "USB-C output evidence", "Shipping and return risk", "Reusable evidence"],
      [
        "vc-zmi-20000-power-bank-primary",
        "sc-zmi-20000-power-bank-primary",
        "sc-zmi-20000-power-bank-bundle",
        "risk-zmi-20000-power-bank-en"
      ]
    ),
    qualityScore: 86,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: [
      "vc-zmi-20000-power-bank-primary",
      "sc-zmi-20000-power-bank-primary",
      "sc-zmi-20000-power-bank-bundle",
      "risk-zmi-20000-power-bank-en"
    ],
    lastUpdated: updatedAt
  },
  {
    group: "lab-output-test",
    id: "art-en-lab-output",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "65w-gan-charger-real-output-test",
    type: "lab",
    title: "65W GaN Charger Real Output Test",
    h1: "65W GaN charger real output test",
    metaDescription:
      "Lab notes for sustained output, case temperature, PD/PPS profile capture, and variant caveats for AliExpress 65W chargers.",
    summary:
      "The lab page records how the output and temperature numbers were collected before they are reused on review pages.",
    contentMdx: "TestMethodBlock BenchmarkTable variant option plug cable evidence price verified",
    sections: sections(
      ["Test method", "Load result", "Temperature note", "Profile capture", "Reusable evidence"],
      ["vc-baseus-output", "vc-baseus-temp", "vc-baseus-pps-observed", "sc-baseus-65w-title"]
    ),
    qualityScore: 91,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "vc-baseus-pps-observed", "sc-baseus-65w-title"],
    lastUpdated: updatedAt
  },
  {
    group: "methodology-test-chargers",
    id: "art-en-methodology-test",
    locale: "en",
    slug: "how-we-test-usb-c-chargers",
    type: "methodology",
    title: "How We Test USB-C Chargers",
    h1: "How we test USB-C chargers",
    metaDescription:
      "The testing method behind the USB-C charger database: SKU selection, seller claim capture, PD profile checks, load testing, and risk scoring.",
    summary:
      "A methodology page explaining how seller claims become evidence records and when a page is allowed to be indexed.",
    contentMdx: "methodology variant option plug cable evidence price verified quality gate",
    sections: sections(
      ["SKU selection", "Seller claim ledger", "Load testing", "Risk scoring", "Index gate"],
      ["sc-baseus-65w-title", "vc-baseus-output", "vc-baseus-temp", "risk-baseus-us"]
    ),
    qualityScore: 83,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["sc-baseus-65w-title", "vc-baseus-output", "vc-baseus-temp", "risk-baseus-us"],
    lastUpdated: updatedAt
  },
  {
    group: "methodology-product-score",
    id: "art-en-methodology-score",
    locale: "en",
    slug: "how-we-score-aliexpress-products",
    type: "methodology",
    title: "How We Score AliExpress Products",
    h1: "How we score AliExpress products",
    metaDescription:
      "The scoring method for imported products: identity confidence, seller claims, verified evidence, variant traps, price truth, and local risk.",
    summary:
      "This methodology explains why a page can be indexed only when evidence, unique buyer value, and internal-link context are strong enough.",
    contentMdx: "methodology quality score identity confidence seller claim verified data variant trap price truth locale risk index gate",
    sections: sections(
      ["Identity confidence", "Claim evidence", "Variant and price risk", "Locale risk", "Index decision"],
      ["sc-baseus-65w-title", "vc-baseus-output", "risk-baseus-us", "vc-essager-emarker"]
    ),
    qualityScore: 84,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["sc-baseus-65w-title", "vc-baseus-output", "risk-baseus-us", "vc-essager-emarker"],
    lastUpdated: updatedAt
  },
  {
    group: "methodology-price-truth",
    id: "art-en-methodology-price-truth",
    locale: "en",
    slug: "price-truth-score",
    type: "methodology",
    title: "Price Truth Score Methodology",
    h1: "Price truth score methodology",
    metaDescription:
      "How Global Import Lab converts product price, shipping, coupons, SKU traps, and local return risk into buy, wait, or avoid zones.",
    summary:
      "The price truth score prevents cheap-looking imports from being recommended when shipping, coupons, SKU traps, or returns erase the savings.",
    contentMdx: "methodology price truth score normal price sale price shipping coupon final price buy wait avoid variant trap return risk",
    sections: sections(
      ["Normal price", "Coupon-adjusted price", "Final shipped price", "Buy/wait/avoid thresholds", "Risk overrides"],
      ["ps-baseus-us", "ps-essager-us", "risk-baseus-us", "risk-essager-us"]
    ),
    qualityScore: 84,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds: ["ps-baseus-us", "ps-essager-us", "risk-baseus-us", "risk-essager-us"],
    lastUpdated: updatedAt
  },
  {
    group: "guide-fake-watts-es",
    id: "art-es-guide-fake-watts",
    productId: "prod-baseus-65w",
    locale: "es",
    slug: "cargador-aliexpress-watts-falsos",
    type: "guide",
    title: "Watts falsos en cargadores AliExpress: cómo revisar la variante",
    h1: "Cómo detectar watts falsos o confusos en cargadores AliExpress",
    metaDescription:
      "Revisa variante, enchufe, cable, perfil PD/PPS y precio final antes de comprar un cargador USB-C importado.",
    summary:
      "Muchos problemas salen de comprar la variante de 45W dentro de una ficha que anuncia 65W.",
    contentMdx: "variant option plug cable evidence price verified seller claim",
    sections: sections(
      ["Respuesta rápida", "Causas comunes", "Comprobación antes de comprar", "Productos marcados", "Evidencia"],
      ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-output", "risk-baseus-es"]
    ),
    qualityScore: 83,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("es"),
    affiliateLinks: [],
    evidenceIds: ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-output", "risk-baseus-es"],
    lastUpdated: updatedAt
  },
  {
    group: "guide-fake-watts-pt",
    id: "art-pt-guide-fake-watts",
    productId: "prod-baseus-65w",
    locale: "pt-br",
    slug: "carregador-aliexpress-watts-falsos",
    type: "guide",
    title: "Watts falsos em carregadores AliExpress: como revisar a variante",
    h1: "Como detectar watts falsos ou confusos em carregadores AliExpress",
    metaDescription:
      "Confira variante, plugue, cabo, perfil PD/PPS, preço final e risco de imposto antes de comprar.",
    summary:
      "O erro comum é escolher uma variante de 45W dentro de um anúncio que destaca 65W.",
    contentMdx: "variant option plug cable evidence price verified customs return",
    sections: sections(
      ["Resposta rápida", "Causas comuns", "Checagem antes da compra", "Produtos marcados", "Evidências"],
      ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-output", "risk-baseus-br"]
    ),
    qualityScore: 82,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks("pt-br"),
    affiliateLinks: [],
    evidenceIds: ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-output", "risk-baseus-br"],
    lastUpdated: updatedAt
  },
  {
    group: "pending-review-ugreen",
    id: "art-en-review-ugreen-pending",
    productId: "prod-ugreen-100w",
    locale: "en",
    slug: "ugreen-100w-gan-charger-output",
    type: "review",
    title: "Ugreen 100W GaN Charger Output Notes",
    h1: "Ugreen 100W GaN charger output notes",
    metaDescription: "Pending review page waiting for more variant and locale-risk evidence.",
    summary: "This draft is intentionally pending because it needs more local risk and review signal evidence.",
    contentMdx: "variant evidence price pending",
    sections: sections(["Draft notes", "Missing evidence", "Next checks"], ["vc-ugreen-output", "sc-ugreen-100w-title"]),
    qualityScore: 66,
    indexStatus: "pending",
    publishStatus: "draft",
    internalLinks: internalLinks("en").slice(0, 3),
    affiliateLinks: [
      {
        label: "Check current AliExpress price",
        href: "https://example.com/go/ugreen-100w",
        rel: "sponsored nofollow"
      }
    ],
    evidenceIds: ["vc-ugreen-output", "sc-ugreen-100w-title"],
    lastUpdated: updatedAt
  }
];

const trendBlogDraftArticles: ArticleDraft[] = [
  trendBlogArticle({
    group: "trend-travel-gan-charger",
    id: "art-en-trend-travel-gan-charger",
    locale: "en",
    slug: "travel-gan-charger-fake-wattage-trend",
    type: "trend",
    title: "Travel GaN charger fake wattage trend evidence brief",
    h1: "Travel GaN charger fake wattage trend evidence brief",
    metaDescription:
      "Why travel GaN charger fake-wattage searches are rising, which evidence is needed, and where cautious buyers should look next.",
    summary:
      "Search demand is rising around compact travel chargers, but the useful angle is evidence: SKU traps, output claims, price zones, and return risk.",
    contentMdx: "trend source signals rising evidence verified variant price risk affiliate localization update log",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-65w-title", "risk-baseus-us", "rs-baseus-laptop-en"],
    headings: ["Trend summary", "Why it is rising", "Evidence and source signals", "Related buyer problems", "Localization notes"]
  }),
  trendBlogArticle({
    group: "trend-travel-gan-charger",
    id: "art-es-trend-travel-gan-charger",
    locale: "es",
    slug: "tendencia-cargador-gan-viaje-watts-falsos",
    type: "trend",
    title: "Tendencia de cargadores GaN de viaje y watts falsos",
    h1: "Tendencia de cargadores GaN de viaje y watts falsos",
    metaDescription:
      "Por qué suben las búsquedas de cargadores GaN de viaje, qué evidencias hacen falta y qué riesgos debe revisar un comprador.",
    summary:
      "La demanda crece, pero la página solo debe avanzar si separa variante, potencia verificada, precio final y riesgo local.",
    contentMdx: "trend source signals rising evidence verified variant price risk affiliate localization update log",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-es", "rs-baseus-compact-es"],
    headings: ["Resumen de tendencia", "Por qué está creciendo", "Señales y evidencia", "Problemas de compra relacionados", "Notas locales"]
  }),
  trendBlogArticle({
    group: "trend-travel-gan-charger",
    id: "art-pt-trend-travel-gan-charger",
    locale: "pt-br",
    slug: "tendencia-carregador-gan-viagem-watts-falsos",
    type: "trend",
    title: "Tendência de carregadores GaN de viagem e watts falsos",
    h1: "Tendência de carregadores GaN de viagem e watts falsos",
    metaDescription:
      "Por que buscas por carregadores GaN de viagem estão crescendo e quais evidências reduzem risco antes da compra.",
    summary:
      "A demanda aumenta, mas a decisão editorial depende de variante, potência verificada, preço final e risco no Brasil.",
    contentMdx: "trend source signals rising evidence verified variant price risk affiliate localization update log",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-br", "rs-baseus-customs-pt"],
    headings: ["Resumo da tendência", "Por que está crescendo", "Sinais e evidências", "Problemas de compra relacionados", "Notas locais"]
  }),
  trendBlogArticle({
    group: "buyer-guide-travel-gan",
    id: "art-en-buyer-guide-travel-gan",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "travel-gan-charger-buyer-guide-evidence",
    type: "buyer_guide",
    title: "Travel GaN charger buyer guide with evidence checks",
    h1: "Travel GaN charger buyer guide with evidence checks",
    metaDescription:
      "A decision framework for travel GaN chargers using verified output, SKU traps, plug options, price zones, and local risk.",
    summary:
      "Buyers should compare the exact SKU, sustained output evidence, shipped price, plug option, and return route before clicking.",
    contentMdx: "buyer guide decision framework evidence verified variant price risk affiliate offers comparison table",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "vc-baseus-pps-observed", "sc-baseus-65w-title", "risk-baseus-us"],
    headings: ["Decision framework", "Who should buy or avoid", "Comparison and offer fit", "Evidence and risk blocks", "Localization notes"],
    affiliateLabel: "Check evidence-matched AliExpress offers",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  }),
  trendBlogArticle({
    group: "buyer-guide-travel-gan",
    id: "art-es-buyer-guide-travel-gan",
    productId: "prod-baseus-65w",
    locale: "es",
    slug: "guia-compra-cargador-gan-viaje-evidencia",
    type: "buyer_guide",
    title: "Guía de compra de cargadores GaN de viaje con evidencia",
    h1: "Guía de compra de cargadores GaN de viaje con evidencia",
    metaDescription:
      "Marco de decisión para cargadores GaN de viaje con potencia verificada, variantes, enchufe, precio final y riesgo local.",
    summary:
      "El comprador debe revisar SKU exacta, potencia sostenida, precio con envío, enchufe y devolución antes de hacer clic.",
    contentMdx: "buyer guide decision framework evidence verified variant price risk affiliate offers comparison table",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-es", "rs-baseus-compact-es"],
    headings: ["Marco de decisión", "Quién debería comprar o evitar", "Comparación y ofertas", "Evidencia y riesgos", "Notas locales"],
    affiliateLabel: "Ver ofertas AliExpress con evidencia",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  }),
  trendBlogArticle({
    group: "buyer-guide-travel-gan",
    id: "art-pt-buyer-guide-travel-gan",
    productId: "prod-baseus-65w",
    locale: "pt-br",
    slug: "guia-compra-carregador-gan-viagem-evidencia",
    type: "buyer_guide",
    title: "Guia de compra de carregadores GaN de viagem com evidência",
    h1: "Guia de compra de carregadores GaN de viagem com evidência",
    metaDescription:
      "Estrutura de decisão para carregadores GaN de viagem com potência verificada, variantes, plugue, preço final e risco local.",
    summary:
      "O comprador deve comparar SKU exato, potência sustentada, preço com frete, plugue e devolução antes do clique.",
    contentMdx: "buyer guide decision framework evidence verified variant price risk affiliate offers comparison table",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-br", "rs-baseus-customs-pt"],
    headings: ["Estrutura de decisão", "Quem deve comprar ou evitar", "Comparação e ofertas", "Evidência e riscos", "Notas locais"],
    affiliateLabel: "Ver ofertas AliExpress com evidência",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  }),
  trendBlogArticle({
    group: "deal-watch-65w-gan",
    id: "art-en-deal-watch-65w-gan",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "65w-gan-charger-deal-watch-buy-wait-avoid",
    type: "deal_watch",
    title: "65W GaN charger deal watch: buy, wait, or avoid",
    h1: "65W GaN charger deal watch: buy, wait, or avoid",
    metaDescription:
      "A no-fake-urgency deal watch for 65W GaN chargers using price history, variant traps, evidence, and local buyer risk.",
    summary:
      "A deal is only useful when the shipped price, selected SKU, verified output, and return path stay inside the buy zone.",
    contentMdx: "deal watch price history buy wait avoid zone evidence verified variant price risk affiliate offers last checked",
    evidenceIds: ["ps-baseus-us", "vc-baseus-output", "vc-baseus-temp", "sc-baseus-65w-title", "risk-baseus-us"],
    headings: ["Price history", "Buy, wait, or avoid zone", "Offer table", "Variant risk", "Last checked"],
    affiliateLabel: "Check current 65W deal",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  }),
  trendBlogArticle({
    group: "deal-watch-65w-gan",
    id: "art-es-deal-watch-65w-gan",
    productId: "prod-baseus-65w",
    locale: "es",
    slug: "oferta-cargador-gan-65w-comprar-esperar-evitar",
    type: "deal_watch",
    title: "Oferta de cargador GaN 65W: comprar, esperar o evitar",
    h1: "Oferta de cargador GaN 65W: comprar, esperar o evitar",
    metaDescription:
      "Seguimiento de oferta sin urgencia falsa para cargadores GaN 65W con historial de precio, variantes y riesgo local.",
    summary:
      "Una oferta vale la pena solo cuando precio final, SKU, potencia verificada y devolución entran en la zona de compra.",
    contentMdx: "deal watch price history buy wait avoid zone evidence verified variant price risk affiliate offers last checked",
    evidenceIds: ["ps-baseus-es", "vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-es"],
    headings: ["Historial de precio", "Zona de compra o espera", "Tabla de ofertas", "Riesgo de variante", "Última revisión"],
    affiliateLabel: "Ver oferta actual 65W",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  }),
  trendBlogArticle({
    group: "deal-watch-65w-gan",
    id: "art-pt-deal-watch-65w-gan",
    productId: "prod-baseus-65w",
    locale: "pt-br",
    slug: "oferta-carregador-gan-65w-comprar-esperar-evitar",
    type: "deal_watch",
    title: "Oferta de carregador GaN 65W: comprar, esperar ou evitar",
    h1: "Oferta de carregador GaN 65W: comprar, esperar ou evitar",
    metaDescription:
      "Monitoramento sem urgência falsa para carregadores GaN 65W com histórico de preço, variantes e risco no Brasil.",
    summary:
      "A oferta só funciona quando preço final, SKU, potência verificada e devolução ficam dentro da zona de compra.",
    contentMdx: "deal watch price history buy wait avoid zone evidence verified variant price risk affiliate offers last checked",
    evidenceIds: ["ps-baseus-br", "vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-br"],
    headings: ["Histórico de preço", "Zona de compra ou espera", "Tabela de ofertas", "Risco de variante", "Última revisão"],
    affiliateLabel: "Ver oferta atual 65W",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  }),
  trendBlogArticle({
    group: "ingredient-magnesium-glycinate",
    id: "art-en-ingredient-magnesium-glycinate",
    locale: "en",
    slug: "magnesium-glycinate-supplement-evidence-safety",
    type: "ingredient_guide",
    title: "Magnesium glycinate supplement evidence and safety guide",
    h1: "Magnesium glycinate supplement evidence and safety guide",
    metaDescription:
      "A conservative magnesium glycinate guide that separates supported claims, unsupported claims, safety warnings, and iHerb offer checks.",
    summary:
      "This supplement guide is informational only and keeps iHerb offers behind evidence, disclosure, and health compliance checks.",
    contentMdx:
      "ingredient guide iherb supplement magnesium sleep evidence risk safety warning label source not medical advice consult a qualified healthcare professional affiliate offers",
    evidenceIds: ["source-magnesium-label", "source-iherb-offer", "source-health-disclaimer", "source-manual-review"],
    headings: ["What the ingredient is", "Supported claims", "Unsupported claims", "Safety warnings", "iHerb offer checks"],
    affiliateLabel: "Review iHerb magnesium options",
    affiliateHref: "https://www.iherb.com/pr/magnesium-glycinate"
  }),
  trendBlogArticle({
    group: "ingredient-magnesium-glycinate",
    id: "art-es-ingredient-magnesium-glycinate",
    locale: "es",
    slug: "magnesio-glicinato-suplemento-evidencia-seguridad",
    type: "ingredient_guide",
    title: "Guía de magnesio glicinato con evidencia y seguridad",
    h1: "Guía de magnesio glicinato con evidencia y seguridad",
    metaDescription:
      "Guía conservadora de magnesio glicinato que separa afirmaciones apoyadas, no apoyadas, advertencias y ofertas iHerb.",
    summary:
      "Esta guía de suplemento es informativa y no reemplaza revisión profesional; las ofertas iHerb requieren evidencia y cumplimiento.",
    contentMdx:
      "ingredient guide iherb supplement magnesium sleep evidence risk safety warning label source not medical advice consult a qualified healthcare professional affiliate offers",
    evidenceIds: ["source-magnesium-label", "source-iherb-offer", "source-health-disclaimer", "source-manual-review"],
    headings: ["Qué es el ingrediente", "Afirmaciones apoyadas", "Afirmaciones no apoyadas", "Advertencias", "Revisión de ofertas iHerb"],
    affiliateLabel: "Revisar opciones de magnesio en iHerb",
    affiliateHref: "https://www.iherb.com/pr/magnesium-glycinate"
  }),
  trendBlogArticle({
    group: "ingredient-magnesium-glycinate",
    id: "art-pt-ingredient-magnesium-glycinate",
    locale: "pt-br",
    slug: "magnesio-glicinato-suplemento-evidencia-seguranca",
    type: "ingredient_guide",
    title: "Guia de magnésio glicinato com evidência e segurança",
    h1: "Guia de magnésio glicinato com evidência e segurança",
    metaDescription:
      "Guia conservador de magnésio glicinato com alegações apoiadas, não apoiadas, avisos de segurança e ofertas iHerb.",
    summary:
      "Este guia de suplemento é informativo e não substitui orientação profissional; ofertas iHerb exigem evidência e compliance.",
    contentMdx:
      "ingredient guide iherb supplement magnesium sleep evidence risk safety warning label source not medical advice consult a qualified healthcare professional affiliate offers",
    evidenceIds: ["source-magnesium-label", "source-iherb-offer", "source-health-disclaimer", "source-manual-review"],
    headings: ["O que é o ingrediente", "Alegações apoiadas", "Alegações não apoiadas", "Avisos de segurança", "Revisão de ofertas iHerb"],
    affiliateLabel: "Revisar opções de magnésio na iHerb",
    affiliateHref: "https://www.iherb.com/pr/magnesium-glycinate"
  })
];

const initialUrlPlan: UrlPlanRow[] = [
  { locale: "en", type: "hub", count: 5, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "en", type: "data", count: 5, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "en", type: "lab", count: 5, indexTarget: 4, cluster: "usb-c charging" },
  { locale: "en", type: "guide", count: 15, indexTarget: 4, cluster: "usb-c charging" },
  { locale: "en", type: "compare", count: 10, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "en", type: "review", count: 20, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "es", type: "hub", count: 3, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "es", type: "guide", count: 8, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "es", type: "compare", count: 4, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "es", type: "review", count: 10, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "pt-br", type: "hub", count: 3, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "pt-br", type: "guide", count: 8, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "pt-br", type: "compare", count: 4, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "pt-br", type: "review", count: 10, indexTarget: 1, cluster: "usb-c charging" }
];

export const plannedUrlTotal = initialUrlPlan.reduce((total, row) => total + row.count, 0);
export const plannedIndexTargetTotal = initialUrlPlan.reduce((total, row) => total + row.indexTarget, 0);

const generatedDraftArticles: ArticleDraft[] = initialUrlPlan.flatMap((row) =>
  Array.from({ length: row.count }, (_, index) => buildPlannedArticle(row, index + 1))
);

const draftArticles: ArticleDraft[] = [...baseDraftArticles, ...trendBlogDraftArticles, ...generatedDraftArticles];

const linkableArticleTypes: ArticleType[] = [
  "hub",
  "methodology",
  "trend",
  "buyer_guide",
  "deal_watch",
  "ingredient_guide",
  "risk",
  "data",
  "lab",
  "compare",
  "guide",
  "review"
];

const linkReasonByType: Record<ArticleType, InternalLink["reason"]> = {
  hub: "category_hub",
  methodology: "methodology",
  data: "data",
  lab: "data",
  compare: "compare",
  guide: "guide",
  risk: "risk",
  review: "alternative",
  trend: "trend",
  buyer_guide: "guide",
  deal_watch: "deal",
  ingredient_guide: "ingredient"
};

const riskIntentTokens = [
  "variant",
  "sku",
  "option",
  "plug",
  "enchufe",
  "plugue",
  "cable",
  "customs",
  "impuesto",
  "iva",
  "tax",
  "certification",
  "ce",
  "return",
  "devolucion",
  "devolução",
  "shipping",
  "frete",
  "price",
  "precio",
  "preço",
  "watts",
  "watt",
  "output",
  "potencia",
  "potência",
  "thermal",
  "heat",
  "laptop",
  "capacity",
  "torque",
  "zigbee"
];

function buildProgrammaticInternalLinks(article: ArticleDraft, candidates: ArticleDraft[]): InternalLink[] {
  const linkableCandidates = candidates.filter(
    (candidate) =>
      candidate.id !== article.id &&
      candidate.locale === article.locale &&
      candidate.publishStatus === "published" &&
      candidate.indexStatus === "index"
  );

  const scoredCandidates = linkableCandidates
    .map((candidate) => ({
      candidate,
      score: scoreInternalLink(article, candidate)
    }))
    .filter((row) => row.score > 0)
    .sort((left, right) => sortScoredInternalLinks(left, right));

  const selected = diversifyInternalLinks(article, scoredCandidates, 8);
  const links = selected.map(({ candidate }) => ({
    label: candidate.title,
    href: articlePath(candidate),
    reason: linkReasonByType[candidate.type]
  }));

  return ensureMinimumInternalLinks(article, links, linkableCandidates);
}

function scoreInternalLink(source: ArticleDraft, candidate: ArticleDraft) {
  let score = 40; // same_locale_score: candidates are filtered to the same locale before scoring.

  const sourceProduct = productForArticle(source);
  const candidateProduct = productForArticle(candidate);
  const sourceTerms = articleTermSet(source);
  const candidateTerms = articleTermSet(candidate);
  const sharedTerms = intersectionCount(sourceTerms, candidateTerms);

  if (sourceProduct && candidateProduct && sourceProduct.id === candidateProduct.id) {
    score += 28;
  }

  if (articleCategory(source) && articleCategory(source) === articleCategory(candidate)) {
    score += 18; // same_category_score
  }

  score += Math.min(24, evidenceOverlap(source, candidate) * 8); // same_claim_score
  score += Math.min(20, riskProblemOverlap(sourceTerms, candidateTerms) * 5); // same_problem_score
  score += riskOverlapScore(source, candidate); // risk_overlap_score
  score += priceBandScore(sourceProduct, candidateProduct); // alternative_price_band_score
  score += typeAffinityScore(source, candidate);
  score += Math.min(12, sharedTerms);

  if (source.type === candidate.type) {
    score -= 6;
  }

  if (source.group === candidate.group) {
    score += 6;
  }

  return score;
}

function sortScoredInternalLinks(
  left: { candidate: ArticleDraft; score: number },
  right: { candidate: ArticleDraft; score: number }
) {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  const typeOrder = linkableArticleTypes.indexOf(left.candidate.type) - linkableArticleTypes.indexOf(right.candidate.type);
  if (typeOrder !== 0) {
    return typeOrder;
  }

  return left.candidate.slug.localeCompare(right.candidate.slug);
}

function diversifyInternalLinks(
  source: ArticleDraft,
  scoredCandidates: Array<{ candidate: ArticleDraft; score: number }>,
  limit: number
) {
  const selected: Array<{ candidate: ArticleDraft; score: number }> = [];
  const selectedHrefs = new Set<string>();
  const typeCounts = new Map<ArticleType, number>();

  for (const preferredType of linkableArticleTypes) {
    if (selected.length >= limit) {
      break;
    }

    if (preferredType === source.type && selected.length >= 5) {
      continue;
    }

    const preferred = scoredCandidates.find(
      (row) => row.candidate.type === preferredType && !selectedHrefs.has(articlePath(row.candidate))
    );

    if (preferred) {
      addInternalLinkCandidate(preferred, selected, selectedHrefs, typeCounts);
    }
  }

  for (const row of scoredCandidates) {
    if (selected.length >= limit) {
      break;
    }

    const href = articlePath(row.candidate);
    const sameTypeCount = typeCounts.get(row.candidate.type) ?? 0;
    if (selectedHrefs.has(href) || sameTypeCount >= 2) {
      continue;
    }

    addInternalLinkCandidate(row, selected, selectedHrefs, typeCounts);
  }

  return selected.sort((left, right) => sortScoredInternalLinks(left, right));
}

function addInternalLinkCandidate(
  row: { candidate: ArticleDraft; score: number },
  selected: Array<{ candidate: ArticleDraft; score: number }>,
  selectedHrefs: Set<string>,
  typeCounts: Map<ArticleType, number>
) {
  selected.push(row);
  selectedHrefs.add(articlePath(row.candidate));
  typeCounts.set(row.candidate.type, (typeCounts.get(row.candidate.type) ?? 0) + 1);
}

function ensureMinimumInternalLinks(article: ArticleDraft, links: InternalLink[], candidates: ArticleDraft[]) {
  const deduped = dedupeInternalLinks(links);
  if (deduped.length >= 5) {
    return deduped;
  }

  const existing = new Set(deduped.map((link) => link.href));
  const fallbackLinks = candidates
    .filter((candidate) => !existing.has(articlePath(candidate)))
    .sort((left, right) => sortScoredInternalLinks({ candidate: left, score: 1 }, { candidate: right, score: 1 }))
    .map((candidate) => ({
      label: candidate.title,
      href: articlePath(candidate),
      reason: linkReasonByType[candidate.type]
    }));

  return dedupeInternalLinks([...deduped, ...fallbackLinks]).slice(0, 8);
}

function trendBlogArticle(input: {
  group: string;
  id: string;
  productId?: string;
  locale: Locale;
  slug: string;
  type: "trend" | "buyer_guide" | "deal_watch" | "ingredient_guide";
  title: string;
  h1: string;
  metaDescription: string;
  summary: string;
  contentMdx: string;
  evidenceIds: string[];
  headings: string[];
  affiliateLabel?: string;
  affiliateHref?: string;
}): ArticleDraft {
  return {
    group: input.group,
    id: input.id,
    productId: input.productId,
    locale: input.locale,
    slug: input.slug,
    type: input.type,
    title: input.title,
    h1: input.h1,
    metaDescription: input.metaDescription,
    summary: input.summary,
    contentMdx: input.contentMdx,
    sections: sections(input.headings, input.evidenceIds),
    qualityScore: 84,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: internalLinks(input.locale),
    affiliateLinks:
      input.affiliateLabel && input.affiliateHref
        ? [
            {
              label: input.affiliateLabel,
              href: input.affiliateHref,
              rel: "sponsored nofollow"
            }
          ]
        : [],
    evidenceIds: input.evidenceIds,
    lastUpdated: updatedAt
  };
}

function dedupeInternalLinks(links: InternalLink[]) {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }

    seen.add(link.href);
    return true;
  });
}

function productForArticle(article: Pick<ArticleDraft, "productId">) {
  return article.productId ? products.find((product) => product.id === article.productId) : undefined;
}

function articleCategory(article: ArticleDraft) {
  const productCategory = productForArticle(article)?.category;
  if (productCategory) {
    return productCategory;
  }

  const terms = articleText(article);
  if (terms.includes("usb-c") || terms.includes("charger") || terms.includes("cargador") || terms.includes("carregador")) {
    return "usb-c-chargers";
  }

  if (terms.includes("supplement") || terms.includes("iherb") || terms.includes("magnesium") || terms.includes("magnesio")) {
    return "supplements";
  }

  return undefined;
}

function articleTermSet(article: ArticleDraft) {
  return new Set(articleText(article).match(/[a-z0-9]+(?:-[a-z0-9]+)?/g) ?? []);
}

function articleText(article: ArticleDraft) {
  return [
    article.slug,
    article.type,
    article.title,
    article.h1,
    article.metaDescription,
    article.summary,
    article.contentMdx,
    article.evidenceIds.join(" "),
    article.sections.map((section) => `${section.heading} ${section.body}`).join(" ")
  ]
    .join(" ")
    .toLowerCase();
}

function evidenceOverlap(source: ArticleDraft, candidate: ArticleDraft) {
  const candidateEvidence = new Set(candidate.evidenceIds);
  return source.evidenceIds.filter((evidenceId) => candidateEvidence.has(evidenceId)).length;
}

function riskProblemOverlap(sourceTerms: Set<string>, candidateTerms: Set<string>) {
  return riskIntentTokens.filter((token) => sourceTerms.has(token) && candidateTerms.has(token)).length;
}

function riskOverlapScore(source: ArticleDraft, candidate: ArticleDraft) {
  const sourceProfile = articleRiskProfile(source);
  const candidateProfile = articleRiskProfile(candidate);
  return Math.min(20, intersectionCount(sourceProfile, candidateProfile) * 5);
}

function articleRiskProfile(article: ArticleDraft) {
  const profile = new Set<string>();
  const terms = articleTermSet(article);

  for (const token of riskIntentTokens) {
    if (terms.has(token)) {
      profile.add(token);
    }
  }

  const product = productForArticle(article);
  const marketRisk = product?.marketRisks.find((risk) => risk.locale === article.locale);
  if (marketRisk) {
    for (const [key, value] of Object.entries({
      plug: marketRisk.plugRisk,
      customs: marketRisk.customsRisk,
      certification: marketRisk.certificationRisk,
      return: marketRisk.returnRisk
    })) {
      if (value && value !== "low") {
        profile.add(`${key}:${value}`);
      }
    }
  }

  return profile;
}

function priceBandScore(sourceProduct?: Product, candidateProduct?: Product) {
  const sourceBand = priceBand(sourceProduct);
  const candidateBand = priceBand(candidateProduct);

  if (!sourceBand || !candidateBand || sourceProduct?.id === candidateProduct?.id) {
    return 0;
  }

  if (sourceBand === candidateBand) {
    return 10;
  }

  return Math.abs(sourceBand - candidateBand) === 1 ? 5 : 0;
}

function priceBand(product?: Product) {
  const finalPrice = product?.priceSnapshots[0]?.finalPrice ?? product?.priceSnapshots[0]?.price;
  if (finalPrice === undefined) {
    return undefined;
  }

  if (finalPrice < 10) {
    return 1;
  }

  if (finalPrice < 25) {
    return 2;
  }

  if (finalPrice < 50) {
    return 3;
  }

  return 4;
}

function typeAffinityScore(source: ArticleDraft, candidate: ArticleDraft) {
  if (candidate.type === "trend" && source.type !== "trend") {
    return 16;
  }

  if (candidate.type === "buyer_guide" && ["trend", "review", "compare", "deal_watch"].includes(source.type)) {
    return 16;
  }

  if (candidate.type === "deal_watch" && ["buyer_guide", "review", "compare", "trend"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "ingredient_guide" && ["trend", "buyer_guide"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "hub" && source.type !== "hub") {
    return 18;
  }

  if (candidate.type === "methodology" && source.type !== "methodology") {
    return 14;
  }

  if ((candidate.type === "data" || candidate.type === "lab") && ["review", "guide", "compare", "risk"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "risk" && ["review", "guide", "compare", "hub"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "compare" && ["review", "guide", "hub", "risk"].includes(source.type)) {
    return 10;
  }

  if (candidate.type === "guide" && ["review", "risk", "compare", "hub"].includes(source.type)) {
    return 10;
  }

  if (candidate.type === "review" && ["guide", "compare", "hub", "risk"].includes(source.type)) {
    return 8;
  }

  return 4;
}

function intersectionCount<T>(left: Set<T>, right: Set<T>) {
  let count = 0;
  for (const item of left) {
    if (right.has(item)) {
      count += 1;
    }
  }
  return count;
}

function buildPlannedArticle(row: UrlPlanRow, ordinal: number): ArticleDraft {
  const indexable = ordinal <= row.indexTarget;
  const product = products[(ordinal - 1) % products.length];
  const localeText = plannedLocaleText(row.locale);
  const typeText = plannedTypeText(row.type, row.locale);
  const slug = plannedSlug(row, ordinal);
  const evidenceIds = plannedEvidenceIds(row.locale, product.id);
  const productId = row.type === "hub" || row.type === "methodology" ? undefined : product.id;
  const title = `${localeText.prefix} ${typeText.title} ${ordinal}: ${localeText.clusterName}`;
  const summary = `${localeText.summary} It maps seller claims, verified evidence, variant traps, price zones, internal links, and local buyer risk before the page can be indexed.`;

  return {
    group: `planned-${row.locale}-${row.type}-${ordinal}`,
    id: `art-planned-${row.locale}-${row.type}-${String(ordinal).padStart(2, "0")}`,
    productId,
    locale: row.locale,
    slug,
    type: row.type,
    title,
    h1: `${typeText.h1} ${ordinal}: ${localeText.clusterName}`,
    metaDescription: `${localeText.meta} This planned URL is generated from the USB-C evidence inventory and uses the index gate before search exposure.`,
    summary,
    contentMdx:
      "planned inventory variant option plug cable evidence price verified customs return alternative internal links locale risk quality gate",
    sections: sections(
      [
        localeText.sections[0],
        localeText.sections[1],
        localeText.sections[2],
        localeText.sections[3],
        localeText.sections[4]
      ],
      evidenceIds
    ),
    qualityScore: indexable ? 84 : 62,
    indexStatus: indexable ? "index" : "pending",
    publishStatus: indexable ? "published" : "draft",
    internalLinks: internalLinks(row.locale),
    affiliateLinks:
      row.type === "review"
        ? [
            {
              label: localeText.affiliateLabel,
              href: product.variants[0]?.affiliateUrl ?? "https://example.com/go/import-product",
              rel: "sponsored nofollow"
            }
          ]
        : [],
    evidenceIds,
    lastUpdated: updatedAt
  };
}

function plannedEvidenceIds(locale: Locale, productId: string) {
  const product = products.find((item) => item.id === productId) ?? products[0];
  const localeRiskId = product.marketRisks.find((risk) => risk.locale === locale)?.id ?? product.marketRisks[0]?.id;
  const reviewSignalId =
    product.reviewSignals.find((signal) => signal.locale === locale)?.id ?? product.reviewSignals.find((signal) => signal.locale === "en")?.id;
  return [
    ...product.verifiedClaims.slice(0, 2).map((claim) => claim.id),
    ...product.sellerClaims.slice(0, 2).map((claim) => claim.id),
    reviewSignalId,
    localeRiskId
  ].filter(Boolean) as string[];
}

function plannedSlug(row: UrlPlanRow, ordinal: number) {
  const suffix = String(ordinal).padStart(2, "0");
  const baseByLocale: Record<Locale, string> = {
    en: "usb-c-import-verification",
    es: "verificacion-importacion-usb-c",
    "pt-br": "verificacao-importacao-usb-c"
  };
  return `${baseByLocale[row.locale]}-${row.type}-${suffix}`;
}

function plannedLocaleText(locale: Locale) {
  const copy = {
    en: {
      prefix: "USB-C import",
      clusterName: "USB-C charging evidence",
      summary: "This planned page belongs to the first 110 URL cluster for imported USB-C charging products.",
      meta: "Seller claims, evidence packs, variant traps, price truth, and local risk for imported USB-C charging products.",
      affiliateLabel: "Check current AliExpress price",
      sections: ["Search intent", "Evidence pack", "Variant and price risks", "Locale risk", "Internal links"]
    },
    es: {
      prefix: "Importación USB-C",
      clusterName: "evidencia de carga USB-C",
      summary: "Esta página planificada pertenece al primer grupo de 110 URLs sobre productos USB-C importados.",
      meta: "Promesas del vendedor, evidencias, variantes, precio real y riesgo local para productos USB-C importados.",
      affiliateLabel: "Ver precio actual en AliExpress",
      sections: ["Intención de búsqueda", "Paquete de evidencia", "Riesgos de variante y precio", "Riesgo local", "Enlaces internos"]
    },
    "pt-br": {
      prefix: "Importação USB-C",
      clusterName: "evidência de carregamento USB-C",
      summary: "Esta página planejada pertence ao primeiro grupo de 110 URLs sobre produtos USB-C importados.",
      meta: "Promessas do vendedor, evidências, variantes, preço real e risco local para produtos USB-C importados.",
      affiliateLabel: "Ver preço atual no AliExpress",
      sections: ["Intenção de busca", "Pacote de evidências", "Riscos de variante e preço", "Risco local", "Links internos"]
    }
  } satisfies Record<Locale, {
    prefix: string;
    clusterName: string;
    summary: string;
    meta: string;
    affiliateLabel: string;
    sections: string[];
  }>;
  return copy[locale];
}

function plannedTypeText(type: ArticleType, locale: Locale) {
  const labels: Record<Locale, Partial<Record<ArticleType, { title: string; h1: string }>>> = {
    en: {
      hub: { title: "hub", h1: "USB-C charger hub" },
      review: { title: "review", h1: "USB-C product review" },
      guide: { title: "guide", h1: "USB-C buying guide" },
      compare: { title: "comparison", h1: "USB-C product comparison" },
      data: { title: "data table", h1: "USB-C evidence data table" },
      lab: { title: "lab note", h1: "USB-C lab note" },
      risk: { title: "country risk", h1: "USB-C import country risk" }
    },
    es: {
      hub: { title: "hub", h1: "Hub de cargadores USB-C" },
      review: { title: "reseña", h1: "Reseña de producto USB-C" },
      guide: { title: "guía", h1: "Guía de compra USB-C" },
      compare: { title: "comparativa", h1: "Comparativa de productos USB-C" },
      risk: { title: "riesgo local", h1: "Riesgo local de importación USB-C" }
    },
    "pt-br": {
      hub: { title: "hub", h1: "Hub de carregadores USB-C" },
      review: { title: "análise", h1: "Análise de produto USB-C" },
      guide: { title: "guia", h1: "Guia de compra USB-C" },
      compare: { title: "comparativo", h1: "Comparativo de produtos USB-C" },
      risk: { title: "risco local", h1: "Risco local de importação USB-C" }
    }
  };
  return labels[locale][type] ?? { title: type, h1: type };
}

export const articles: Article[] = draftArticles.map((draft) => {
  const { group, ...article } = draft;
  const alternates = draftArticles
    .filter((candidate) => candidate.group === group)
    .reduce<HreflangMap>((map, candidate) => {
      const href = absoluteUrl(articlePath(candidate), siteUrl);
      map[hreflangKeyForArticle(candidate)] = href;
      return map;
    }, {});

  return {
    ...article,
    internalLinks: buildProgrammaticInternalLinks(draft, draftArticles),
    canonicalUrl: absoluteUrl(articlePath(article), siteUrl),
    hreflangMap: {
      ...alternates,
      "x-default": absoluteUrl("/", siteUrl)
    }
  };
});

export function findArticle(locale: Locale, type: ArticleType, slug: string) {
  return articles.find((article) => article.locale === locale && article.type === type && article.slug === slug);
}

export function findProduct(productId?: string) {
  return productId ? products.find((product) => product.id === productId) : undefined;
}

export function articlesByLocale(locale: Locale) {
  return articles.filter((article) => article.locale === locale);
}

export function indexedArticles() {
  return articles.filter((article) => article.indexStatus === "index" && article.publishStatus === "published");
}
