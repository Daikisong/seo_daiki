import type { Locale, MarketRisk } from "@global-import-lab/types";
import type { GeneratedProductSpec } from "./generated-product-fixture-types";

export const generatedProductMarketLocales: Locale[] = ["en", "es", "pt-br"];

export function buildGeneratedMarketRisks(spec: GeneratedProductSpec): MarketRisk[] {
  return generatedProductMarketLocales.map((locale) => generatedProductLocaleRisk(spec, locale));
}

export function generatedProductLocaleRisk(spec: GeneratedProductSpec, locale: Locale): MarketRisk {
  const country = locale === "en" ? "US" : locale === "es" ? "ES" : "BR";
  const customsRisk = locale === "pt-br" ? "high" : locale === "es" ? "medium" : "low";
  return {
    id: `risk-${spec.sourceSlug}-${locale}`,
    productId: spec.id,
    locale,
    country,
    plugRisk: spec.plugType ? "medium" : "none",
    customsRisk,
    certificationRisk: "medium",
    returnRisk: locale === "pt-br" ? "high" : "medium",
    localAlternativeNote:
      locale === "pt-br"
        ? "Compare with Mercado Livre if tax or delayed returns remove the import discount."
        : "Compare with a local seller when warranty or certification matters.",
    score: locale === "pt-br" ? 0.7 : locale === "es" ? 0.52 : 0.44
  };
}
