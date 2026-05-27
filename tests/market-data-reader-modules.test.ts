import assert from "node:assert/strict";
import {
  readGlobalTrendMap,
  readMarketBriefs,
  readMarketCalendar,
  readMarketKeywords,
  readMarketPosts,
  readMarketSerp,
  readMarketTrends,
  readProductCandidateAnalysis
} from "../apps/web/lib/market/market-data-readers";
import {
  readMarketBriefs as directReadMarketBriefs,
  readMarketCalendar as directReadMarketCalendar,
  readMarketPosts as directReadMarketPosts
} from "../apps/web/lib/market/market-publishing-data-readers";
import { readProductCandidateAnalysis as directReadProductCandidateAnalysis } from "../apps/web/lib/market/market-product-analysis-data-readers";
import {
  readGlobalTrendMap as directReadGlobalTrendMap,
  readMarketSerp as directReadMarketSerp
} from "../apps/web/lib/market/market-serp-data-readers";
import {
  readMarketKeywords as directReadMarketKeywords,
  readMarketTrends as directReadMarketTrends
} from "../apps/web/lib/market/market-trend-data-readers";

assert.equal(readMarketTrends, directReadMarketTrends);
assert.equal(readMarketKeywords, directReadMarketKeywords);
assert.equal(readMarketSerp, directReadMarketSerp);
assert.equal(readGlobalTrendMap, directReadGlobalTrendMap);
assert.equal(readMarketBriefs, directReadMarketBriefs);
assert.equal(readMarketPosts, directReadMarketPosts);
assert.equal(readMarketCalendar, directReadMarketCalendar);
assert.equal(readProductCandidateAnalysis, directReadProductCandidateAnalysis);

console.log("Market data reader module tests passed");
