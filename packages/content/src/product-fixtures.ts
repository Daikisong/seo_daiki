import type { Locale, Product } from "@global-import-lab/types";

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

export function generatedProductFixtures(updatedAt: string): Product[] {
  return generatedProductSpecs.map((spec) => generatedSampleProduct(spec, updatedAt));
}

function generatedSampleProduct(spec: GeneratedProductSpec, updatedAt: string): Product {
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
