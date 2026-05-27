import assert from "node:assert/strict";
import {
  evidencePackJsonTextareaValue,
  evidenceRecordReturnTo,
  labEvidenceAssetOptionLabel,
  productOptionRows,
  verifiedClaimOptionLabel,
  verifiedClaimOptionRows
} from "../apps/web/lib/admin/admin-evidence-form-model";

const products = [
  {
    id: "product-1",
    canonicalName: "65W GaN Charger",
    verifiedClaims: [
      { id: "claim-1", testType: "sustained_output", resultValue: "63", unit: "W" },
      { id: "claim-2", testType: "thermal_run", resultValue: "pass" }
    ]
  },
  {
    id: "product-2",
    canonicalName: "100W USB-C Cable",
    verifiedClaims: [{ id: "claim-3", testType: "e-marker", resultValue: "present", unit: null }]
  }
];

assert.deepEqual(productOptionRows(products), [
  { value: "product-1", label: "65W GaN Charger" },
  { value: "product-2", label: "100W USB-C Cable" }
]);

assert.deepEqual(verifiedClaimOptionRows(products), [
  { id: "claim-1", label: "65W GaN Charger: sustained_output 63 W" },
  { id: "claim-2", label: "65W GaN Charger: thermal_run pass" },
  { id: "claim-3", label: "100W USB-C Cable: e-marker present" }
]);

assert.equal(
  verifiedClaimOptionLabel("Power bank", { testType: "capacity", resultValue: "9500", unit: "mAh" }),
  "Power bank: capacity 9500 mAh"
);
assert.equal(
  labEvidenceAssetOptionLabel({ fileName: "load-test.csv", measurementType: "sustained_output" }),
  "load-test.csv - sustained_output"
);

assert.deepEqual(evidenceRecordReturnTo, {
  product: "/admin/products/",
  variant: "/admin/products/",
  sellerClaim: "/admin/evidence/",
  verifiedClaim: "/admin/evidence/",
  marketRisk: "/admin/evidence/",
  evidencePack: "/admin/evidence/"
});

assert.match(evidencePackJsonTextareaValue(), /"allowedClaims": \[\]/);
assert.equal(evidencePackJsonTextareaValue({ allowedClaims: ["verified wattage"] }), '{\n  "allowedClaims": [\n    "verified wattage"\n  ]\n}');

console.log("Admin evidence form model unit tests passed");
