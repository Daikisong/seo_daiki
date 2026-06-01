import type { MarketConfig } from "@global-import-lab/types";

export function marketLanguageName(market: Pick<MarketConfig, "language" | "market">): string {
  const marketSpecificNames: Record<string, string> = {
    "us-en": "American English",
    "gb-en": "British English",
    "ca-en": "Canadian English",
    "au-en": "Australian English",
    "in-en": "Indian English",
    "es-es": "Español de España",
    "mx-es": "Español de México",
    "br-pt-br": "Português brasileiro",
    "pt-pt": "Português europeu"
  };
  const marketKey = `${market.market}-${market.language}`;
  if (marketSpecificNames[marketKey]) return marketSpecificNames[marketKey];

  const languageNames: Record<string, string> = {
    en: "English",
    es: "Español",
    "pt-br": "Português",
    pt: "Português",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    nl: "Nederlands",
    pl: "Polski",
    tr: "Türkçe",
    id: "Bahasa Indonesia",
    ja: "日本語",
    ko: "한국어"
  };
  return languageNames[market.language] ?? market.language;
}
