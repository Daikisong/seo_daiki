import type { Article } from "@global-import-lab/types";
import { sectionPathForArticle } from "./article-section-routes";
import { localeConfig } from "./locale-config";
import {
  pathForRegionalRiskRoute,
  regionalRiskRouteForArticle
} from "./regional-risk-routes";
import { absoluteUrl, getSiteUrl } from "./site-url";

export function sectionHrefForArticle(article: Pick<Article, "locale" | "type" | "slug">) {
  const regionalRoute = regionalRiskRouteForArticle(article);
  if (regionalRoute) {
    return `/${regionalRoute.routeLocale}/${regionalRoute.section}/`;
  }

  const section = sectionPathForArticle(article);
  return section.length === 0 ? `/${article.locale}/` : `/${article.locale}/${section}/`;
}

export function hreflangKeyForArticle(article: Pick<Article, "locale" | "type" | "slug">) {
  return regionalRiskRouteForArticle(article)?.hreflang ?? localeConfig[article.locale].htmlLang;
}

export function articlePath(article: Pick<Article, "locale" | "type" | "slug">) {
  const regionalRoute = regionalRiskRouteForArticle(article);
  if (regionalRoute) {
    return pathForRegionalRiskRoute(regionalRoute);
  }

  const section = sectionPathForArticle(article);
  if (section.length === 0) {
    return `/${article.locale}/${article.slug}/`;
  }
  return `/${article.locale}/${section}/${article.slug}/`;
}

export function canonicalForArticle(article: Pick<Article, "locale" | "type" | "slug">, siteUrl = getSiteUrl()) {
  return absoluteUrl(articlePath(article), siteUrl);
}
