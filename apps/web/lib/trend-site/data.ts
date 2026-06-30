import type { Article, Product } from "./types";
import { validateLocalizationClusters } from "./seo";
import { visibleTrendArticles } from "./categories";
import { heatwaveArticle, trendArticle } from "./content/articles";
import { europeHeatwaveProductRecords } from "./content/europe-heatwave-product-records";
import { recordsToProducts } from "./content/product-record-transform";
import { travelGanProductRecords } from "./content/travel-gan-product-records";
import {
  validateArticleContent,
  validateProductContent,
  validateQualityGates,
} from "./content/content-validation";

export { heatwaveArticle, trendArticle } from "./content/articles";

const trendArticles: Article[] = [heatwaveArticle, trendArticle];

export const trendProducts: Product[] = [
  ...recordsToProducts(
    travelGanProductRecords,
    "travel-gan-charger",
    "travel gan charger",
  ),
  ...recordsToProducts(
    europeHeatwaveProductRecords,
    "europe-heatwave-cooling",
    "portable air conditioner heatwave cooling",
  ),
];

validateArticleContent(trendArticles);
validateProductContent(trendProducts);
validateLocalizationClusters(trendArticles);
validateQualityGates(trendArticles, trendProducts);

export function getIndexedArticles() {
  return visibleTrendArticles(trendArticles);
}

export function getTrendArticle(locale: string, slug: string) {
  if (!locale || !slug) {
    return undefined;
  }
  return getIndexedArticles().find(
    (article) => article.locale === locale && article.slug === slug,
  );
}

export function getTrendProducts() {
  return trendProducts;
}

export function getStaticTrendParams() {
  return getIndexedArticles().map((article) => ({
    locale: article.locale,
    slug: article.slug,
  }));
}
