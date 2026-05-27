import assert from "node:assert/strict";
import {
  adminFieldValue,
  emptyEvidencePackJson,
  jobButtonLabel
} from "../apps/web/lib/admin/admin-form-utils";

assert.equal(adminFieldValue(undefined), "");
assert.equal(adminFieldValue("saved value"), "saved value");
assert.equal(adminFieldValue(0), 0);

assert.equal(jobButtonLabel("generate_content_brief"), "Queue generate content brief");
assert.equal(jobButtonLabel("sync_hreflang_group"), "Queue sync hreflang group");

const firstPack = emptyEvidencePackJson();
const secondPack = emptyEvidencePackJson();

assert.deepEqual(Object.keys(firstPack), [
  "variants",
  "sellerClaims",
  "verifiedClaims",
  "reviewSignals",
  "priceSnapshots",
  "marketRisks",
  "allowedClaims",
  "forbiddenClaims"
]);

firstPack.allowedClaims.push("verified wattage");

assert.deepEqual(secondPack.allowedClaims, []);
assert.notEqual(firstPack.allowedClaims, secondPack.allowedClaims);

console.log("Admin form utility unit tests passed");
