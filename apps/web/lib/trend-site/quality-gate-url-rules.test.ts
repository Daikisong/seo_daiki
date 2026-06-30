import assert from "node:assert/strict";
import test from "node:test";

import { isDirectHttpsOutbound, isInternalRedirectPath, isMarketplaceSearchUrl } from "./quality-gate-url-rules";

test("direct outbound URL checks reject fragile internal or non-HTTPS purchase paths", () => {
  const siteOrigin = "https://trend-jacob.test";

  assert.equal(isDirectHttpsOutbound("http://merchant.example/product", { siteOrigin }), false);
  assert.equal(isDirectHttpsOutbound(`${siteOrigin}/api/affiliate-click/p1`, { siteOrigin }), false);
  assert.equal(isDirectHttpsOutbound(`${siteOrigin}/out?target=https%3A%2F%2Fmerchant.example%2Fp1`, { siteOrigin }), false);
  assert.equal(isDirectHttpsOutbound("https://merchant.example/product/p1", { siteOrigin }), true);
});

test("internal redirect path matching covers common affiliate redirect shells", () => {
  assert.equal(isInternalRedirectPath("/api/affiliate-click/p1"), true);
  assert.equal(isInternalRedirectPath("/out/p1"), true);
  assert.equal(isInternalRedirectPath("/go/p1"), true);
  assert.equal(isInternalRedirectPath("/redirect/p1"), true);
  assert.equal(isInternalRedirectPath("/affiliate-click/p1"), true);
  assert.equal(isInternalRedirectPath("/product/p1"), false);
});

test("marketplace search-route detection separates search pages from direct product pages", () => {
  const searchRoutes = [
    "https://www.aliexpress.com/w/wholesale-neck-fan.html?SearchText=neck%20fan",
    "https://www.aliexpress.com/wholesale?SearchText=portable%20ac",
    "https://www.amazon.de/s?k=mobile+klimaanlage",
    "https://www.amazon.co.uk/s?k=window+seal+kit",
    "https://www.temu.com/search_result.html?search_key=portable+fan",
    "https://www.iherb.com/search?kw=magnesium"
  ];

  for (const url of searchRoutes) {
    assert.equal(isMarketplaceSearchUrl(url), true, url);
  }

  const productPages = [
    "https://www.amazon.de/dp/B000TEST",
    "https://www.aliexpress.com/item/1005000000000000.html",
    "https://www.iherb.com/pr/example-product/12345"
  ];

  for (const url of productPages) {
    assert.equal(isMarketplaceSearchUrl(url), false, url);
  }
});
