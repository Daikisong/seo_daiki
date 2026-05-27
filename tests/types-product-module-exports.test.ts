import assert from "node:assert/strict";
import type {
  EvidencePack,
  MarketRisk,
  PriceSnapshot,
  Product,
  ReviewSignal,
  SellerClaim,
  Variant,
  VerifiedClaim
} from "@global-import-lab/types";
import type {
  MarketRisk as DirectMarketRisk,
  PriceSnapshot as DirectPriceSnapshot,
  ReviewSignal as DirectReviewSignal,
  SellerClaim as DirectSellerClaim,
  VerifiedClaim as DirectVerifiedClaim
} from "@global-import-lab/types/product-evidence";
import type { Variant as DirectVariant } from "@global-import-lab/types/product-variants";
import type {
  MarketRisk as ProductModuleMarketRisk,
  PriceSnapshot as ProductModulePriceSnapshot,
  ReviewSignal as ProductModuleReviewSignal,
  SellerClaim as ProductModuleSellerClaim,
  Variant as ProductModuleVariant,
  VerifiedClaim as ProductModuleVerifiedClaim
} from "@global-import-lab/types/products";

const variant = {
  id: "variant-1",
  productId: "product-1",
  optionName: "65W EU",
  sourceUrl: "https://example.com/product"
} satisfies Variant satisfies DirectVariant satisfies ProductModuleVariant;

const sellerClaim = {
  id: "seller-claim-1",
  productId: "product-1",
  claimType: "wattage",
  claimValue: "65W",
  capturedAt: "2026-05-28",
  confidence: 0.7
} satisfies SellerClaim satisfies DirectSellerClaim satisfies ProductModuleSellerClaim;

const verifiedClaim = {
  id: "verified-claim-1",
  productId: "product-1",
  testType: "load",
  resultValue: "61",
  method: "USB meter",
  confidence: 0.8
} satisfies VerifiedClaim satisfies DirectVerifiedClaim satisfies ProductModuleVerifiedClaim;

const reviewSignal = {
  id: "review-1",
  productId: "product-1",
  locale: "en",
  topic: "heat",
  sentiment: "negative",
  count: 4,
  confidence: 0.7
} satisfies ReviewSignal satisfies DirectReviewSignal satisfies ProductModuleReviewSignal;

const priceSnapshot = {
  id: "price-1",
  productId: "product-1",
  currency: "USD",
  price: 19.99,
  capturedAt: "2026-05-28"
} satisfies PriceSnapshot satisfies DirectPriceSnapshot satisfies ProductModulePriceSnapshot;

const marketRisk = {
  id: "risk-1",
  productId: "product-1",
  locale: "en",
  country: "US",
  score: 0.4
} satisfies MarketRisk satisfies DirectMarketRisk satisfies ProductModuleMarketRisk;

const product = {
  id: "product-1",
  canonicalName: "USB-C Charger",
  slug: "usb-c-charger",
  category: "charger",
  identityConfidence: 0.9,
  variants: [variant],
  sellerClaims: [sellerClaim],
  verifiedClaims: [verifiedClaim],
  reviewSignals: [reviewSignal],
  priceSnapshots: [priceSnapshot],
  marketRisks: [marketRisk]
} satisfies Product;

const evidencePack = {
  id: "evidence-pack-1",
  productId: product.id,
  locale: "en",
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
    reviewSignals: product.reviewSignals,
    priceSnapshots: product.priceSnapshots,
    marketRisks: product.marketRisks,
    allowedClaims: [],
    forbiddenClaims: []
  },
  createdAt: "2026-05-28T00:00:00.000Z"
} satisfies EvidencePack;

assert.equal(evidencePack.packJson.product?.id, product.id);
console.log("Types product module export tests passed");
