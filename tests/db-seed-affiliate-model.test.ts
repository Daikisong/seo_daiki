import assert from "node:assert/strict";
import {
  affiliateLinksWithPlacementIds,
  affiliateOfferId,
  affiliatePlacementId,
  aliexpressAffiliateUrl,
  countryForLocale,
  defaultAliExpressAllowedDomains,
  domainListFromEnv,
  iherbAffiliateUrl,
  isApprovedSeedArticle,
  isIherbSeedAffiliateLink
} from "../packages/db/src/seedAffiliateModel";

const publishedArticle: Parameters<typeof affiliateLinksWithPlacementIds>[0] = {
  id: "article-magnesium",
  productId: "product-magnesium",
  slug: "magnesium-sleep",
  indexStatus: "index",
  publishStatus: "published",
  affiliateLinks: [
    {
      label: "Check magnesium supplement on iHerb",
      href: "https://www.iherb.com/pr/magnesium",
      rel: "sponsored nofollow"
    }
  ]
};

const [iherbLink] = affiliateLinksWithPlacementIds(publishedArticle, {
  IHERB_ALLOWED_AFFILIATE_DOMAINS: "iherb.test, WWW.IHERB.TEST"
} as NodeJS.ProcessEnv);

assert.equal(iherbLink.placementId, "placement-article-magnesium-1");
assert.equal(iherbLink.placementStatus, "approved");
assert.equal(iherbLink.disclosureShown, true);
assert.equal(iherbLink.offerStatus, "active");
assert.equal(iherbLink.merchantSlug, "iherb");
assert.deepEqual(iherbLink.merchantAllowedDomains, ["iherb.test", "www.iherb.test"]);
assert.equal(iherbLink.offerHealthSensitive, true);

const draftArticle: Parameters<typeof affiliateLinksWithPlacementIds>[0] = {
  ...publishedArticle,
  id: "article-charger",
  productId: "product-charger",
  slug: "charger-review",
  indexStatus: "pending",
  publishStatus: "draft",
  affiliateLinks: [
    {
      label: "Check current AliExpress price",
      href: "https://example.com/go/charger",
      rel: "sponsored nofollow"
    }
  ]
};

const [aliexpressLink] = affiliateLinksWithPlacementIds(draftArticle, {});
assert.equal(aliexpressLink.placementStatus, "draft");
assert.equal(aliexpressLink.merchantSlug, "aliexpress");
assert.deepEqual(aliexpressLink.merchantAllowedDomains, defaultAliExpressAllowedDomains);
assert.equal(aliexpressLink.offerHealthSensitive, false);

assert.equal(isIherbSeedAffiliateLink({ label: "Probiotic sample", href: "https://merchant.example.test" }), true);
assert.equal(isIherbSeedAffiliateLink({ label: "USB-C charger sample", href: "https://merchant.example.test" }), false);
assert.equal(isApprovedSeedArticle({ indexStatus: "index", publishStatus: "published" }), true);
assert.equal(isApprovedSeedArticle({ indexStatus: "noindex", publishStatus: "published" }), false);

assert.equal(affiliatePlacementId("article-a", 1), "placement-article-a-2");
assert.equal(affiliateOfferId("article-a", 1), "offer-article-a-2");
assert.equal(aliexpressAffiliateUrl({ productId: "prod charger", slug: "charger" }, 0), "https://www.aliexpress.com/item/prod%20charger.html");
assert.equal(iherbAffiliateUrl({ slug: "magnesium sleep" }, 0), "https://www.iherb.com/pr/magnesium%20sleep-1");
assert.equal(countryForLocale("pt-br"), "BR");
assert.equal(countryForLocale("es"), "ES");
assert.equal(countryForLocale("en"), "US");

assert.deepEqual(
  domainListFromEnv("ALIEXPRESS_ALLOWED_AFFILIATE_DOMAINS", ["fallback.test"], {
    ALIEXPRESS_ALLOWED_AFFILIATE_DOMAINS: "WWW.ALIEXPRESS.TEST, s.click.test ,, "
  } as NodeJS.ProcessEnv),
  ["www.aliexpress.test", "s.click.test"]
);
assert.deepEqual(domainListFromEnv("MISSING", ["fallback.test"], {}), ["fallback.test"]);

console.log("DB seed affiliate model unit tests passed");
