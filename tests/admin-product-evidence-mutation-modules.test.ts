import assert from "node:assert/strict";
import {
  upsertEvidencePack,
  upsertMarketRisk,
  upsertProduct,
  upsertSellerClaim,
  upsertVariant,
  upsertVerifiedClaim
} from "../packages/db/src/adminProductEvidenceMutations";
import {
  upsertSellerClaim as directUpsertSellerClaim,
  upsertVerifiedClaim as directUpsertVerifiedClaim
} from "../packages/db/src/adminClaimEvidenceMutations";
import {
  upsertEvidencePack as directUpsertEvidencePack,
  upsertMarketRisk as directUpsertMarketRisk
} from "../packages/db/src/adminEvidencePackMutations";
import {
  upsertProduct as directUpsertProduct,
  upsertVariant as directUpsertVariant
} from "../packages/db/src/adminProductVariantMutations";

assert.equal(upsertProduct, directUpsertProduct);
assert.equal(upsertVariant, directUpsertVariant);
assert.equal(upsertSellerClaim, directUpsertSellerClaim);
assert.equal(upsertVerifiedClaim, directUpsertVerifiedClaim);
assert.equal(upsertMarketRisk, directUpsertMarketRisk);
assert.equal(upsertEvidencePack, directUpsertEvidencePack);

console.log("Admin product evidence mutation module tests passed");
