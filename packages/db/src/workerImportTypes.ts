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
