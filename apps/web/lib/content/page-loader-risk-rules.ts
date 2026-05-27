import type { Article } from "@global-import-lab/types";
import { articlePath, type RegionalRiskRoute } from "@global-import-lab/seo";

export function legacyRiskPathForArticle(article: Pick<Article, "locale" | "slug">) {
  return `/${article.locale}/risk/${article.slug}/`;
}

export function countryRiskRoutePath(route: Pick<RegionalRiskRoute, "routeLocale" | "section" | "slug">) {
  return `/${route.routeLocale}/${route.section}/${route.slug}/`;
}

export function shouldRedirectLegacyRiskArticle(article: Pick<Article, "locale" | "type" | "slug">) {
  return articlePath(article) !== legacyRiskPathForArticle(article);
}

export function shouldRedirectCountryRiskArticle(
  article: Pick<Article, "locale" | "type" | "slug">,
  route: Pick<RegionalRiskRoute, "routeLocale" | "section" | "slug">
) {
  return articlePath(article) !== countryRiskRoutePath(route);
}
