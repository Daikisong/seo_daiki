import assert from "node:assert/strict";
import { enabledMarkets, findMarket } from "../apps/web/lib/market/config";
import { marketsWithContentSlug, readMarketTrends } from "../apps/web/lib/market/market-data";
import { readMarketTrends as splitReadMarketTrends } from "../apps/web/lib/market/market-data-readers";
import { marketsWithContentSlug as splitMarketsWithContentSlug } from "../apps/web/lib/market/market-data-routing";

assert.equal(readMarketTrends, splitReadMarketTrends);
assert.equal(marketsWithContentSlug, splitMarketsWithContentSlug);

const us = findMarket("us", "en");
assert.ok(us);

const usTrend = readMarketTrends(us).find((trend) => trend.slug === "magnesium-sleep");
assert.ok(usTrend);

const marketsWithMagnesium = marketsWithContentSlug(enabledMarkets(), "trends", usTrend.slug);
assert.equal(marketsWithMagnesium.some((market) => market.market === "us" && market.language === "en"), true);
assert.equal(marketsWithMagnesium.some((market) => market.market === "gb" && market.language === "en"), false);
assert.equal(
  marketsWithMagnesium.every((market) => readMarketTrends(market).some((trend) => trend.slug === usTrend.slug)),
  true
);

console.log("Market data unit tests passed");
