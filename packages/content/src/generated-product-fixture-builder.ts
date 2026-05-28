import type { Locale, Product } from "@global-import-lab/types";
import type { GeneratedProductSpec } from "./generated-product-fixture-types";

export function generatedSampleProduct(spec: GeneratedProductSpec, updatedAt: string): Product {
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
