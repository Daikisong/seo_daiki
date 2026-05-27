import assert from "node:assert/strict";
import {
  affiliateClickInputFromPlacement,
  affiliatePlacementApprovalBlocker,
  affiliateRedirectBlocker,
  allowedDomainList,
  hasSponsoredNofollow,
  hostMatchesDomain,
  isAllowedMerchantUrl
} from "../packages/db/src/affiliateRedirectRules";
import {
  affiliatePlacementApprovalBlocker as directAffiliatePlacementApprovalBlocker,
  affiliateRedirectBlocker as directAffiliateRedirectBlocker
} from "../packages/db/src/affiliateRedirectBlockers";
import { affiliateClickInputFromPlacement as directAffiliateClickInputFromPlacement } from "../packages/db/src/affiliateRedirectClickInputs";
import {
  allowedDomainList as directAllowedDomainList,
  hasSponsoredNofollow as directHasSponsoredNofollow,
  hostMatchesDomain as directHostMatchesDomain,
  isAllowedMerchantUrl as directIsAllowedMerchantUrl
} from "../packages/db/src/affiliateRedirectDomainRules";

assert.equal(affiliateRedirectBlocker, directAffiliateRedirectBlocker);
assert.equal(affiliatePlacementApprovalBlocker, directAffiliatePlacementApprovalBlocker);
assert.equal(affiliateClickInputFromPlacement, directAffiliateClickInputFromPlacement);
assert.equal(allowedDomainList, directAllowedDomainList);
assert.equal(hasSponsoredNofollow, directHasSponsoredNofollow);
assert.equal(hostMatchesDomain, directHostMatchesDomain);
assert.equal(isAllowedMerchantUrl, directIsAllowedMerchantUrl);

assert.equal(hasSponsoredNofollow("sponsored nofollow"), true);
assert.equal(isAllowedMerchantUrl("https://shop.example.com/item", ["example.com"]), true);

console.log("Affiliate redirect rule module tests passed");
