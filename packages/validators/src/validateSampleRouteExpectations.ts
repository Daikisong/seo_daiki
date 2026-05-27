export const localizedSectionExpectations = [
  { type: "trend", locale: "en", section: "/en/trends/" },
  { type: "trend", locale: "es", section: "/es/tendencias/" },
  { type: "trend", locale: "pt-br", section: "/pt-br/tendencias/" },
  { type: "buyer_guide", locale: "en", section: "/en/buyer-guides/" },
  { type: "buyer_guide", locale: "es", section: "/es/guias-de-compra/" },
  { type: "buyer_guide", locale: "pt-br", section: "/pt-br/guias-de-compra/" },
  { type: "deal_watch", locale: "en", section: "/en/deals/" },
  { type: "deal_watch", locale: "es", section: "/es/ofertas/" },
  { type: "deal_watch", locale: "pt-br", section: "/pt-br/ofertas/" },
  { type: "ingredient_guide", locale: "en", section: "/en/ingredients/" },
  { type: "ingredient_guide", locale: "es", section: "/es/ingredientes/" },
  { type: "ingredient_guide", locale: "pt-br", section: "/pt-br/ingredientes/" }
] as const;

export const requiredRiskPaths = new Map([
  ["aliexpress-chargers-us-buyers", "/en-us/guides/aliexpress-chargers-us-buyers/"],
  ["aliexpress-chargers-uk-buyers", "/en-gb/guides/aliexpress-chargers-uk-buyers/"],
  ["cargadores-aliexpress-espana", "/es-es/guias/cargadores-aliexpress-espana/"],
  ["carregadores-aliexpress-brasil", "/pt-br/guias/carregadores-aliexpress-brasil/"]
]);
