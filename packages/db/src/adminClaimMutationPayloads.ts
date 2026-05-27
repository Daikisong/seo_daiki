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
