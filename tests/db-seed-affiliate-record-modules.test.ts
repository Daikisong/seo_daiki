import assert from "node:assert/strict";
import {
  seedAffiliateMerchantCreateData,
  seedAffiliateMerchants,
  seedAffiliateProgramCreateData
} from "../packages/db/src/seedAffiliateMerchantRecords";
import {
  seedAffiliateOfferCreateData,
  seedAffiliateOffersAndPlacements,
  seedAffiliatePlacementCreateData
} from "../packages/db/src/seedAffiliateOfferPlacementRecords";
import {
  seedAffiliateMerchantCreateData as exportedSeedAffiliateMerchantCreateData,
  seedAffiliateMerchants as exportedSeedAffiliateMerchants,
  seedAffiliateOfferCreateData as exportedSeedAffiliateOfferCreateData,
  seedAffiliateOffersAndPlacements as exportedSeedAffiliateOffersAndPlacements,
  seedAffiliatePlacementCreateData as exportedSeedAffiliatePlacementCreateData,
  seedAffiliateProgramCreateData as exportedSeedAffiliateProgramCreateData
} from "../packages/db/src/seedAffiliateRecords";

assert.equal(exportedSeedAffiliateMerchantCreateData, seedAffiliateMerchantCreateData);
assert.equal(exportedSeedAffiliateMerchants, seedAffiliateMerchants);
assert.equal(exportedSeedAffiliateOfferCreateData, seedAffiliateOfferCreateData);
assert.equal(exportedSeedAffiliateOffersAndPlacements, seedAffiliateOffersAndPlacements);
assert.equal(exportedSeedAffiliatePlacementCreateData, seedAffiliatePlacementCreateData);
assert.equal(exportedSeedAffiliateProgramCreateData, seedAffiliateProgramCreateData);

const merchantData = seedAffiliateMerchantCreateData({
  ALIEXPRESS_ALLOWED_AFFILIATE_DOMAINS: "WWW.ALIEXPRESS.TEST",
  IHERB_ALLOWED_AFFILIATE_DOMAINS: "iherb.test"
} as NodeJS.ProcessEnv);

assert.equal(merchantData.aliexpress.id, "merchant-aliexpress");
assert.deepEqual(merchantData.aliexpress.allowedDomains, ["www.aliexpress.test"]);
assert.equal(merchantData.iherb.healthSensitive, true);

const programData = seedAffiliateProgramCreateData(
  { aliexpress: { id: "merchant-aliexpress" }, iherb: { id: "merchant-iherb" } },
  { ALIEXPRESS_AFFILIATE_NETWORK: "impact", IHERB_TRACKING_ID: "track-iherb" } as NodeJS.ProcessEnv
);

assert.equal(programData.aliexpressProgram.network, "impact");
assert.equal(programData.iherbProgram.trackingId, "track-iherb");

const offerData = seedAffiliateOfferCreateData({
  article: {
    id: "article-1",
    lastUpdated: "2026-05-28",
    locale: "pt-br",
    productId: "product-1",
    slug: "power-bank",
    title: "Power bank guide"
  },
  index: 0,
  isIherb: false,
  link: { label: "Check price", href: "https://example.test", rel: "sponsored nofollow" },
  merchant: { healthSensitive: false, id: "merchant-aliexpress" },
  product: { category: "chargers" },
  program: { id: "program-aliexpress-default" }
});

assert.equal(offerData.id, "offer-article-1-1");
assert.equal(offerData.country, "BR");
assert.equal(offerData.category, "chargers");
assert.equal(offerData.url, "https://www.aliexpress.com/item/product-1.html");

const placementData = seedAffiliatePlacementCreateData({
  article: { id: "article-1", indexStatus: "index", publishStatus: "published" },
  link: { label: "Check price", href: "https://example.test", rel: "sponsored nofollow", placementId: "placement-1" },
  offerId: offerData.id
});

assert.equal(placementData.id, "placement-1");
assert.equal(placementData.status, "approved");

console.log("DB seed affiliate record module tests passed");
