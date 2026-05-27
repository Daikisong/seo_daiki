import assert from "node:assert/strict";
import {
  affiliateMerchantRow,
  affiliateOfferRow,
  affiliatePlacementRow
} from "../apps/web/lib/admin/admin-affiliate-row-model";
import { affiliateMerchantRow as directAffiliateMerchantRow } from "../apps/web/lib/admin/admin-affiliate-merchant-row";
import { affiliateOfferRow as directAffiliateOfferRow } from "../apps/web/lib/admin/admin-affiliate-offer-row";
import { affiliatePlacementRow as directAffiliatePlacementRow } from "../apps/web/lib/admin/admin-affiliate-placement-row";

assert.equal(affiliateMerchantRow, directAffiliateMerchantRow);
assert.equal(affiliateOfferRow, directAffiliateOfferRow);
assert.equal(affiliatePlacementRow, directAffiliatePlacementRow);

assert.deepEqual(
  directAffiliateMerchantRow({
    id: "merchant-1",
    name: "AliExpress",
    slug: "aliexpress",
    domain: "aliexpress.com",
    merchantType: "marketplace",
    allowedDomains: ["aliexpress.com", 404, "s.click.aliexpress.com"],
    defaultRel: "sponsored nofollow",
    healthSensitive: false,
    enabled: true,
    _count: { offers: 2, affiliateClicks: 7 }
  }),
  {
    id: "merchant-1",
    name: "AliExpress",
    slug: "aliexpress",
    domain: "aliexpress.com",
    merchantType: "marketplace",
    allowedDomains: ["aliexpress.com", "s.click.aliexpress.com"],
    defaultRel: "sponsored nofollow",
    healthSensitive: false,
    enabled: true,
    offerCount: 2,
    clickCount: 7
  }
);

assert.equal(
  directAffiliateOfferRow({
    id: "offer-1",
    merchantId: "merchant-1",
    programId: null,
    productId: null,
    topicId: null,
    title: "Offer",
    description: null,
    url: "https://merchant.example/offer",
    affiliateUrl: "https://merchant.example/offer?tag=abc",
    merchant: { slug: "merchant" },
    locale: null,
    country: null,
    category: "manual",
    evidenceLevel: "merchant_claim",
    healthSensitive: false,
    price: null,
    currency: null,
    lastCheckedAt: null,
    status: "draft",
    _count: { affiliatePlacements: 0, affiliateClicks: 0 }
  }).price,
  undefined
);

assert.equal(
  directAffiliatePlacementRow({
    id: "placement-1",
    placementType: "text_link",
    anchorText: "merchant offer",
    status: "draft",
    rel: "sponsored nofollow",
    disclosureShown: true,
    article: { title: "Guide", locale: "en", type: "guide", slug: "guide" },
    offer: { title: "Offer", merchant: { slug: "merchant" } },
    _count: { affiliateClicks: 5 }
  }).clickCount,
  5
);

console.log("Admin affiliate row module export tests passed");
