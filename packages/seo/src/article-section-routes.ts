import type { Article, ArticleType, Locale } from "@global-import-lab/types";

export const sectionPathByType: Record<ArticleType, string> = {
  hub: "",
  review: "reviews",
  guide: "guides",
  compare: "compare",
  data: "data",
  lab: "lab",
  risk: "risk",
  methodology: "methodology",
  trend: "trends",
  buyer_guide: "buyer-guides",
  deal_watch: "deals",
  ingredient_guide: "ingredients"
};

const localizedReviewSection: Record<Locale, string> = {
  en: "reviews",
  es: "resenas",
  "pt-br": "analises"
};

const localizedGuideSection: Record<Locale, string> = {
  en: "guides",
  es: "guias",
  "pt-br": "guias"
};

const localizedTrendSection: Record<Locale, string> = {
  en: "trends",
  es: "tendencias",
  "pt-br": "tendencias"
};

const localizedBuyerGuideSection: Record<Locale, string> = {
  en: "buyer-guides",
  es: "guias-de-compra",
  "pt-br": "guias-de-compra"
};

const localizedDealWatchSection: Record<Locale, string> = {
  en: "deals",
  es: "ofertas",
  "pt-br": "ofertas"
};

const localizedIngredientGuideSection: Record<Locale, string> = {
  en: "ingredients",
  es: "ingredientes",
  "pt-br": "ingredientes"
};

export function sectionPathForArticle(article: Pick<Article, "locale" | "type">) {
  if (article.type === "review") {
    return localizedReviewSection[article.locale];
  }

  if (article.type === "guide") {
    return localizedGuideSection[article.locale];
  }

  if (article.type === "trend") {
    return localizedTrendSection[article.locale];
  }

  if (article.type === "buyer_guide") {
    return localizedBuyerGuideSection[article.locale];
  }

  if (article.type === "deal_watch") {
    return localizedDealWatchSection[article.locale];
  }

  if (article.type === "ingredient_guide") {
    return localizedIngredientGuideSection[article.locale];
  }

  return sectionPathByType[article.type];
}
