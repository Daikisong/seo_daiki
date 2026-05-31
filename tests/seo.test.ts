import assert from "node:assert/strict";
import {
  buildExistingMarketContentHreflangMap,
  buildMarketContentHreflangMap,
  buildMarketHreflangMap,
  buildMarketSectionHreflangMap,
  hreflangKeyForMarket,
  marketContentPath,
  marketPath,
  marketSectionPath
} from "@global-import-lab/seo";
import type { MarketConfig } from "@global-import-lab/types";

const us: MarketConfig = {
  market: "us",
  language: "en",
  country: "US",
  currency: "USD",
  timezone: "America/New_York",
  trendsGeo: "US",
  serpGl: "us",
  serpHl: "en",
  pathPrefix: "/us/en",
  enabled: true,
  monetizationReadiness: "research_only",
  defaultCategories: [],
  blockedCategories: [],
  searchConsoleCountryFilter: "usa",
  serpLocaleConfig: { gl: "us", hl: "en" },
  localizationRules: [],
  trendFeedPath: "",
  editorialCalendarPath: ""
};

const gb: MarketConfig = { ...us, market: "gb", country: "GB", currency: "GBP", timezone: "Europe/London", trendsGeo: "GB", serpGl: "gb", pathPrefix: "/gb/en" };
const br: MarketConfig = {
  ...us,
  market: "br",
  language: "pt-br",
  country: "BR",
  currency: "BRL",
  timezone: "America/Sao_Paulo",
  trendsGeo: "BR",
  serpGl: "br",
  serpHl: "pt-BR",
  pathPrefix: "/br/pt-br",
  searchConsoleCountryFilter: "bra",
  serpLocaleConfig: { gl: "br", hl: "pt-BR" }
};

assert.equal(marketPath(us), "/us/en/");
assert.equal(marketSectionPath(us, "calendar"), "/us/en/calendar/");
assert.equal(marketContentPath(us, "trends", "magnesium-sleep"), "/us/en/trends/magnesium-sleep/");

assert.equal(hreflangKeyForMarket(us), "en-US");
assert.equal(hreflangKeyForMarket(gb), "en-GB");
assert.equal(hreflangKeyForMarket(br), "pt-BR");

const marketMap = buildMarketHreflangMap([us, gb, br], us, "https://example.com");
assert.equal(marketMap["en-US"], "https://example.com/us/en/");
assert.equal(marketMap["en-GB"], "https://example.com/gb/en/");
assert.equal(marketMap["pt-BR"], undefined);
assert.equal(marketMap["x-default"], "https://example.com/global/markets/");

const contentMap = buildMarketContentHreflangMap([us, gb], us, "trends", "gan-charger", "https://example.com");
assert.equal(contentMap["en-US"], "https://example.com/us/en/trends/gan-charger/");
assert.equal(contentMap["en-GB"], "https://example.com/gb/en/trends/gan-charger/");

const existingVariantMap = buildExistingMarketContentHreflangMap(
  [
    {
      market: "us",
      language: "en",
      path: "/us/en/trends/magnesium-sleep/",
      hreflang: "en-US",
      exists: true,
      indexable: true
    }
  ],
  {
    market: "us",
    language: "en",
    path: "/us/en/trends/magnesium-sleep/",
    hreflang: "en-US",
    exists: true,
    indexable: true
  },
  "https://example.com"
);
assert.equal(existingVariantMap["en-US"], "https://example.com/us/en/trends/magnesium-sleep/");
assert.equal(existingVariantMap["en-GB"], undefined);
assert.equal(existingVariantMap["x-default"], "https://example.com/global/trend-map/");

const sectionMap = buildMarketSectionHreflangMap([us, gb], us, "calendar", "https://example.com");
assert.equal(sectionMap["en-US"], "https://example.com/us/en/calendar/");
assert.equal(sectionMap["en-GB"], "https://example.com/gb/en/calendar/");

console.log("SEO helper unit tests passed");
