import assert from "node:assert/strict";
import {
  nullableAdminText,
  productEvidenceSummary,
  productMarketRiskRows,
  productSellerClaimRows,
  productVariantRows,
  productVerifiedClaimRows,
  sellerClaimLabel,
  verifiedClaimLabel
} from "../apps/web/lib/admin/admin-product-evidence-model";
import {
  nullableAdminText as directNullableAdminText,
  sellerClaimLabel as directSellerClaimLabel,
  verifiedClaimLabel as directVerifiedClaimLabel
} from "../apps/web/lib/admin/admin-product-evidence-labels";
import {
  productMarketRiskRows as directProductMarketRiskRows,
  productSellerClaimRows as directProductSellerClaimRows,
  productVariantRows as directProductVariantRows,
  productVerifiedClaimRows as directProductVerifiedClaimRows
} from "../apps/web/lib/admin/admin-product-evidence-rows";
import {
  productEvidenceSummary as directProductEvidenceSummary
} from "../apps/web/lib/admin/admin-product-evidence-summary";

assert.equal(nullableAdminText, directNullableAdminText);
assert.equal(sellerClaimLabel, directSellerClaimLabel);
assert.equal(verifiedClaimLabel, directVerifiedClaimLabel);
assert.equal(productEvidenceSummary, directProductEvidenceSummary);
assert.equal(productVariantRows, directProductVariantRows);
assert.equal(productSellerClaimRows, directProductSellerClaimRows);
assert.equal(productVerifiedClaimRows, directProductVerifiedClaimRows);
assert.equal(productMarketRiskRows, directProductMarketRiskRows);

const products = [
  {
    id: "product-a",
    canonicalName: "Product A",
    variants: [
      { id: "variant-a1", optionName: "US plug" },
      { id: "variant-a2", optionName: "EU plug" }
    ],
    sellerClaims: [{ id: "seller-a1", claimType: "max_output", claimValue: "65W" }],
    verifiedClaims: [{ id: "verified-a1", testType: "sustained_output", resultValue: "60W" }],
    marketRisks: [{ id: "risk-a1", locale: "en", score: 0.4 }]
  },
  {
    id: "product-b",
    canonicalName: "Product B",
    variants: [{ id: "variant-b1", optionName: "Cable" }],
    sellerClaims: [],
    verifiedClaims: [{ id: "verified-b1", testType: "e_marker", resultValue: "Detected" }],
    marketRisks: [
      { id: "risk-b1", locale: "en", score: 0.3 },
      { id: "risk-b2", locale: "es", score: 0.5 }
    ]
  }
];

assert.deepEqual(productEvidenceSummary(products[0]!), ["2 claims", "1 risks", "2 variants"]);
assert.deepEqual(productVariantRows(products).map((row) => `${row.product.id}:${row.variant.id}`), [
  "product-a:variant-a1",
  "product-a:variant-a2",
  "product-b:variant-b1"
]);
assert.deepEqual(productSellerClaimRows(products).map((row) => row.label), ["max_output: 65W"]);
assert.deepEqual(productVerifiedClaimRows(products).map((row) => row.label), [
  "sustained_output: 60W",
  "e_marker: Detected"
]);
assert.deepEqual(productMarketRiskRows(products).map((row) => `${row.product.id}:${row.risk.locale}`), [
  "product-a:en",
  "product-b:en",
  "product-b:es"
]);
assert.equal(sellerClaimLabel({ claimType: "bundle", claimValue: "Cable included" }), "bundle: Cable included");
assert.equal(verifiedClaimLabel({ testType: "temperature", resultValue: "61C" }), "temperature: 61C");
assert.equal(nullableAdminText("asset-id"), "asset-id");
assert.equal(nullableAdminText(null), "-");
assert.equal(nullableAdminText(undefined), "-");

console.log("Admin product evidence model unit tests passed");
