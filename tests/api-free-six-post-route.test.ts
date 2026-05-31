import assert from "node:assert/strict";
import { canonicalForMarketPath, marketContentPath } from "@global-import-lab/seo";
import { enabledMarkets, findMarket } from "../apps/web/lib/market/config";
import { marketContentHreflangVariants, readMarketPosts } from "../apps/web/lib/market/market-data";
import { generateMetadata, generateStaticParams } from "../apps/web/app/[locale]/[language]/posts/[slug]/page";

async function main() {
  const market = findMarket("us", "en");
  assert.ok(market);

  const post = readMarketPosts(market).find((item) => item.slug === "samsung-s90f-oled-deal");
  assert.ok(post);
  assert.equal(post.affiliateLinks.length, 0);
  assert.equal(post.monetizationDeferred, true);
  assert.equal(post.productCandidateState, "pending");
  assert.equal(post.indexStatus, "noindex");

  const path = marketContentPath(market, "posts", post.slug);
  assert.equal(path, "/us/en/posts/samsung-s90f-oled-deal/");
  assert.equal(
    canonicalForMarketPath(path, "https://example.com"),
    "https://example.com/us/en/posts/samsung-s90f-oled-deal/"
  );

  const params = generateStaticParams();
  assert.equal(params.some((item) => item.locale === "us" && item.language === "en" && item.slug === post.slug), true);

  const variants = marketContentHreflangVariants(enabledMarkets(), "posts", post.slug);
  assert.equal(variants.some((variant) => variant.market === "us" && variant.language === "en"), true);
  assert.equal(variants.some((variant) => variant.market === "gb" && variant.language === "en"), false);

  const metadata = await generateMetadata({
    params: Promise.resolve({ locale: "us", language: "en", slug: post.slug })
  });
  assert.equal((metadata.robots as { index?: boolean }).index, false);

  console.log("API-free six post route tests passed");
}

void main();
