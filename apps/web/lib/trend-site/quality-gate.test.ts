import assert from "node:assert/strict";
import test from "node:test";

import {
  validateArticleContent,
  validateQualityGates,
} from "./content/content-validation";
import { isIndexableLocale } from "./locales";
import { runArticleQualityGate } from "./quality-gate";
import type { Article, Product } from "./types";

const SITE_ORIGIN = "https://trend-jacob.test";

test("passes a complete buyer-decision article and product record", () => {
  const result = runArticleQualityGate(article(), products(10), {
    allArticles: [article()],
    siteOrigin: SITE_ORIGIN,
  });
  assert.equal(result.status, "PASS");
  assert.equal(result.canPublishIndexable, true);
});

test("blocks commerce articles that cannot render a full Top 10 recommendation section", () => {
  assertCodes(article(), [product()], ["TOP10_RECOMMENDATION_MODEL_NOT_READY"]);
});

test("blocks missing affiliate disclosure when product CTAs are rendered", () => {
  assertCodes(
    article({ affiliateDisclosure: "" }),
    [product()],
    ["MISSING_AFFILIATE_DISCLOSURE"],
  );
});

test("blocks indexable commerce articles without an explicit product category", () => {
  assertCodes(
    article({ productCategory: undefined }),
    [product()],
    ["MISSING_PRODUCT_CATEGORY"],
  );
});

test("blocks products without source URLs or price checked dates", () => {
  assertCodes(
    article(),
    [product({ sourceUrl: "" })],
    ["MISSING_PRODUCT_FIELD", "INVALID_PRODUCT_SOURCE_URL"],
  );
  assertCodes(
    article(),
    [product({ priceCheckedAt: "" })],
    ["MISSING_PRODUCT_FIELD"],
  );
});

test("blocks zero price placeholders and allows explicit unavailable price state", () => {
  assertCodes(
    article(),
    [
      product({
        priceSnapshots: [
          {
            id: "price-1",
            productId: "p1",
            country: "US",
            currency: "USD",
            price: 0,
            priceLabel: "Check price",
            priceState: "unavailable",
          },
        ],
      }),
    ],
    ["PRICE_PLACEHOLDER_ZERO"],
  );

  const unavailablePrice = runArticleQualityGate(
    article(),
    [
      product({
        priceLabel: "Check UK price",
        priceState: "unavailable",
        priceSnapshots: [
          {
            id: "price-1",
            productId: "p1",
            country: "GB",
            currency: "GBP",
            price: null,
            finalPrice: null,
            priceLabel: "Check UK price",
            priceState: "unavailable",
          },
        ],
      }),
    ],
    { allArticles: [article()], siteOrigin: SITE_ORIGIN },
  );
  assert.equal(
    codes(unavailablePrice).includes("PRICE_PLACEHOLDER_ZERO"),
    false,
  );
  assert.equal(
    codes(unavailablePrice).includes("MISSING_NUMERIC_CHECKED_PRICE"),
    false,
  );
});

test("blocks internal redirect and API product CTA URLs", () => {
  assertCodes(
    article(),
    [product({ merchantUrl: `${SITE_ORIGIN}/api/affiliate-click/p1` })],
    ["FRAGILE_PRODUCT_HREF"],
  );
  assertCodes(
    article(),
    [
      product({
        merchantUrl: `${SITE_ORIGIN}/out?target=https%3A%2F%2Fmerchant.example%2Fp1`,
      }),
    ],
    ["FRAGILE_PRODUCT_HREF"],
  );
});

test("production mode blocks fixture URLs and placeholder images", () => {
  const result = runArticleQualityGate(article(), products(10), {
    allArticles: [article()],
    siteOrigin: SITE_ORIGIN,
    mode: "production",
  });
  const resultCodes = codes(result);
  assert.equal(resultCodes.includes("PRODUCTION_PLACEHOLDER_URL"), true);
  assert.equal(resultCodes.includes("PRODUCTION_PLACEHOLDER_IMAGE"), true);
});

test("production content validation rejects fixture domains", () => {
  assert.throws(
    () =>
      validateQualityGates([article()], products(10), {
        mode: "production",
      }),
    /PRODUCTION_PLACEHOLDER/,
  );
});

test("production mode blocks unapproved example subdomain images", () => {
  const temporaryImageUrl =
    "https://cdn.example.com/manual/approved-temp-product.jpg";
  const result = runArticleQualityGate(
    article({ imageUrl: temporaryImageUrl }),
    products(10, {
      merchantUrl: "https://www.amazon.com/dp/B000000001",
      merchantUrlKind: "merchant-product-page",
      sourceUrl: "https://www.midea.com/uk/air-treatment/product-specs",
      reviewSourceUrl: "https://www.trustedreviews.com/reviews/portable-ac",
      imageUrl: temporaryImageUrl,
    }),
    {
      allArticles: [article({ imageUrl: temporaryImageUrl })],
      siteOrigin: SITE_ORIGIN,
      mode: "production",
    },
  );

  assert.equal(codes(result).includes("PRODUCTION_PLACEHOLDER_IMAGE"), true);
});

test("production mode blocks unapproved off-route product images", () => {
  const offRouteImageUrl =
    "https://cdn.shopify.com/s/files/1/0000/0000/files/product.jpg";
  const result = runArticleQualityGate(
    article(),
    products(10, {
      merchantUrl: "https://www.amazon.com/dp/B000000001",
      merchantUrlKind: "merchant-product-page",
      sourceUrl: "https://www.midea.com/uk/air-treatment/product-specs",
      reviewSourceUrl: "https://www.trustedreviews.com/reviews/portable-ac",
      imageUrl: offRouteImageUrl,
    }),
    {
      allArticles: [article()],
      siteOrigin: SITE_ORIGIN,
      mode: "production",
    },
  );

  assert.equal(
    codes(result).includes("PRODUCTION_UNAPPROVED_PRODUCT_IMAGE"),
    true,
  );
});

test("production mode permits product images from source host", () => {
  const result = runArticleQualityGate(
    article(),
    products(10, {
      merchantUrl: "https://www.amazon.com/dp/B000000001",
      merchantUrlKind: "merchant-product-page",
      sourceUrl: "https://www.midea.com/uk/air-treatment/product-specs",
      reviewSourceUrl: "https://www.trustedreviews.com/reviews/portable-ac",
      imageUrl: "https://www.midea.com/content/dam/midea/product.jpg",
    }),
    {
      allArticles: [article()],
      siteOrigin: SITE_ORIGIN,
      mode: "production",
    },
  );

  assert.equal(
    codes(result).includes("PRODUCTION_UNAPPROVED_PRODUCT_IMAGE"),
    false,
  );
});

test("production mode permits local editorial article hero images", () => {
  const articleHeroImage =
    "/images/trend-heroes/europe-heatwave-portable-ac-hero.png";
  const result = runArticleQualityGate(
    article({ imageUrl: articleHeroImage }),
    products(10, {
      merchantUrl: "https://www.amazon.com/dp/B000000001",
      merchantUrlKind: "merchant-product-page",
      sourceUrl: "https://www.midea.com/uk/air-treatment/product-specs",
      reviewSourceUrl: "https://www.trustedreviews.com/reviews/portable-ac",
      imageUrl: "https://www.midea.com/content/dam/midea/product.jpg",
    }),
    {
      allArticles: [article({ imageUrl: articleHeroImage })],
      siteOrigin: SITE_ORIGIN,
      mode: "production",
    },
  );

  assert.equal(codes(result).includes("PRODUCTION_PLACEHOLDER_IMAGE"), false);
});

test("production mode permits explicitly approved temporary images for manual static articles", () => {
  const temporaryImageUrl =
    "https://cdn.shopify.com/s/files/1/0000/0000/files/approved-temp-product.jpg";
  const result = runArticleQualityGate(
    article({ imageUrl: temporaryImageUrl }),
    products(10, {
      merchantUrl: "https://www.amazon.com/dp/B000000001",
      merchantUrlKind: "merchant-product-page",
      sourceUrl: "https://www.midea.com/uk/air-treatment/product-specs",
      reviewSourceUrl: "https://www.trustedreviews.com/reviews/portable-ac",
      imageUrl: temporaryImageUrl,
    }),
    {
      allArticles: [article({ imageUrl: temporaryImageUrl })],
      siteOrigin: SITE_ORIGIN,
      mode: "production",
      approvedTemporaryImageUrls: [temporaryImageUrl],
    },
  );

  const resultCodes = codes(result);
  assert.equal(resultCodes.includes("PRODUCTION_PLACEHOLDER_URL"), false);
  assert.equal(resultCodes.includes("PRODUCTION_PLACEHOLDER_IMAGE"), false);
  assert.equal(
    resultCodes.includes("PRODUCTION_UNAPPROVED_PRODUCT_IMAGE"),
    false,
  );
});

test("requires marketplace search URLs to be labeled as search routes", () => {
  assertCodes(
    article(),
    [
      product({
        merchantUrl: "https://www.amazon.com/s?k=portable+air+conditioner",
        merchantUrlKind: "merchant-product-page",
      }),
    ],
    ["UNCLASSIFIED_SEARCH_ROUTE"],
  );

  const result = runArticleQualityGate(
    article(),
    [
      product({
        merchantUrl: "https://www.amazon.com/s?k=portable+air+conditioner",
        merchantUrlKind: "marketplace-search-route",
      }),
    ],
    { allArticles: [article()], siteOrigin: SITE_ORIGIN },
  );
  assert.equal(codes(result).includes("UNCLASSIFIED_SEARCH_ROUTE"), false);
});

test("blocks unsupported direct-use claims but allows direct-use evidence", () => {
  assertCodes(
    article({
      summary:
        "Hey, it is Jacob. I personally tested this exact charger before publishing.",
    }),
    [product()],
    ["UNSUPPORTED_DIRECT_USE_CLAIM"],
  );

  const directUseProduct = product({
    exactVariant: "Test Portable AC PAC-1000",
    evidenceLevel: "direct-use",
    verifiedClaims: [
      {
        id: "p1-direct",
        productId: "p1",
        testType: "direct-use",
        resultValue: "used for 14 days",
        exactVariant: "Test Portable AC PAC-1000",
        usageWindow: "2026-06-01 to 2026-06-14",
        originalNote:
          "Original Jacob usage note for the exact PAC-1000 variant.",
      },
    ],
  });
  const result = runArticleQualityGate(
    article({
      summary:
        "Hey, it is Jacob. I personally tested this exact charger before publishing.",
    }),
    [directUseProduct],
    { allArticles: [article()], siteOrigin: SITE_ORIGIN },
  );
  assert.equal(codes(result).includes("UNSUPPORTED_DIRECT_USE_CLAIM"), false);
});

test("blocks direct-use claims on the product that lacks matching direct-use evidence", () => {
  const directUseProduct = product({
    id: "p2",
    exactVariant: "Test Portable AC PAC-2000",
    evidenceLevel: "direct-use",
    verifiedClaims: [
      {
        id: "p2-direct",
        productId: "p2",
        testType: "direct-use",
        resultValue: "used for 14 days",
        exactVariant: "Test Portable AC PAC-2000",
        usageWindow: "2026-06-01 to 2026-06-14",
        originalNote:
          "Original Jacob usage note for the exact PAC-2000 variant.",
      },
    ],
  });

  assertCodes(
    article(),
    [
      product({
        expertReviewTake:
          "I personally tested this exact unit before recommending it.",
      }),
      directUseProduct,
    ],
    ["UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM"],
  );
});

test("blocks broader hands-on testing claims without matching direct-use evidence", () => {
  assertCodes(
    article(),
    [
      product({
        expertReviewTake:
          "Hands-on tested for two weeks before this recommendation.",
      }),
    ],
    ["UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM"],
  );
  assertCodes(
    article(),
    [
      product({
        whyRecommend: "Jacob's hands-on testing found the charger stayed cool.",
      }),
    ],
    ["UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM"],
  );
  assertCodes(
    article(),
    [
      product({
        expertReviewTake: "We ran hands-on checks before ranking this model.",
      }),
    ],
    ["UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM"],
  );
  assertCodes(
    article(),
    [
      product({
        expertReviewTake:
          "Lab-tested cooling output makes this the safest pick.",
      }),
    ],
    ["UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM"],
  );
  assertCodes(
    article(),
    [
      product({
        expertReviewTake: "Personally used for a week before publishing.",
      }),
    ],
    ["UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM"],
  );
  assertCodes(
    article(),
    [
      product({
        expertReviewTake:
          "After testing the unit in a small bedroom, this was the strongest pick.",
      }),
    ],
    ["UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM"],
  );
  assertCodes(
    article(),
    [
      product({
        expertReviewTake:
          "First-hand use showed the hose kit is easier than most buyers expect.",
      }),
    ],
    ["UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM"],
  );
  assertCodes(
    article(),
    [
      product({
        expertReviewTake:
          "Tested in our lab, this model held its output better than cheaper picks.",
      }),
    ],
    ["UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM"],
  );
  assertCodes(
    article(),
    [
      product({
        expertReviewTake:
          "The hands-on evaluation made this the easiest recommendation.",
      }),
    ],
    ["UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM"],
  );
});

test("blocks internal SEO, SERP, Search Console, monetization, and LLM process language in public copy", () => {
  assertCodes(
    article({
      summary:
        "SERP checked and LLM evidence showed commercial search intent for this topic.",
    }),
    products(10),
    ["FORBIDDEN_INTERNAL_PROCESS_COPY"],
  );
  assertCodes(
    article({
      expertCopy: {
        ...article().expertCopy,
        topPicksIntro:
          "SERP checked and Search Console signal confirmed monetization link available.",
      },
    }),
    products(10),
    ["FORBIDDEN_INTERNAL_PROCESS_COPY"],
  );
  assertCodes(
    article({
      summary:
        "We used ranking data, provider signals, and SEO workflow checks to select this topic.",
    }),
    products(10),
    ["FORBIDDEN_INTERNAL_PROCESS_COPY"],
  );
  assertCodes(
    article({
      expertCopy: {
        ...article().expertCopy,
        topPicksIntro:
          "I ranked products by buyer fit, product class, region risk, and evidence quality before writing this guide.",
      },
    }),
    products(10),
    ["FORBIDDEN_INTERNAL_PROCESS_COPY"],
  );
  assertCodes(
    article({
      expertCopy: {
        ...article().expertCopy,
        quickListIntro:
          "SERP provider and LLM signals created this quick list.",
      },
    }),
    products(10),
    ["FORBIDDEN_INTERNAL_PROCESS_COPY"],
  );
  assertCodes(
    article({
      relatedArticles: [
        {
          label: "Internal method",
          href: "/methodology/",
          description:
            "Search Console, SERP provider, and LLM evidence created this recommendation.",
        },
      ],
    }),
    products(10),
    ["FORBIDDEN_INTERNAL_PROCESS_COPY"],
  );
  assertCodes(
    article({
      latestInCategory: [
        {
          label: "Internal latest",
          href: "/category/home-trends/",
          description:
            "Commercial search intent and monetization link available.",
        },
      ],
    }),
    products(10),
    ["FORBIDDEN_INTERNAL_PROCESS_COPY"],
  );
});

test("main article author must be a public author profile", () => {
  assert.throws(
    () =>
      validateArticleContent([
        article({
          authorId: "trendbrief-editors",
        }),
      ]),
    /public author profile/,
  );
});

test("infers country routes and avoid lists from region and product-category claims", () => {
  assertCodes(
    article({ targetRegion: "Europe", countryBuyingRoutes: undefined }),
    products(10),
    ["MISSING_COUNTRY_BUYING_ROUTES"],
  );
  assertCodes(
    article({
      productCategory: "portable air conditioner heatwave cooling",
      avoidList: undefined,
      avoidListHeading: undefined,
    }),
    products(10, { category: "portable air conditioner heatwave cooling" }),
    ["MISSING_AVOID_LIST"],
  );
});

test("blocks incomplete hreflang clusters", () => {
  assertCodes(
    article({ localization: { clusterId: "heatwave-2026" } }),
    [product()],
    ["HREFLANG_CLUSTER_INCOMPLETE"],
  );
});

test("blocks language-locale mismatch before opening localized pages", () => {
  const spanishGermanPage = article({
    locale: "de-de",
    title: "Guia de compra para aire acondicionado",
    h1: "Guia de compra para aire acondicionado",
    metaDescription: "Comparar precio, devolucion y garantia antes de comprar.",
    summary:
      "Esta guia explica que comprar, que evitar, precio, devolucion, garantia y tiendas locales para el lector.",
    sections: [
      {
        heading: "Respuesta rapida",
        body: "Comparar precio, devolucion, garantia, voltaje y tiendas antes de comprar.",
      },
      {
        heading: "Riesgos",
        body: "Evitar productos sin datos, sin devolucion clara y sin garantia local.",
      },
      {
        heading: "Comparacion",
        body: "Elegir por precio final, tienda local, garantia, ruido y compatibilidad.",
      },
    ],
  });

  assertCodes(
    spanishGermanPage,
    [product()],
    ["LANGUAGE_LOCALE_MISMATCH", "LOCALE_NOT_OPEN"],
  );
});

test("flags near-duplicate locale pages that are not a valid hreflang cluster", () => {
  const base = article();
  const nearDuplicate = article({ id: "near-duplicate", locale: "en-us" });
  const result = runArticleQualityGate(base, [product()], {
    allArticles: [base, nearDuplicate],
    siteOrigin: SITE_ORIGIN,
  });
  assert.equal(codes(result).includes("HIGH_DOORWAY_SIMILARITY"), true);
});

test("blocks missing product evidence collections with structured repair details", () => {
  const result = runArticleQualityGate(
    article(),
    [product({ reviewSignals: [] })],
    {
      allArticles: [article()],
      siteOrigin: SITE_ORIGIN,
    },
  );
  const blocker = allBlockers(result).find(
    (item) => item.code === "MISSING_PRODUCT_EVIDENCE_COLLECTION",
  );
  assert.ok(blocker);
  assert.equal(blocker?.target, "p1.reviewSignals");
  assert.match(blocker?.repairAction ?? "", /Generate/);
});

test("blocks missing fields inside product evidence entries", () => {
  assertCodes(
    article(),
    [
      product({
        verifiedClaims: [
          {
            id: "claim-1",
            productId: "p1",
            testType: "output",
            resultValue: "",
          },
        ],
      }),
    ],
    ["MISSING_PRODUCT_EVIDENCE_FIELD"],
  );
  assertCodes(
    article(),
    [
      product({
        priceSnapshots: [
          {
            id: "price-1",
            productId: "p1",
            country: "",
            currency: "USD",
            price: 10,
            priceLabel: "$10",
            priceState: "checked",
          },
        ],
      }),
    ],
    ["MISSING_PRODUCT_EVIDENCE_FIELD"],
  );
  assertCodes(
    article(),
    [
      product({
        reviewSignals: [
          {
            id: "review-1",
            productId: "p1",
            locale: "en",
            topic: "noise",
            count: 0,
          },
        ],
      }),
    ],
    ["MISSING_PRODUCT_EVIDENCE_FIELD"],
  );
  assertCodes(
    article(),
    [
      product({
        marketRisks: [
          {
            id: "risk-1",
            productId: "p1",
            locale: "en",
            country: "US",
            certificationRisk: "low",
            returnRisk: "",
          },
        ],
      }),
    ],
    ["MISSING_PRODUCT_EVIDENCE_FIELD"],
  );
});

test("blocks evidence entries attached to the wrong product id", () => {
  assertCodes(
    article(),
    [
      product({
        verifiedClaims: [
          {
            id: "claim-1",
            productId: "other",
            testType: "output",
            resultValue: "10000",
          },
        ],
      }),
    ],
    ["PRODUCT_EVIDENCE_ID_MISMATCH"],
  );
  assertCodes(
    article(),
    [
      product({
        priceSnapshots: [
          {
            id: "price-1",
            productId: "other",
            country: "US",
            currency: "USD",
            price: 10,
            priceLabel: "$10",
            priceState: "checked",
          },
        ],
      }),
    ],
    ["PRODUCT_EVIDENCE_ID_MISMATCH"],
  );
  assertCodes(
    article(),
    [
      product({
        reviewSignals: [
          {
            id: "review-1",
            productId: "other",
            locale: "en",
            topic: "noise",
            count: 10,
          },
        ],
      }),
    ],
    ["PRODUCT_EVIDENCE_ID_MISMATCH"],
  );
  assertCodes(
    article(),
    [
      product({
        marketRisks: [
          {
            id: "risk-1",
            productId: "other",
            locale: "en",
            country: "US",
            certificationRisk: "low",
            returnRisk: "medium",
          },
        ],
      }),
    ],
    ["PRODUCT_EVIDENCE_ID_MISMATCH"],
  );
});

test("classifies common marketplace search-route shapes", () => {
  const searchRoutes = [
    "https://www.amazon.de/s?k=mobile+klimaanlage",
    "https://www.temu.com/search_result.html?search_key=portable+fan",
    "https://www.iherb.com/search?kw=magnesium",
    "https://www.aliexpress.com/w/wholesale-neck-fan.html?SearchText=neck%20fan",
  ];

  for (const merchantUrl of searchRoutes) {
    assertCodes(
      article(),
      [product({ merchantUrl, merchantUrlKind: "merchant-product-page" })],
      ["UNCLASSIFIED_SEARCH_ROUTE"],
    );
    const result = runArticleQualityGate(
      article(),
      [product({ merchantUrl, merchantUrlKind: "marketplace-search-route" })],
      {
        allArticles: [article()],
        siteOrigin: SITE_ORIGIN,
      },
    );
    assert.equal(codes(result).includes("UNCLASSIFIED_SEARCH_ROUTE"), false);
  }
});

test("direct-use evidence must match the exact variant and include usage notes", () => {
  assertCodes(
    article({
      summary:
        "Hey, it is Jacob. I personally tested this exact charger before publishing.",
    }),
    [
      product({
        evidenceLevel: "direct-use",
        verifiedClaims: [
          {
            id: "p1-direct",
            productId: "p1",
            testType: "direct-use",
            resultValue: "used for 14 days",
            exactVariant: "Different variant",
            usageWindow: "2026-06-01 to 2026-06-14",
            originalNote: "Original note.",
          },
        ],
      }),
    ],
    ["DIRECT_USE_VARIANT_MISMATCH", "UNSUPPORTED_DIRECT_USE_CLAIM"],
  );
});

test("planned locales remain closed until explicitly opened", () => {
  assert.equal(isIndexableLocale("de-de"), false);
});

function assertCodes(
  articleValue: Article,
  productValues: Product[],
  expectedCodes: string[],
) {
  const result = runArticleQualityGate(articleValue, productValues, {
    allArticles: [articleValue],
    siteOrigin: SITE_ORIGIN,
  });
  const actualCodes = codes(result);
  for (const expectedCode of expectedCodes) {
    assert.equal(
      actualCodes.includes(expectedCode),
      true,
      `${expectedCode} missing from ${actualCodes.join(", ")}`,
    );
  }
}

function codes(result: ReturnType<typeof runArticleQualityGate>) {
  return allBlockers(result).map((item) => item.code);
}

function allBlockers(result: ReturnType<typeof runArticleQualityGate>) {
  return [
    ...result.hardGate.blockers,
    ...result.repairGate.blockers,
    ...result.editorialGate.blockers,
    ...result.hreflangGate.blockers,
  ];
}

function article(overrides: Partial<Article> = {}): Article {
  return {
    id: "article-1",
    authorId: "jacob",
    productEvidenceById: "trendbrief-editors",
    editedById: "trendbrief-editors",
    locale: "en",
    slug: "test-guide",
    type: "trend",
    title: "Heatwave portable AC brief",
    h1: "Heatwave portable AC brief",
    metaDescription:
      "Compare portable AC price, returns, warranty, voltage, and buyer complaints before buying.",
    summary:
      "Hey, it is Jacob. Heatwave searches create a buying problem because shoppers need to separate real compressor ACs from weak coolers, unclear listings, and poor return routes.",
    affiliateDisclosure:
      "Outbound product buttons may be paid affiliate links.",
    imageUrl: "https://merchant.example/image.jpg",
    productCategory: "test-category",
    contentMdx: "portable ac heatwave brief returns warranty price",
    trendSignalBox: {
      heading: "Why this matters now",
      body: "Heatwave demand can make weak listings look more attractive than they are.",
      items: [
        {
          label: "Buyer risk",
          body: "Wrong voltage, weak cooling, and bulky returns become expensive.",
        },
        {
          label: "Product class",
          body: "The useful product is a real compressor AC or clearly labeled accessory.",
        },
      ],
      sourceNote:
        "Readers can verify this against public specs, marketplace listings, and repeated buyer complaints.",
    },
    marketplaceRule: {
      heading: "Marketplace rule",
      body: "Use local retailers for heavy ACs and marketplace routes for accessories when terms are clear.",
      bullets: [
        "Verify final price.",
        "Check return route.",
        "Confirm voltage and plug.",
      ],
    },
    avoidListHeading: "Products I would not treat as portable AC",
    avoidList: [
      {
        label: "USB mini coolers",
        reason: "They do not exhaust heat outside.",
      },
      {
        label: "Fan-only towers",
        reason: "They move air but do not lower room temperature.",
      },
    ],
    sections: [
      {
        heading: "Quick answer",
        body: "Compare cooling capacity, voltage, plug, return path, and final shipped price.",
      },
      {
        heading: "What to avoid",
        body: "Avoid vague mini coolers, wrong-voltage imports, and no-return heavy goods.",
      },
      {
        heading: "How to compare",
        body: "Use local availability, evidence level, and repeated complaints to narrow the list.",
      },
    ],
    faqs: [
      {
        question: "Should I buy local?",
        answer: "Use a local seller when returns or warranty matter.",
      },
      {
        question: "Can I use AliExpress?",
        answer:
          "Use marketplace routes only when the exact variant and terms are clear.",
      },
      {
        question: "What is the main risk?",
        answer: "The main risk is buying the wrong product class.",
      },
    ],
    expertCopy: {
      topPicksHeading: "Top 10 practical picks",
      topPicksIntro:
        "These picks compare exact variants, seller routes, and buyer-risk signals.",
      topPicksRule:
        "Treat a changed model number, plug, seller, or bundle as a different product.",
      quickListIntro: "Start with the shortlist, then read product notes.",
      comparisonHeading: "Quick comparison table",
      comparisonIntro:
        "Use the table to narrow the list by practical buyer checks.",
      comparisonFootnote:
        "Re-check live stock, final shipped price, and returns before buying.",
      inDepthHeading: "My in-depth notes on all 10 picks",
      topThreeHeading: "My Personal Top 3 Recommendations",
      finalThoughtsHeading: "Final thoughts",
      finalThoughts: [
        "Buy the product that fits the room, seller route, and return path.",
      ],
      buyingChecklistHeading: "Before you buy",
      buyingChecklist: [
        "Check exact variant.",
        "Check voltage.",
        "Check return route.",
      ],
      updateLogHeading: "Update log",
      updateLog: ["2026-06-30: Test fixture created."],
    },
    evidenceIds: ["source-1"],
    affiliateLinks: [],
    lastUpdated: "2026-06-30",
    indexStatus: "index",
    publishStatus: "published",
    ...overrides,
  };
}

function product(overrides: Partial<Product> = {}): Product {
  const id = overrides.id ?? "p1";
  const variant =
    overrides.exactVariant ?? `Test Portable AC ${id.toUpperCase()}`;
  return {
    id,
    canonicalName: `Test Portable AC ${id.toUpperCase()}`,
    exactVariant: variant,
    category: "test-category",
    productRole: "main",
    brandClaim: "TestBrand",
    merchantUrl: `https://merchant.example/product/${id}`,
    merchantUrlKind: "merchant-product-page",
    sourceUrl: `https://merchant.example/product/${id}/specs`,
    sourceLabel: `TestBrand official ${id} specs`,
    reviewSourceUrl: `https://reviews.example/${id}`,
    reviewSourceLabel: `Independent ${id} review pattern`,
    marketplaceSourceLabel: "Merchant product route",
    priceCheckedAt: "2026-06-30",
    imageUrl: `https://merchant.example/product/${id}.jpg`,
    imageAlt: variant,
    priceLabel: "$499",
    priceState: "checked",
    productKind: "Real compressor portable AC",
    regionFit: "Local product route with visible warranty and return terms.",
    coolingCapacity: "10,000 BTU",
    hoseType: "Single-hose setup",
    noiseLevel: "Check listed 52 dB mode and recent buyer complaints.",
    roomSize: "Small-to-medium room.",
    voltagePlug: "Local plug and voltage listed by seller.",
    returnRiskLabel: "Bulky return terms must be visible.",
    evidenceLevel: "review-pattern",
    evidenceBasis:
      "Public specs, review pattern, price snapshot, and return route are available.",
    specSummary:
      "The product page lists capacity, voltage, hose setup, and included accessories.",
    reviewSummary:
      "Review patterns mention cooling speed, noise, and hose fit.",
    safetyNote:
      "Buy only if the voltage and return route match the buyer country.",
    bestFor: "Buyers cooling one room with a local return route.",
    whyRecommend:
      "It gives a clear product class, exact variant, and visible return path.",
    whoFits: "People who need one-room cooling and can vent the hose outside.",
    whoShouldSkip:
      "Skip if you cannot vent hot air outside or return a bulky appliance.",
    repeatedComplaints: [
      "Window kit fit.",
      "Noise at night.",
      "Bulky returns.",
    ],
    warrantyReturnNote:
      "Use only when the seller explains warranty and bulky returns.",
    marketplaceNote:
      "Marketplace listings should match the exact variant and final price.",
    keyCheck: "Confirm voltage, hose kit, room size, and return path.",
    keyFeatures: ["10,000 BTU", "Single-hose kit", "Local return route"],
    editorialRankLabel: "Best test pick",
    expertReviewTake:
      "This is useful when the buyer wants a clear, local product route rather than a vague import.",
    editorialPros: [
      "Exact variant is clear.",
      "Return path is visible.",
      "Specs are easy to compare.",
    ],
    editorialCons: [
      "Not silent.",
      "Needs window venting.",
      "Bulky return risk remains.",
    ],
    verifiedClaims: [
      {
        id: `${id}-output`,
        productId: id,
        testType: "output",
        resultValue: "10000",
        unit: "BTU",
      },
    ],
    priceSnapshots: [
      {
        id: `${id}-price`,
        productId: id,
        country: "US",
        currency: "USD",
        price: 499,
        priceLabel: "$499",
        priceState: "checked",
      },
    ],
    reviewSignals: [
      {
        id: `${id}-review`,
        productId: id,
        locale: "en",
        topic: "noise and hose fit",
        count: 40,
      },
    ],
    marketRisks: [
      {
        id: `${id}-risk`,
        productId: id,
        locale: "en",
        country: "US",
        certificationRisk: "low",
        returnRisk: "medium",
      },
    ],
    ...overrides,
  };
}

function products(count: number, overrides: Partial<Product> = {}) {
  return Array.from({ length: count }, (_, index) =>
    product({ ...overrides, id: `p${index + 1}` }),
  );
}
