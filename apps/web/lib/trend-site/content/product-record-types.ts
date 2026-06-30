import type { EvidenceLevel, Product } from "../types";

export type ProductRecord = {
  name: string;
  exactVariant: string;
  brandClaim: string;
  rankLabel: string;
  watts: string;
  price: number;
  priceLabel: string;
  priceCountry?: string;
  priceCurrency?: string;
  riskCountry?: string;
  verifiedClaimType?: string;
  verifiedClaimUnit?: string;
  productRole?: "main" | "accessory";
  // TODO(pipeline): Replace placeholder search URLs with approved affiliate product URLs from the merchant feed/API.
  // Marketplace search URLs are useful for local mockups, but they can fail, redirect oddly, or land on irrelevant items.
  merchantUrl: string;
  merchantUrlKind: Product["merchantUrlKind"];
  sourceUrl: string;
  sourceLabel: string;
  reviewSourceUrl: string;
  reviewSourceLabel: string;
  marketplaceSourceLabel: string;
  priceCheckedAt: string;
  // TODO(pipeline): Product images are currently temporary official/review-page URLs.
  // The production pipeline must replace them with merchant/affiliate-feed image URLs and fail publishing if missing.
  imageUrl: string;
  imageAlt: string;
  productKind?: string;
  regionFit: string;
  coolingCapacity?: string;
  hoseType?: string;
  noiseLevel?: string;
  roomSize?: string;
  voltagePlug?: string;
  returnRiskLabel: string;
  specSummary: string;
  reviewSummary: string;
  safetyNote: string;
  bestFor: string;
  decision: ProductDecisionCopy;
  keyCheck: string;
  keyFeatures: string[];
  bestTake: string;
  pros: string[];
  cons: string[];
  reviewCount: number;
  certificationRisk: string;
  returnRisk: string;
};

export type ProductDecisionCopy = {
  // This block represents generated editorial output from the content layer.
  // React components must render it as data and must not synthesize missing buyer-facing prose.
  evidenceLevel: EvidenceLevel;
  evidenceBasis: string;
  whyRecommend: string;
  whoFits: string;
  whoShouldSkip: string;
  repeatedComplaints: string[];
  warrantyReturnNote: string;
  marketplaceNote: string;
};
