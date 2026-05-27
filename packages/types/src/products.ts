import type { Locale } from "./locales";
import type {
  MarketRisk,
  PriceSnapshot,
  ReviewSignal,
  SellerClaim,
  VerifiedClaim
} from "./product-evidence";
import type { Variant } from "./product-variants";

export type { MarketRisk, PriceSnapshot, ReviewSignal, SellerClaim, VerifiedClaim } from "./product-evidence";
export type { Variant } from "./product-variants";

export interface Product {
  id: string;
  canonicalName: string;
  slug: string;
  category: string;
  brandClaim?: string;
  identityConfidence: number;
  imageHash?: string;
  variants: Variant[];
  sellerClaims: SellerClaim[];
  verifiedClaims: VerifiedClaim[];
  reviewSignals: ReviewSignal[];
  priceSnapshots: PriceSnapshot[];
  marketRisks: MarketRisk[];
}

export interface EvidencePack {
  id: string;
  productId?: string;
  locale: Locale;
  packJson: {
    product?: Pick<Product, "id" | "canonicalName" | "slug" | "category">;
    variants: Variant[];
    sellerClaims: SellerClaim[];
    verifiedClaims: VerifiedClaim[];
    reviewSignals: ReviewSignal[];
    priceSnapshots: PriceSnapshot[];
    marketRisks: MarketRisk[];
    allowedClaims: string[];
    forbiddenClaims: string[];
  };
  createdAt: string;
}
