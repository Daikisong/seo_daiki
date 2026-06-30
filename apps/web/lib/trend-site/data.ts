import type { Article, Product } from "./types";
import { validateLocalizationClusters } from "./seo";
import { visibleTrendArticles, visibleTrendCategories } from "./categories";
import { heatwaveArticle } from "./content/articles";
import { europeHeatwaveProductRecords } from "./content/europe-heatwave-product-records";
import { recordsToProducts } from "./content/product-record-transform";
import {
  validateArticleContent,
  validateProductContent,
  validateQualityGates,
} from "./content/content-validation";

export { heatwaveArticle } from "./content/articles";

const trendArticles: Article[] = [heatwaveArticle];
const approvedTemporaryProductImageUrls = [
  "https://media.s-bol.com/YWOVNXOQV5q2/924x1200.jpg",
  "https://aircareappliances.co.uk/cdn/shop/files/MeacoCoolAirconSmall10000.jpg?crop=center&height=1200&v=1720611716&width=1200",
  "https://eu-images.contentstack.com/v3/assets/blt2252ade9ce4d4191/bltb0cc134491cf9114/680ffa9a035e5f81da1a1d5f/EU_MenuPrimaryCard_PortableAirConditioners_20250429.jpg",
  "https://cdn.mos.cms.futurecdn.net/zTFBBjWT3CaA4VzPGCjFan-1280-80.jpg.webp",
  "https://media.currys.biz/i/currysprod/10207859?fmt=auto",
  "https://media.4rgos.it/i/Argos/7891092_R_Z001A?w=750&h=440&qlt=70",
] as const;

export const trendProducts: Product[] = [
  ...recordsToProducts(
    europeHeatwaveProductRecords,
    "europe-heatwave-cooling",
    "portable air conditioner heatwave cooling",
  ),
];

validateArticleContent(trendArticles);
validateProductContent(trendProducts);
validateLocalizationClusters(trendArticles);
validateQualityGates(trendArticles, trendProducts, {
  approvedTemporaryImageUrls: approvedTemporaryProductImageUrls,
});

export function getIndexedArticles() {
  return visibleTrendArticles(trendArticles);
}

export function getPublicNavCategories() {
  return visibleTrendCategories;
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
