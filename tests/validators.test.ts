import assert from "node:assert/strict";
import type { Article } from "@global-import-lab/types";
import {
  articleText,
  booleanJsonField,
  hostForUrl,
  hostMatchesDomain,
  normalizeUrl,
  numericJsonField,
  sharedCommerceTerm,
  stringJsonField
} from "../packages/validators/src/validationUtils";
import { validateMerchantAllowlistGuard, validateUnsafeRedirectGuard } from "@global-import-lab/validators";

const article: Article = {
  id: "article-1",
  locale: "en",
  slug: "usb-c-charger",
  type: "buyer_guide",
  title: "USB-C charger guide",
  h1: "USB-C charger guide",
  metaDescription: "Evidence based charger guide",
  summary: "Charging and safety evidence",
  contentMdx: "This article covers charger evidence and safer picks.",
  sections: [{ heading: "Evidence", body: "65W charger measurements" }],
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

assert.equal(normalizeUrl("https://example.com/a?x=1#top"), "https://example.com/a/");
assert.equal(normalizeUrl("/en/test"), "/en/test/");
assert.equal(hostForUrl("/api/affiliate-click/abc"), "example.com");
assert.equal(hostMatchesDomain("shop.example.com", "*.example.com"), true);
assert.equal(hostMatchesDomain("badexample.com", "example.com"), false);
assert.equal(numericJsonField({ score: 82 }, "score"), 82);
assert.equal(stringJsonField({ status: "localized" }, "status"), "localized");
assert.equal(booleanJsonField({ translationOnly: true }, "translationOnly"), true);
assert.equal(sharedCommerceTerm("charger evidence safer picks", "USB charger offer"), true);
assert.match(articleText(article), /65W charger measurements/);

const unsafeArticle: Article = {
  ...article,
  affiliateLinks: [
    {
      label: "bad redirect",
      href: "/api/affiliate-click?target=https%3A%2F%2Fmerchant.example",
      rel: "sponsored nofollow"
    }
  ]
};
assert.equal(validateUnsafeRedirectGuard(unsafeArticle)[0]?.code, "unsafe_affiliate_target_redirect");

const allowlistArticle: Article = {
  ...article,
  affiliateLinks: [
    {
      label: "merchant link",
      href: "https://other.example/product",
      rel: "sponsored nofollow",
      merchantSlug: "merchant",
      merchantAllowedDomains: ["merchant.example"]
    }
  ]
};
assert.equal(validateMerchantAllowlistGuard(allowlistArticle)[0]?.code, "merchant_allowlist_mismatch");

console.log("Validator utility unit tests passed");
