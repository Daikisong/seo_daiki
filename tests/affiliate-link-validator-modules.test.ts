import assert from "node:assert/strict";
import type { AffiliateLink, Article } from "@global-import-lab/types";
import {
  validateAffiliateLinks as facadeValidateAffiliateLinks,
  validateAffiliatePlacementGuard as facadeValidateAffiliatePlacementGuard,
  validateOverMonetizationGuard as facadeValidateOverMonetizationGuard
} from "@global-import-lab/validators/affiliateLinkValidator";
import { validateAffiliateLinks, hasSponsoredNofollow } from "../packages/validators/src/affiliateLinkRelValidator";
import { placementLimits, validateOverMonetizationGuard } from "../packages/validators/src/affiliateMonetizationValidator";
import { validateAffiliatePlacementGuard } from "../packages/validators/src/affiliatePlacementValidator";
import { validateMerchantAllowlistGuard } from "../packages/validators/src/affiliateMerchantValidator";
import { validateOfferRelevanceGuard } from "../packages/validators/src/affiliateOfferRelevanceValidator";

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

assert.equal(facadeValidateAffiliateLinks, validateAffiliateLinks);
assert.equal(facadeValidateAffiliatePlacementGuard, validateAffiliatePlacementGuard);
assert.equal(facadeValidateOverMonetizationGuard, validateOverMonetizationGuard);

assert.equal(hasSponsoredNofollow("nofollow sponsored ugc"), true);
assert.equal(validateAffiliateLinks(withLinks([{ label: "bad rel", href: "https://merchant.example/item", rel: "sponsored" }]))[0]?.code, "affiliate_rel_invalid");

assert.deepEqual(placementLimits.review, 4);
assert.equal(
  validateOverMonetizationGuard(withLinks(new Array(5).fill(null).map((_, index) => link(`charger ${index}`)), { type: "review" }))[0]?.code,
  "affiliate_placements_over_limit"
);

assert.equal(
  validateAffiliatePlacementGuard(withLinks([{ ...link("pending"), placementId: "placement-1", placementStatus: "draft" }]))[0]?.code,
  "affiliate_placement_not_approved"
);

assert.equal(
  validateMerchantAllowlistGuard(withLinks([{ ...link("merchant"), href: "https://[bad", merchantAllowedDomains: ["merchant.example"] }]))[0]?.code,
  "affiliate_url_invalid"
);

assert.equal(
  validateOfferRelevanceGuard(withLinks([{ ...link("USB cable"), href: "https://merchant.example/cable" }], { type: "ingredient_guide" }))[0]?.code,
  "ingredient_offer_not_relevant"
);

console.log("Affiliate link validator module tests passed");

function withLinks(affiliateLinks: AffiliateLink[], overrides: Partial<Article> = {}): Article {
  return { ...baseArticle, affiliateLinks, ...overrides };
}

function link(label: string): AffiliateLink {
  return { label, href: `https://merchant.example/${label.replace(/\s+/g, "-")}`, rel: "sponsored nofollow" };
}
