import assert from "node:assert/strict";
import type { AffiliateLink, Article } from "@global-import-lab/types";
import {
  validateAffiliateLinks,
  validateAffiliatePlacementGuard,
  validateMerchantAllowlistGuard,
  validateOfferRelevanceGuard,
  validateOverMonetizationGuard,
  validateUnsafeRedirectGuard
} from "@global-import-lab/validators/affiliateLinkValidator";

const baseArticle: Article = {
  id: "article-1",
  locale: "en",
  slug: "usb-c-charger",
  type: "buyer_guide",
  title: "USB-C charger evidence guide for safe buying",
  h1: "USB-C charger evidence guide",
  metaDescription: "Evidence based charger guide with safety checks, variant traps, price truth, and local buying risk.",
  summary: "Charging and safety evidence for USB-C charger buyers with source-backed checks and market risk notes.",
  contentMdx: "This article covers charger evidence, safer picks, variant traps, price truth, and buying risk.",
  sections: [{ heading: "Evidence", body: "65W charger measurements and safety checks" }],
  jsonLd: {},
  qualityScore: 90,
  indexStatus: "index",
  publishStatus: "published",
  hreflangMap: {},
  internalLinks: [{ label: "charger data", href: "/en/data/charger/", reason: "data" }],
  affiliateLinks: [],
  evidenceIds: ["ev-1"],
  lastUpdated: "2026-05-27"
};

assert.equal(validateAffiliateLinks({ ...baseArticle, type: "review" })[0]?.code, "affiliate_missing");

assert.equal(
  validateAffiliateLinks(withLinks([{ label: "bad rel", href: "https://merchant.example/item", rel: "nofollow" }]))[0]?.code,
  "affiliate_rel_invalid"
);

assert.equal(
  validateUnsafeRedirectGuard(withLinks([{ label: "bad redirect", href: "/api/affiliate-click?target=https%3A%2F%2Fmerchant.example", rel: "sponsored nofollow" }]))[0]?.code,
  "unsafe_affiliate_target_redirect"
);

const placementIssues = validateAffiliatePlacementGuard(
  withLinks([
    {
      label: "pending placement",
      href: "https://merchant.example/item",
      rel: "sponsored nofollow",
      placementId: "placement-1",
      placementStatus: "draft",
      disclosureShown: false,
      offerStatus: "inactive"
    }
  ])
);
assert.deepEqual(
  placementIssues.map((issue) => issue.code),
  ["affiliate_placement_not_approved", "affiliate_placement_disclosure_missing", "affiliate_offer_not_active"]
);

assert.equal(
  validateMerchantAllowlistGuard(
    withLinks([
      {
        label: "merchant link",
        href: "https://other.example/product",
        rel: "sponsored nofollow",
        merchantSlug: "merchant",
        merchantAllowedDomains: ["merchant.example"]
      }
    ])
  )[0]?.code,
  "merchant_allowlist_mismatch"
);

assert.equal(
  validateMerchantAllowlistGuard(
    withLinks([
      {
        label: "merchant link",
        href: "https://shop.merchant.example/product",
        rel: "sponsored nofollow",
        merchantSlug: "merchant",
        merchantAllowedDomains: ["*.merchant.example"]
      }
    ])
  ).length,
  0
);

assert.equal(
  validateOfferRelevanceGuard(withLinks([{ label: "highest payout charger", href: "https://merchant.example/charger", rel: "sponsored nofollow" }]))[0]?.code,
  "offer_commission_first_language"
);

assert.equal(
  validateOfferRelevanceGuard(
    withLinks([{ label: "USB cable", href: "https://merchant.example/cable", rel: "sponsored nofollow" }], { type: "ingredient_guide" })
  )[0]?.code,
  "ingredient_offer_not_relevant"
);

assert.equal(
  validateOverMonetizationGuard(
    withLinks(
      Array.from({ length: 5 }, (_, index) => ({
        label: `charger ${index}`,
        href: `https://merchant.example/${index}`,
        rel: "sponsored nofollow"
      })),
      { type: "review" }
    )
  )[0]?.code,
  "affiliate_placements_over_limit"
);

assert.equal(
  validateOverMonetizationGuard(withLinks([{ label: "charger", href: "https://merchant.example/charger", rel: "sponsored nofollow" }], { internalLinks: [] }))[0]?.code,
  "affiliate_links_exceed_internal_links"
);

console.log("Affiliate guard unit tests passed");

function withLinks(affiliateLinks: AffiliateLink[], overrides: Partial<Article> = {}): Article {
  return { ...baseArticle, affiliateLinks, ...overrides };
}
