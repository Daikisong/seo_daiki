import assert from "node:assert/strict";
import {
  affiliateClickInputFromPlacement,
  affiliatePlacementApprovalBlocker,
  affiliateRedirectBlocker,
  allowedDomainList,
  hasSponsoredNofollow,
  hostMatchesDomain,
  isAllowedMerchantUrl,
  type AffiliatePlacementPolicy
} from "../packages/db/src/affiliateRedirectRules";

const approvedPlacement: AffiliatePlacementPolicy & { id: string; articleId: string } = {
  id: "placement-1",
  articleId: "article-1",
  status: "approved",
  rel: "nofollow sponsored",
  disclosureShown: true,
  article: { productId: "article-product", locale: "en" },
  offer: {
    id: "offer-1",
    productId: "offer-product",
    locale: "es",
    status: "active",
    affiliateUrl: "https://shop.merchant.example/product",
    merchant: {
      id: "merchant-1",
      enabled: true,
      allowedDomains: ["merchant.example", "other.example"]
    }
  }
};

assert.equal(hasSponsoredNofollow("sponsored nofollow"), true);
assert.equal(hasSponsoredNofollow("nofollow sponsored ugc"), true);
assert.equal(hasSponsoredNofollow("sponsored"), false);
assert.equal(hasSponsoredNofollow("nofollow"), false);

assert.deepEqual(allowedDomainList([" Example.COM ", "", 42, "https://shop.example/path"]), [
  "example.com",
  "https://shop.example/path"
]);
assert.equal(hostMatchesDomain("shop.example.com", "example.com"), true);
assert.equal(hostMatchesDomain("example.com", "*.example.com"), true);
assert.equal(hostMatchesDomain("badexample.com", "example.com"), false);
assert.equal(isAllowedMerchantUrl("https://shop.merchant.example/product", ["merchant.example"]), true);
assert.equal(isAllowedMerchantUrl("https://merchant.example/product", ["https://merchant.example/path"]), true);
assert.equal(isAllowedMerchantUrl("https://evil.example/product", ["merchant.example"]), false);
assert.equal(isAllowedMerchantUrl("not a url", ["merchant.example"]), false);

assert.equal(affiliateRedirectBlocker(approvedPlacement), undefined);
assert.deepEqual(affiliateRedirectBlocker({ ...approvedPlacement, status: "draft" }), {
  message: "Affiliate placement is not approved.",
  status: 403
});
assert.deepEqual(affiliateRedirectBlocker({ ...approvedPlacement, rel: "nofollow" }), {
  message: "Affiliate placement rel must include sponsored and nofollow.",
  status: 403
});
assert.deepEqual(affiliateRedirectBlocker({ ...approvedPlacement, disclosureShown: false }), {
  message: "Affiliate placement must confirm disclosure before redirecting.",
  status: 403
});
assert.deepEqual(affiliateRedirectBlocker({ ...approvedPlacement, offer: { ...approvedPlacement.offer, status: "inactive" } }), {
  message: "Affiliate offer is not active.",
  status: 403
});
assert.deepEqual(
  affiliateRedirectBlocker({
    ...approvedPlacement,
    offer: {
      ...approvedPlacement.offer,
      merchant: { ...approvedPlacement.offer.merchant, enabled: false }
    }
  }),
  {
    message: "Affiliate merchant is disabled.",
    status: 403
  }
);
assert.deepEqual(
  affiliateRedirectBlocker({
    ...approvedPlacement,
    offer: {
      ...approvedPlacement.offer,
      affiliateUrl: "https://not-allowed.example/product"
    }
  }),
  {
    message: "Affiliate URL host is not allowed for this merchant.",
    status: 403
  }
);

assert.equal(affiliatePlacementApprovalBlocker(approvedPlacement), undefined);
assert.deepEqual(affiliatePlacementApprovalBlocker({ ...approvedPlacement, rel: "nofollow" }), {
  message: "Affiliate placement rel must include sponsored and nofollow before approval.",
  status: 400
});
assert.deepEqual(affiliatePlacementApprovalBlocker(approvedPlacement, false), {
  message: "Affiliate placement disclosure must be confirmed before approval.",
  status: 400
});
assert.deepEqual(affiliatePlacementApprovalBlocker({ ...approvedPlacement, offer: { ...approvedPlacement.offer, status: "inactive" } }), {
  message: "Affiliate offer must be active before placement approval.",
  status: 400
});
assert.deepEqual(
  affiliatePlacementApprovalBlocker({
    ...approvedPlacement,
    offer: {
      ...approvedPlacement.offer,
      merchant: { ...approvedPlacement.offer.merchant, enabled: false }
    }
  }),
  {
    message: "Affiliate merchant must be enabled before placement approval.",
    status: 400
  }
);

assert.deepEqual(
  affiliateClickInputFromPlacement(approvedPlacement, {
    referrer: "https://example.com/page",
    utm: { utm_source: "newsletter" }
  }),
  {
    articleId: "article-1",
    placementId: "placement-1",
    offerId: "offer-1",
    merchantId: "merchant-1",
    productId: "offer-product",
    locale: "es",
    targetUrl: "https://shop.merchant.example/product",
    referrer: "https://example.com/page",
    utm: { utm_source: "newsletter" }
  }
);

assert.equal(
  affiliateClickInputFromPlacement({
    ...approvedPlacement,
    offer: { ...approvedPlacement.offer, productId: null, locale: null }
  }).productId,
  "article-product"
);
assert.equal(
  affiliateClickInputFromPlacement({
    ...approvedPlacement,
    offer: { ...approvedPlacement.offer, productId: null, locale: null }
  }).locale,
  "en"
);

console.log("Affiliate redirect rule unit tests passed");
