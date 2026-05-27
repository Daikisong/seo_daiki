import assert from "node:assert/strict";
import {
  affiliateMerchantRow,
  affiliateOfferRow,
  affiliatePlacementRow
} from "../apps/web/lib/admin/admin-affiliate-row-model";

assert.deepEqual(
  affiliateMerchantRow({
    id: "merchant-1",
    name: "AliExpress",
    slug: "aliexpress",
    domain: "aliexpress.com",
    merchantType: "marketplace",
    allowedDomains: ["aliexpress.com", 123, "s.click.aliexpress.com"],
    defaultRel: "sponsored nofollow",
    healthSensitive: false,
    enabled: true,
    _count: { offers: 4, affiliateClicks: 12 }
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
    offerCount: 4,
    clickCount: 12
  }
);

assert.deepEqual(
  affiliateOfferRow({
    id: "offer-1",
    merchantId: "merchant-1",
    programId: null,
    productId: "product-1",
    topicId: null,
    title: "65W charger",
    description: null,
    url: "https://merchant.example/product",
    affiliateUrl: "https://merchant.example/product?tag=abc",
    merchant: { slug: "aliexpress" },
    locale: "en",
    country: "US",
    category: "usb-c-chargers",
    evidenceLevel: "verified_product",
    healthSensitive: false,
    price: 19.99,
    currency: "USD",
    lastCheckedAt: new Date("2026-05-27T10:30:00.000Z"),
    status: "active",
    _count: { affiliatePlacements: 2, affiliateClicks: 9 }
  }),
  {
    id: "offer-1",
    merchantId: "merchant-1",
    programId: null,
    productId: "product-1",
    topicId: null,
    title: "65W charger",
    description: null,
    url: "https://merchant.example/product",
    affiliateUrl: "https://merchant.example/product?tag=abc",
    merchantSlug: "aliexpress",
    locale: "en",
    country: "US",
    category: "usb-c-chargers",
    evidenceLevel: "verified_product",
    healthSensitive: false,
    price: "19.99",
    currency: "USD",
    lastCheckedAt: "2026-05-27",
    status: "active",
    placementCount: 2,
    clickCount: 9
  }
);

assert.equal(
  affiliateOfferRow({
    id: "offer-2",
    merchantId: "merchant-1",
    programId: null,
    productId: null,
    topicId: null,
    title: "No price",
    description: "manual offer",
    url: "https://merchant.example/no-price",
    affiliateUrl: "https://merchant.example/no-price?tag=abc",
    merchant: { slug: "manual" },
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

assert.deepEqual(
  affiliatePlacementRow({
    id: "placement-1",
    placementType: "analysis_block",
    anchorText: "65W charger",
    status: "draft",
    rel: "sponsored nofollow",
    disclosureShown: false,
    article: { title: "Charger guide", locale: "en", type: "guide", slug: "charger-guide" },
    offer: { title: "65W charger offer", merchant: { slug: "aliexpress" } },
    _count: { affiliateClicks: 3 }
  }),
  {
    id: "placement-1",
    placementType: "analysis_block",
    anchorText: "65W charger",
    status: "draft",
    rel: "sponsored nofollow",
    disclosureShown: false,
    articleTitle: "Charger guide",
    articleLocale: "en",
    articleType: "guide",
    articleSlug: "charger-guide",
    offerTitle: "65W charger offer",
    merchantSlug: "aliexpress",
    clickCount: 3
  }
);

console.log("Admin affiliate row model unit tests passed");
