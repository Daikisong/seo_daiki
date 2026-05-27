import assert from "node:assert/strict";
import {
  evidencePackCreateData,
  groupWorkerPacksByProduct,
  marketRiskCreateData,
  priceSnapshotCreateData,
  productImportContext,
  productUpsertData,
  refreshSuggestionInput,
  reviewSignalCreateData,
  searchConsoleMetricInput,
  sellerClaimCreateData,
  uniqueMarketRisks,
  uniquePriceSnapshots,
  uniqueReviewSignals,
  uniqueSellerClaims,
  uniqueVariants,
  uniqueVerifiedClaims,
  variantCreateData,
  verifiedClaimCreateData,
  type WorkerPack
} from "../packages/db/src/workerImportRecords";
import { groupWorkerPacksByProduct as splitGroupWorkerPacksByProduct } from "../packages/db/src/workerImportCollections";
import { sellerClaimCreateData as splitSellerClaimCreateData } from "../packages/db/src/workerImportEvidenceRecords";
import { variantCreateData as splitVariantCreateData } from "../packages/db/src/workerImportProductRecords";
import { searchConsoleMetricInput as splitSearchConsoleMetricInput } from "../packages/db/src/workerImportSearchConsoleRecords";

assert.equal(groupWorkerPacksByProduct, splitGroupWorkerPacksByProduct);
assert.equal(variantCreateData, splitVariantCreateData);
assert.equal(sellerClaimCreateData, splitSellerClaimCreateData);
assert.equal(searchConsoleMetricInput, splitSearchConsoleMetricInput);

const packs: WorkerPack[] = [
  {
    product_id: "prod-1",
    locale: "en",
    product: {
      title: "Baseus 65W GaN Charger",
      category: "usb-c-chargers",
      source_url: "https://example.com/source/baseus",
      seller: "Baseus Store",
      currency: "USD",
      price: "19.99",
      shipping: "2.50",
      captured_at: "2026-05-27T00:00:00.000Z"
    },
    variants: [
      {
        option: "65W EU with cable",
        source_sku: "sku-eu",
        affiliate_url: "https://example.com/go/baseus",
        risk_flags: ["plug_mismatch"]
      },
      { option: "65W EU with cable", source_sku: "sku-eu" },
      { optionName: "45W US no cable", sellerId: "seller-1" }
    ],
    seller_claims: [
      { claim_type: "wattage", claim_value: "65W", raw_text: "Seller says 65W", captured_at: "2026-05-26" },
      { claim_type: "wattage", claim_value: "65W", raw_text: "Seller says 65W" }
    ],
    verified_claims: [
      { test_type: "wattage", result_value: "61", unit: "W", method: "USB meter", tested_at: "2026-05-26" },
      { testType: "temperature", resultValue: "warm" }
    ],
    review_signals: [
      { locale: "en", topic: "heat", sentiment: "negative", count: "4", confidence: "0.7", window: "30d" },
      { locale: "en", topic: "heat", sentiment: "negative", window: "30d" }
    ],
    price_snapshots: [
      { country: "US", currency: "USD", price: "18", shipping: "2", final_price: "20", captured_at: "2026-05-26" },
      { country: "US", currency: "USD", price: "18", shipping: "2", final_price: "20" }
    ],
    market_risks: [
      { locale: "en", country: "US", plug_risk: "low", returnRisk: "medium", score: "0.6" },
      { locale: "en", country: "US", customs_risk: "low" }
    ]
  },
  { product_id: "prod-1", locale: "es", product: { title: "Ignored duplicate product title" } },
  { product_id: "", locale: "en" },
  { product_id: "prod-2", product: { title: "" } }
];

const grouped = groupWorkerPacksByProduct(packs);
assert.equal(grouped.size, 2);
assert.equal(grouped.get("prod-1")?.length, 2);
assert.equal(grouped.has(""), false);

const context = productImportContext("prod-1", grouped.get("prod-1") ?? []);
assert.equal(context.title, "Baseus 65W GaN Charger");
assert.equal(context.slug, "baseus-65w-gan-charger");
assert.equal(context.category, "usb-c-chargers");
assert.equal(context.brandClaim, "Baseus");
assert.deepEqual(productUpsertData(context), {
  canonicalName: "Baseus 65W GaN Charger",
  slug: "baseus-65w-gan-charger",
  category: "usb-c-chargers",
  brandClaim: "Baseus",
  identityConfidence: 0.7
});

const fallbackContext = productImportContext("prod-2", grouped.get("prod-2") ?? []);
assert.equal(fallbackContext.title, "prod-2");
assert.equal(fallbackContext.slug, "prod-2");
assert.equal(fallbackContext.category, "uncategorized");

const productPacks = grouped.get("prod-1") ?? [];
assert.equal(uniqueVariants(productPacks).length, 2);
assert.equal(uniqueSellerClaims(productPacks).length, 1);
assert.equal(uniqueVerifiedClaims(productPacks).length, 2);
assert.equal(uniqueReviewSignals(productPacks).length, 1);
assert.equal(uniquePriceSnapshots(productPacks).length, 1);
assert.equal(uniqueMarketRisks(productPacks).length, 1);

const variant = variantCreateData("prod-1", context.product, uniqueVariants(productPacks)[0] ?? {});
assert.equal(variant.productId, "prod-1");
assert.equal(variant.optionName, "65W EU with cable");
assert.equal(variant.wattageClaim, 65);
assert.equal(variant.plugType, "EU");
assert.equal(variant.cableIncluded, true);
assert.equal(variant.sourceUrl, "https://example.com/source/baseus");
assert.equal(variant.affiliateUrl, "https://example.com/go/baseus");
assert.deepEqual(variant.riskFlags, ["plug_mismatch"]);

const sellerClaim = sellerClaimCreateData("prod-1", context.product, uniqueSellerClaims(productPacks)[0] ?? {});
assert.equal(sellerClaim.claimType, "wattage");
assert.equal(sellerClaim.claimValue, "65W");
assert.equal(sellerClaim.sourceUrl, "https://example.com/source/baseus");
assert.equal(sellerClaim.capturedAt.toISOString().slice(0, 10), "2026-05-26");

const verified = verifiedClaimCreateData("prod-1", uniqueVerifiedClaims(productPacks)[0] ?? {});
assert.equal(verified.testType, "wattage");
assert.equal(verified.resultValue, "61");
assert.equal(verified.method, "USB meter");
assert.equal(verified.testedAt?.toISOString().slice(0, 10), "2026-05-26");

const reviewSignal = reviewSignalCreateData("prod-1", uniqueReviewSignals(productPacks)[0] ?? {});
assert.equal(reviewSignal.locale, "en");
assert.equal(reviewSignal.topic, "heat");
assert.equal(reviewSignal.count, 4);
assert.equal(reviewSignal.confidence, 0.7);

const price = priceSnapshotCreateData("prod-1", context.product, uniquePriceSnapshots(productPacks)[0] ?? {});
assert.equal(price.currency, "USD");
assert.equal(price.price, 18);
assert.equal(price.shipping, 2);
assert.equal(price.finalPrice, 20);
assert.equal(price.capturedAt.toISOString().slice(0, 10), "2026-05-26");

const risk = marketRiskCreateData("prod-1", uniqueMarketRisks(productPacks)[0] ?? {});
assert.equal(risk.locale, "en");
assert.equal(risk.country, "US");
assert.equal(risk.plugRisk, "low");
assert.equal(risk.returnRisk, "medium");
assert.equal(risk.score, 0.6);

const evidencePack = evidencePackCreateData("prod-1", productPacks[0] as WorkerPack);
assert.equal(evidencePack.locale, "en");
assert.equal(evidencePack.productId, "prod-1");
assert.equal(typeof evidencePack.packJson, "object");

assert.deepEqual(
  searchConsoleMetricInput({
    page: "/us/en/posts/magnesium-sleep/",
    query: "magnesium sleep",
    country: "usa",
    device: "mobile",
    clicks: "3",
    impressions: "240",
    ctr: "0.0125",
    position: "14.2",
    start_date: "2026-05-01",
    endDate: "2026-05-27"
  }),
  {
    page: "/us/en/posts/magnesium-sleep/",
    query: "magnesium sleep",
    country: "usa",
    device: "mobile",
    clicks: 3,
    impressions: 240,
    ctr: 0.0125,
    position: 14.2,
    startDate: "2026-05-01",
    endDate: "2026-05-27"
  }
);

assert.deepEqual(
  refreshSuggestionInput({
    page: "/us/en/posts/magnesium-sleep/",
    query: "magnesium sleep",
    reason: "",
    action: ["rewrite_title"],
    priority: "9",
    missing_sections: [{ heading: "Evidence" }]
  }),
  {
    page: "/us/en/posts/magnesium-sleep/",
    query: "magnesium sleep",
    reason: "Search Console underperformance",
    actions: {
      action: ["rewrite_title"],
      priority: 9,
      country: undefined,
      device: undefined,
      diagnostics: undefined,
      missing_sections: [{ heading: "Evidence" }],
      title_candidate: undefined,
      meta_description_candidate: undefined,
      internal_link_candidates: []
    }
  }
);

console.log("Worker import record unit tests passed");
