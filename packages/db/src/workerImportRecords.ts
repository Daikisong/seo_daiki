import type { Prisma } from "./generated/prisma/client";
import {
  claimKey,
  dateValue,
  inferBrand,
  numberValue,
  parseCableIncluded,
  parsePlugType,
  parseWattage,
  priceKey,
  refreshSuggestionPayload,
  riskKey,
  signalKey,
  slugify,
  stringValue,
  uniqueRows,
  variantKey,
  verifiedClaimKey
} from "./workerImportParsing";

export interface WorkerPack {
  product_id?: string;
  locale?: string;
  product?: Record<string, unknown>;
  variants?: Array<Record<string, unknown>>;
  seller_claims?: Array<Record<string, unknown>>;
  verified_claims?: Array<Record<string, unknown>>;
  review_signals?: Array<Record<string, unknown>>;
  price_snapshots?: Array<Record<string, unknown>>;
  market_risks?: Array<Record<string, unknown>>;
  allowed_claims?: string[];
  forbidden_claims?: string[];
}

export interface ImportSummary {
  products: number;
  variants: number;
  sellerClaims: number;
  verifiedClaims: number;
  reviewSignals: number;
  priceSnapshots: number;
  marketRisks: number;
  evidencePacks: number;
}

export interface ProductImportContext {
  product: Record<string, unknown>;
  title: string;
  slug: string;
  category: string;
  brandClaim: string | undefined;
  identityConfidence: number;
}

export const emptyWorkerImportSummary: ImportSummary = {
  products: 0,
  variants: 0,
  sellerClaims: 0,
  verifiedClaims: 0,
  reviewSignals: 0,
  priceSnapshots: 0,
  marketRisks: 0,
  evidencePacks: 0
};

export function groupWorkerPacksByProduct(packs: WorkerPack[]) {
  const byProduct = new Map<string, WorkerPack[]>();
  for (const pack of packs) {
    const productId = stringValue(pack.product_id);
    if (!productId) {
      continue;
    }
    byProduct.set(productId, [...(byProduct.get(productId) ?? []), pack]);
  }
  return byProduct;
}

export function productImportContext(productId: string, productPacks: WorkerPack[]): ProductImportContext {
  const product = productPacks.find((pack) => pack.product)?.product ?? {};
  const title = stringValue(product.title) || productId;
  return {
    product,
    title,
    slug: slugify(title) || productId,
    category: stringValue(product.category) || "uncategorized",
    brandClaim: inferBrand(title),
    identityConfidence: 0.7
  };
}

export function productUpsertData(context: ProductImportContext) {
  return {
    canonicalName: context.title,
    slug: context.slug,
    category: context.category,
    brandClaim: context.brandClaim,
    identityConfidence: context.identityConfidence
  };
}

export function uniqueVariants(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.variants ?? []), variantKey);
}

export function uniqueSellerClaims(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.seller_claims ?? []), claimKey);
}

export function uniqueVerifiedClaims(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.verified_claims ?? []), verifiedClaimKey);
}

export function uniqueReviewSignals(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.review_signals ?? []), signalKey);
}

export function uniquePriceSnapshots(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.price_snapshots ?? []), priceKey);
}

export function uniqueMarketRisks(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.market_risks ?? []), riskKey);
}

export function variantCreateData(productId: string, product: Record<string, unknown>, variant: Record<string, unknown>) {
  const optionName = stringValue(variant.option) || stringValue(variant.optionName) || "Default option";
  return {
    productId,
    sourceSku: stringValue(variant.source_sku) || stringValue(variant.sourceSku) || undefined,
    optionName,
    wattageClaim: numberValue(variant.wattage_claim) ?? parseWattage(optionName),
    plugType: stringValue(variant.plug_type) || parsePlugType(optionName) || undefined,
    cableIncluded: parseCableIncluded(optionName),
    sourceUrl: stringValue(variant.source_url) || stringValue(product.source_url) || "https://example.com/source",
    affiliateUrl: stringValue(variant.affiliate_url) || stringValue(variant.affiliateUrl) || undefined,
    sellerName: stringValue(product.seller) || undefined,
    sellerId: stringValue(variant.seller_id) || stringValue(variant.sellerId) || undefined,
    riskFlags: toJson(variant.risk_flags ?? [])
  };
}

export function sellerClaimCreateData(productId: string, product: Record<string, unknown>, claim: Record<string, unknown>) {
  return {
    productId,
    claimType: stringValue(claim.claim_type) || "seller_claim",
    claimValue: stringValue(claim.claim_value) || "unknown",
    rawText: stringValue(claim.raw_text) || undefined,
    sourceUrl: stringValue(claim.source_url) || stringValue(product.source_url) || undefined,
    capturedAt: dateValue(claim.captured_at) ?? dateValue(product.captured_at) ?? new Date(),
    confidence: numberValue(claim.confidence) ?? 0.5
  };
}

export function verifiedClaimCreateData(productId: string, claim: Record<string, unknown>) {
  return {
    productId,
    testType: stringValue(claim.test_type) || stringValue(claim.testType) || "verification",
    resultValue: stringValue(claim.result_value) || stringValue(claim.resultValue) || "unknown",
    unit: stringValue(claim.unit) || undefined,
    method: stringValue(claim.method) || "Worker import",
    evidenceUrl: stringValue(claim.evidence_url) || stringValue(claim.evidenceUrl) || undefined,
    confidence: numberValue(claim.confidence) ?? 0.8,
    testedAt: dateValue(claim.tested_at) ?? dateValue(claim.testedAt) ?? undefined
  };
}

export function reviewSignalCreateData(productId: string, signal: Record<string, unknown>) {
  return {
    productId,
    locale: stringValue(signal.locale) || "en",
    topic: stringValue(signal.topic) || "review signal",
    sentiment: stringValue(signal.sentiment) || "neutral",
    count: numberValue(signal.count) ?? 0,
    confidence: numberValue(signal.confidence) ?? 0.5,
    window: stringValue(signal.window) || undefined
  };
}

export function priceSnapshotCreateData(
  productId: string,
  product: Record<string, unknown>,
  snapshot: Record<string, unknown>
) {
  return {
    productId,
    country: stringValue(snapshot.country) || undefined,
    currency: stringValue(snapshot.currency) || stringValue(product.currency) || "USD",
    price: numberValue(snapshot.price) ?? numberValue(product.price) ?? 0,
    shipping: numberValue(snapshot.shipping) ?? numberValue(product.shipping) ?? undefined,
    coupon: numberValue(snapshot.coupon) ?? undefined,
    finalPrice: numberValue(snapshot.final_price) ?? numberValue(snapshot.finalPrice) ?? undefined,
    capturedAt: dateValue(snapshot.captured_at) ?? dateValue(product.captured_at) ?? new Date()
  };
}

export function marketRiskCreateData(productId: string, risk: Record<string, unknown>) {
  return {
    productId,
    locale: stringValue(risk.locale) || "en",
    country: stringValue(risk.country) || undefined,
    plugRisk: stringValue(risk.plug_risk) || stringValue(risk.plugRisk) || undefined,
    customsRisk: stringValue(risk.customs_risk) || stringValue(risk.customsRisk) || undefined,
    certificationRisk: stringValue(risk.certification_risk) || stringValue(risk.certificationRisk) || undefined,
    returnRisk: stringValue(risk.return_risk) || stringValue(risk.returnRisk) || undefined,
    localAlternativeNote: stringValue(risk.local_alternative_note) || stringValue(risk.localAlternativeNote) || undefined,
    score: numberValue(risk.score) ?? 0.5
  };
}

export function evidencePackCreateData(productId: string, pack: WorkerPack) {
  return {
    productId,
    locale: stringValue(pack.locale) || "en",
    packJson: toJson(pack)
  };
}

export function searchConsoleMetricInput(row: Record<string, unknown>) {
  return {
    page: stringValue(row.page),
    query: stringValue(row.query),
    country: stringValue(row.country) || undefined,
    device: stringValue(row.device) || undefined,
    clicks: numberValue(row.clicks) ?? 0,
    impressions: numberValue(row.impressions) ?? 0,
    ctr: numberValue(row.ctr) ?? 0,
    position: numberValue(row.position) ?? 0,
    startDate: stringValue(row.start_date) || stringValue(row.startDate) || undefined,
    endDate: stringValue(row.end_date) || stringValue(row.endDate) || undefined
  };
}

export function refreshSuggestionInput(row: Record<string, unknown>) {
  return {
    page: stringValue(row.page),
    query: stringValue(row.query) || undefined,
    reason: stringValue(row.reason) || "Search Console underperformance",
    actions: refreshSuggestionPayload(row)
  };
}

export function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
