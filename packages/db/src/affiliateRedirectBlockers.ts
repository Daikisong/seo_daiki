import { hasSponsoredNofollow, isAllowedMerchantUrl } from "./affiliateRedirectDomainRules";
import type {
  AffiliateOfferPolicy,
  AffiliatePlacementPolicy,
  RedirectBlocker
} from "./affiliateRedirectTypes";

export function affiliateRedirectBlocker(placement: AffiliatePlacementPolicy): RedirectBlocker | undefined {
  if (placement.status !== "approved") {
    return { message: "Affiliate placement is not approved.", status: 403 };
  }
  if (!hasSponsoredNofollow(placement.rel)) {
    return { message: "Affiliate placement rel must include sponsored and nofollow.", status: 403 };
  }
  if (!placement.disclosureShown) {
    return { message: "Affiliate placement must confirm disclosure before redirecting.", status: 403 };
  }

  return affiliateOfferPolicyBlocker(placement.offer, 403);
}

export function affiliatePlacementApprovalBlocker(
  placement: AffiliatePlacementPolicy,
  nextDisclosureShown = placement.disclosureShown
): RedirectBlocker | undefined {
  if (!hasSponsoredNofollow(placement.rel)) {
    return { message: "Affiliate placement rel must include sponsored and nofollow before approval.", status: 400 };
  }
  if (!nextDisclosureShown) {
    return { message: "Affiliate placement disclosure must be confirmed before approval.", status: 400 };
  }

  return affiliateOfferPolicyBlocker(placement.offer, 400, "before placement approval");
}

function affiliateOfferPolicyBlocker(
  offer: AffiliateOfferPolicy,
  status: number,
  suffix?: "before placement approval"
): RedirectBlocker | undefined {
  if (offer.status !== "active") {
    return {
      message: suffix ? `Affiliate offer must be active ${suffix}.` : "Affiliate offer is not active.",
      status
    };
  }
  if (!offer.merchant.enabled) {
    return {
      message: suffix ? `Affiliate merchant must be enabled ${suffix}.` : "Affiliate merchant is disabled.",
      status
    };
  }
  if (!isAllowedMerchantUrl(offer.affiliateUrl, offer.merchant.allowedDomains)) {
    return {
      message: "Affiliate URL host is not allowed for this merchant.",
      status
    };
  }
  return undefined;
}
