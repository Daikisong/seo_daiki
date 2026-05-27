import assert from "node:assert/strict";
import { isAffiliateRedirectError } from "../apps/web/app/api/affiliate-click/affiliate-click-errors";
import {
  affiliateClickUtmKeys,
  collectUtmFromSearchParams,
  optionalSearchParam,
  referrerFromHeaders
} from "../apps/web/app/api/affiliate-click/affiliate-click-request";
import {
  isSafeHttpUrl,
  isUnsafeTargetRedirectAllowed
} from "../apps/web/app/api/affiliate-click/affiliate-click-target-rules";
import { GET } from "../apps/web/app/api/affiliate-click/route";

assert.equal(typeof GET, "function");

assert.deepEqual([...affiliateClickUtmKeys], [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content"
]);

const params = new URLSearchParams({
  utm_source: "newsletter",
  utm_medium: "",
  utm_campaign: "spring",
  target: "https://merchant.example/item",
  articleId: "article-1"
});

assert.deepEqual(collectUtmFromSearchParams(params), {
  utm_source: "newsletter",
  utm_campaign: "spring"
});
assert.equal(optionalSearchParam(params, "articleId"), "article-1");
assert.equal(optionalSearchParam(params, "missing"), undefined);
assert.equal(referrerFromHeaders(new Headers({ referer: "https://example.com/page" })), "https://example.com/page");
assert.equal(referrerFromHeaders(new Headers()), undefined);

assert.equal(isUnsafeTargetRedirectAllowed({ NODE_ENV: "development", ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT: "true" }), true);
assert.equal(isUnsafeTargetRedirectAllowed({ NODE_ENV: "production", ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT: "true" }), false);
assert.equal(isUnsafeTargetRedirectAllowed({ NODE_ENV: "development" }), false);

assert.equal(isSafeHttpUrl("https://merchant.example/item"), true);
assert.equal(isSafeHttpUrl("http://merchant.example/item"), true);
assert.equal(isSafeHttpUrl("javascript:alert(1)"), false);
assert.equal(isSafeHttpUrl("not a url"), false);

assert.equal(isAffiliateRedirectError({ name: "AffiliateRedirectError", message: "blocked", status: 403 }), true);
assert.equal(isAffiliateRedirectError({ name: "AffiliateRedirectError", message: "blocked", status: "403" }), false);
assert.equal(isAffiliateRedirectError(new Error("blocked")), false);

console.log("Affiliate click route module tests passed");
