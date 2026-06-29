import assert from "node:assert/strict";
import { enabledMarkets, findMarket } from "../apps/web/lib/market/config";
import { marketsWithContentSlug, readMarketTrends } from "../apps/web/lib/market/market-data";
import { readMarketTrends as splitReadMarketTrends } from "../apps/web/lib/market/market-data-readers";
import { marketsWithContentSlug as splitMarketsWithContentSlug } from "../apps/web/lib/market/market-data-routing";

assert.equal(readMarketTrends, splitReadMarketTrends);
assert.equal(marketsWithContentSlug, splitMarketsWithContentSlug);

const us = findMarket("us", "en");
assert.ok(us);

const usS90fTrend = readMarketTrends(us).find((trend) => trend.slug === "samsung-s90f-oled-deal");
assert.ok(usS90fTrend);
assert.equal(usS90fTrend.title, "Samsung S90F OLED deal: what US buyers should verify first");
assert.match(usS90fTrend.summary, /US buying guide/);
assert.ok(usS90fTrend.sections.length >= 3);
assert.ok(usS90fTrend.sourceLinks.length >= 3);

const marketsWithS90f = marketsWithContentSlug(enabledMarkets(), "trends", usS90fTrend.slug);
assert.equal(marketsWithS90f.some((market) => market.market === "us" && market.language === "en"), true);
assert.equal(marketsWithS90f.some((market) => market.market === "gb" && market.language === "en"), false);
assert.equal(
  marketsWithS90f.every((market) => readMarketTrends(market).some((trend) => trend.slug === usS90fTrend.slug)),
  true
);

console.log("Market data unit tests passed");
