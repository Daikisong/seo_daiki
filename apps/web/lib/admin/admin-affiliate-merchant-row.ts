import { stringArrayFromUnknown } from "./admin-section-utils";
import type { AffiliateMerchantRowSource } from "./admin-affiliate-row-types";

export function affiliateMerchantRow(merchant: AffiliateMerchantRowSource) {
  return {
    id: merchant.id,
    name: merchant.name,
    slug: merchant.slug,
    domain: merchant.domain,
    merchantType: merchant.merchantType,
    allowedDomains: stringArrayFromUnknown(merchant.allowedDomains),
    defaultRel: merchant.defaultRel,
    healthSensitive: merchant.healthSensitive,
    enabled: merchant.enabled,
    offerCount: merchant._count.offers,
    clickCount: merchant._count.affiliateClicks
  };
}
