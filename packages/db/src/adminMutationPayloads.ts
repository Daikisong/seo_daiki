import { toJson } from "./adminMutationRules";

export interface ProductMutationInput {
  id?: string;
  canonicalName: string;
  slug: string;
  category: string;
  brandClaim?: string;
  identityConfidence?: number;
  imageHash?: string;
}

export interface VariantMutationInput {
  id?: string;
  productId: string;
  optionName: string;
  sourceUrl: string;
  sourceSku?: string;
  wattageClaim?: number;
  plugType?: string;
  cableIncluded?: boolean;
  affiliateUrl?: string;
  sellerName?: string;
  sellerId?: string;
  riskFlags?: string[];
}

export interface SellerClaimMutationInput {
  id?: string;
  productId: string;
  claimType: string;
  claimValue: string;
  rawText?: string;
  sourceUrl?: string;
  confidence?: number;
}

export interface VerifiedClaimMutationInput {
  id?: string;
  productId: string;
  testType: string;
  resultValue: string;
  unit?: string;
  method: string;
  evidenceUrl?: string;
  confidence?: number;
  testedAt?: Date;
}

export interface MarketRiskMutationInput {
  id?: string;
  productId: string;
  locale: string;
  country?: string;
  plugRisk?: string;
  customsRisk?: string;
  certificationRisk?: string;
  returnRisk?: string;
  localAlternativeNote?: string;
  score?: number;
}

export interface EvidencePackMutationInput {
  id?: string;
  productId?: string;
  locale: string;
  packJson: unknown;
}

export function productMutationData(input: ProductMutationInput) {
  return {
    canonicalName: input.canonicalName,
    slug: input.slug,
    category: input.category,
    brandClaim: input.brandClaim,
    identityConfidence: input.identityConfidence ?? 0.7,
    imageHash: input.imageHash
  };
}

export function variantMutationData(input: VariantMutationInput) {
  return {
    productId: input.productId,
    optionName: input.optionName,
    sourceUrl: input.sourceUrl,
    sourceSku: input.sourceSku,
    wattageClaim: input.wattageClaim,
    plugType: input.plugType,
    cableIncluded: input.cableIncluded,
    affiliateUrl: input.affiliateUrl,
    sellerName: input.sellerName,
    sellerId: input.sellerId,
    riskFlags: toJson(input.riskFlags ?? [])
  };
}

export function sellerClaimMutationData(input: SellerClaimMutationInput) {
  return {
    productId: input.productId,
    claimType: input.claimType,
    claimValue: input.claimValue,
    rawText: input.rawText,
    sourceUrl: input.sourceUrl,
    confidence: input.confidence ?? 0.5
  };
}

export function verifiedClaimMutationData(input: VerifiedClaimMutationInput) {
  return {
    productId: input.productId,
    testType: input.testType,
    resultValue: input.resultValue,
    unit: input.unit,
    method: input.method,
    evidenceUrl: input.evidenceUrl,
    confidence: input.confidence ?? 0.8,
    testedAt: input.testedAt
  };
}

export function marketRiskMutationData(input: MarketRiskMutationInput) {
  return {
    productId: input.productId,
    locale: input.locale,
    country: input.country,
    plugRisk: input.plugRisk,
    customsRisk: input.customsRisk,
    certificationRisk: input.certificationRisk,
    returnRisk: input.returnRisk,
    localAlternativeNote: input.localAlternativeNote,
    score: input.score ?? 0.5
  };
}

export function evidencePackMutationData(input: EvidencePackMutationInput) {
  return {
    productId: input.productId,
    locale: input.locale,
    packJson: toJson(input.packJson)
  };
}
