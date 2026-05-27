import type { ArticleType, Locale } from "@global-import-lab/types";

export const localizedReviewSection: Record<Locale, string> = {
  en: "reviews",
  es: "resenas",
  "pt-br": "analises"
};

export const localizedGuideSection: Record<Locale, string> = {
  en: "guides",
  es: "guias",
  "pt-br": "guias"
};

export const localizedTrendSection: Record<Locale, string> = {
  en: "trends",
  es: "tendencias",
  "pt-br": "tendencias"
};

export const localizedBuyerGuideSection: Record<Locale, string> = {
  en: "buyer-guides",
  es: "guias-de-compra",
  "pt-br": "guias-de-compra"
};

export const localizedDealWatchSection: Record<Locale, string> = {
  en: "deals",
  es: "ofertas",
  "pt-br": "ofertas"
};

export const localizedIngredientGuideSection: Record<Locale, string> = {
  en: "ingredients",
  es: "ingredientes",
  "pt-br": "ingredientes"
};

export const localizedSectionByType: Partial<Record<ArticleType, Record<Locale, string>>> = {
  review: localizedReviewSection,
  guide: localizedGuideSection,
  trend: localizedTrendSection,
  buyer_guide: localizedBuyerGuideSection,
  deal_watch: localizedDealWatchSection,
  ingredient_guide: localizedIngredientGuideSection
};

export function localizedSectionPathForArticleType(type: ArticleType, locale: Locale) {
  return localizedSectionByType[type]?.[locale];
}
