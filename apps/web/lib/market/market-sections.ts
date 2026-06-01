export const MARKET_TOPBAR_SECTIONS = ["reviews", "rankings", "news", "tips", "community", "search", "subscribe"] as const;

export const MARKET_NAV_SECTIONS: MarketTopbarSection[] = ["reviews", "rankings", "news", "tips", "community"];

export type MarketTopbarSection = (typeof MARKET_TOPBAR_SECTIONS)[number];

export function isMarketSection(value: string): value is MarketTopbarSection {
  return MARKET_TOPBAR_SECTIONS.includes(value as MarketTopbarSection);
}

export function genericSectionDescription(language: string, title: string, country: string) {
  if (language === "ko") return `${country} 시장의 ${title} 페이지입니다.`;
  if (language === "ja") return `${country}市場の${title}ページです。`;
  if (language === "es") return `Página de ${title} para el mercado ${country}.`;
  if (language === "pt-br" || language === "pt") return `Página de ${title} para o mercado ${country}.`;
  if (language === "fr") return `Page ${title} pour le marché ${country}.`;
  if (language === "de") return `${title}-Seite für den Markt ${country}.`;
  if (language === "it") return `Pagina ${title} per il mercato ${country}.`;
  if (language === "nl") return `${title}-pagina voor markt ${country}.`;
  if (language === "pl") return `Strona ${title} dla rynku ${country}.`;
  if (language === "tr") return `${country} pazarı için ${title} sayfası.`;
  if (language === "id") return `Halaman ${title} untuk pasar ${country}.`;
  return `${title} for ${country} ${language}.`;
}
