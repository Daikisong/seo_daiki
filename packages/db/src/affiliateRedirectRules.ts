export {
  affiliatePlacementApprovalBlocker,
  affiliateRedirectBlocker
} from "./affiliateRedirectBlockers";
export { affiliateClickInputFromPlacement } from "./affiliateRedirectClickInputs";
export {
  allowedDomainList,
  hasSponsoredNofollow,
  hostMatchesDomain,
  isAllowedMerchantUrl
} from "./affiliateRedirectDomainRules";
export type {
  AffiliateMerchantPolicy,
  AffiliateOfferPolicy,
  AffiliatePlacementPolicy,
  AffiliateRedirectTracking,
  RedirectBlocker
} from "./affiliateRedirectTypes";
