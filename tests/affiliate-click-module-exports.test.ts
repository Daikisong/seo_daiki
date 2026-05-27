import assert from "node:assert/strict";
import {
  AffiliateRedirectError,
  affiliatePlacementStatuses,
  listAffiliateMerchants as facadeListAffiliateMerchants,
  recordAffiliateClick as facadeRecordAffiliateClick,
  resolveAffiliatePlacementRedirect as facadeResolveAffiliatePlacementRedirect,
  updateAffiliatePlacementStatus as facadeUpdateAffiliatePlacementStatus
} from "@global-import-lab/db/affiliate-clicks";
import { listAffiliateMerchants } from "../packages/db/src/affiliateAdminQueries";
import { recordAffiliateClick } from "../packages/db/src/affiliateClickTracking";
import { resolveAffiliatePlacementRedirect } from "../packages/db/src/affiliatePlacementRedirects";
import { updateAffiliatePlacementStatus } from "../packages/db/src/affiliatePlacementStatus";

assert.equal(facadeRecordAffiliateClick, recordAffiliateClick);
assert.equal(facadeResolveAffiliatePlacementRedirect, resolveAffiliatePlacementRedirect);
assert.equal(facadeListAffiliateMerchants, listAffiliateMerchants);
assert.equal(facadeUpdateAffiliatePlacementStatus, updateAffiliatePlacementStatus);
assert.deepEqual([...affiliatePlacementStatuses], ["draft", "approved", "rejected", "disabled"]);

const error = new AffiliateRedirectError("blocked", 403);
assert.equal(error.name, "AffiliateRedirectError");
assert.equal(error.status, 403);

console.log("Affiliate click module export tests passed");
