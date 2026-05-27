import assert from "node:assert/strict";
import {
  evidencePackMutationData,
  marketRiskMutationData,
  productMutationData,
  sellerClaimMutationData,
  variantMutationData,
  verifiedClaimMutationData
} from "../packages/db/src/adminMutationPayloads";
import {
  sellerClaimMutationData as directSellerClaimMutationData,
  verifiedClaimMutationData as directVerifiedClaimMutationData
} from "../packages/db/src/adminClaimMutationPayloads";
import { evidencePackMutationData as directEvidencePackMutationData } from "../packages/db/src/adminEvidencePackMutationPayloads";
import { marketRiskMutationData as directMarketRiskMutationData } from "../packages/db/src/adminMarketRiskMutationPayloads";
import {
  productMutationData as directProductMutationData,
  variantMutationData as directVariantMutationData
} from "../packages/db/src/adminProductMutationPayloads";

assert.equal(productMutationData, directProductMutationData);
assert.equal(variantMutationData, directVariantMutationData);
assert.equal(sellerClaimMutationData, directSellerClaimMutationData);
assert.equal(verifiedClaimMutationData, directVerifiedClaimMutationData);
assert.equal(marketRiskMutationData, directMarketRiskMutationData);
assert.equal(evidencePackMutationData, directEvidencePackMutationData);

console.log("Admin mutation payload module export tests passed");
