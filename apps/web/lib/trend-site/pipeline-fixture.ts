import type { ProductCandidate, TrendCandidate } from "./pipeline-models";

export const fixtureTrendCandidate: TrendCandidate = {
  id: "fixture-europe-heatwave-portable-ac-2026",
  locale: "en",
  market: "Global English",
  detectedAt: "2026-06-30T00:00:00.000Z",
  source: "fixture",
  seedKeyword: "Europe heatwave portable AC",
  trendTitle: "Europe heatwave portable AC buying problem",
  trendUrlHint: "/en/trends/europe-heatwave-portable-ac-trend-2026/",
  evidence: [
    {
      sourceLabel: "Fixture trend note",
      observedAt: "2026-06-30T00:00:00.000Z",
      note: "Heatwave searches create demand for room-cooling products and buyer confusion around mini coolers.",
    },
  ],
};

export const fixtureProductCandidates: ProductCandidate[] = Array.from(
  { length: 10 },
  (_, index) => {
    const rank = index + 1;
    const id = `fixture-portable-ac-${rank}`;
    return {
      id,
      name: `Fixture Portable AC ${rank}`,
      exactVariant: `Fixture Portable AC ${rank} 9000 BTU`,
      category: "portable air conditioner heatwave cooling",
      productRole: "main",
      merchantUrl: `https://merchant.example/products/portable-ac-${rank}`,
      merchantUrlKind: "merchant-product-page",
      price: 399 + rank,
      priceLabel: `$${399 + rank}`,
      priceState: "checked",
      priceCountry: "GB",
      priceCurrency: "GBP",
      priceCheckedAt: "2026-06-30",
      evidenceLevel: "review-pattern",
      officialSpecSource: {
        label: `Fixture brand spec page ${rank}`,
        url: `https://merchant.example/products/portable-ac-${rank}/specs`,
      },
      marketplaceSource: {
        label: `Fixture merchant route ${rank}`,
        url: `https://merchant.example/products/portable-ac-${rank}`,
      },
      reviewComplaintSignal: {
        label: `Fixture buyer complaints ${rank}`,
        url: `https://reviews.example/portable-ac-${rank}`,
        summary:
          "Buyers mention hose fit, night noise, drainage, and bulky returns.",
        count: 24 + rank,
      },
      localRiskNote:
        "Check voltage, plug, window kit, stock route, warranty territory, and bulky-return terms.",
      returnRiskLabel: "Bulky return route must be visible before checkout.",
      bestFor: "One-room cooling where a window hose can be installed.",
      skipIf:
        "Skip if you cannot vent hot air outside or return a heavy appliance locally.",
      keyCheck:
        "Confirm compressor AC class, BTU rating, hose kit, voltage, delivery date, and return route.",
    };
  },
);
