import type { Product } from "../types";
import type { ProductRecord } from "./product-record-types";

export function recordsToProducts(records: ProductRecord[], idPrefix: string, category: string): Product[] {
  return records.map((record, index) => {
    const id = `${idPrefix}-${index + 1}`;
    return productRecordToProduct(record, id, category);
  });
}

export function productRecordToProduct(record: ProductRecord, id: string, category: string): Product {
  const decision = record.decision;
  return {
    id,
    canonicalName: record.name,
    exactVariant: record.exactVariant,
    category,
    productRole: record.productRole ?? "main",
    brandClaim: record.brandClaim,
    merchantUrl: record.merchantUrl,
    merchantUrlKind: record.merchantUrlKind,
    sourceUrl: record.sourceUrl,
    sourceLabel: record.sourceLabel,
    reviewSourceUrl: record.reviewSourceUrl,
    reviewSourceLabel: record.reviewSourceLabel,
    marketplaceSourceLabel: record.marketplaceSourceLabel,
    priceCheckedAt: record.priceCheckedAt,
    // TODO(pipeline): Do not synthesize numeric or generic placeholder images here.
    // Affiliate product ingestion should provide the canonical product image with the final deep link.
    imageUrl: record.imageUrl,
    imageAlt: record.imageAlt,
    priceLabel: record.priceLabel,
    productKind: record.productKind,
    regionFit: record.regionFit,
    coolingCapacity: record.coolingCapacity,
    hoseType: record.hoseType,
    noiseLevel: record.noiseLevel,
    roomSize: record.roomSize,
    voltagePlug: record.voltagePlug,
    returnRiskLabel: record.returnRiskLabel,
    evidenceLevel: decision.evidenceLevel,
    evidenceBasis: decision.evidenceBasis,
    specSummary: record.specSummary,
    reviewSummary: record.reviewSummary,
    safetyNote: record.safetyNote,
    bestFor: record.bestFor,
    whyRecommend: decision.whyRecommend,
    whoFits: decision.whoFits,
    whoShouldSkip: decision.whoShouldSkip,
    repeatedComplaints: decision.repeatedComplaints,
    warrantyReturnNote: decision.warrantyReturnNote,
    marketplaceNote: decision.marketplaceNote,
    keyCheck: record.keyCheck,
    keyFeatures: record.keyFeatures,
    editorialRankLabel: record.rankLabel,
    expertReviewTake: record.bestTake,
    editorialPros: record.pros,
    editorialCons: record.cons,
    verifiedClaims: [
      {
        id: `${id}-${record.verifiedClaimType ?? "verified-output"}`,
        productId: id,
        testType: record.verifiedClaimType ?? "output",
        resultValue: record.watts,
        unit: record.verifiedClaimUnit ?? "W"
      }
    ],
    priceSnapshots: [
      {
        id: `${id}-price-${(record.priceCountry ?? "US").toLowerCase()}`,
        productId: id,
        country: record.priceCountry ?? "US",
        currency: record.priceCurrency ?? "USD",
        price: record.price,
        finalPrice: record.price
      }
    ],
    reviewSignals: [
      {
        id: `${id}-reviews`,
        productId: id,
        locale: "en",
        topic: "review depth, spec clarity, heat behavior, and variant accuracy",
        count: record.reviewCount
      }
    ],
    marketRisks: [
      {
        id: `${id}-risk-${(record.riskCountry ?? record.priceCountry ?? "US").toLowerCase()}`,
        productId: id,
        locale: "en",
        country: record.riskCountry ?? record.priceCountry ?? "US",
        certificationRisk: record.certificationRisk,
        returnRisk: record.returnRisk
      }
    ]
  };
}
