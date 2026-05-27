import { notFound, permanentRedirect } from "next/navigation";
import { articlePath, regionalRiskRouteForPath } from "@global-import-lab/seo";
import { assertPublicArticleVisible } from "./article-visibility";
import {
  shouldRedirectCountryRiskArticle,
  shouldRedirectLegacyRiskArticle
} from "./page-loader-rules";
import type { ArticleRouteParams, PreviewSearchParamsPromise } from "./page-loader-types";
import { getArticle } from "./repository";
import { articlePageDataForArticle, loadArticlePage } from "./article-page-base-loader";

export async function loadLegacyRiskPage(
  paramsPromise: Promise<ArticleRouteParams>,
  searchParamsPromise?: PreviewSearchParamsPromise
) {
  const page = await loadArticlePage(paramsPromise, "risk", searchParamsPromise);

  if (shouldRedirectLegacyRiskArticle(page.article)) {
    permanentRedirect(articlePath(page.article));
  }

  return page;
}

export async function loadCountryRiskGuidePage(
  paramsPromise: Promise<{ slug: string }>,
  routeLocale: string,
  section: "guides" | "guias",
  searchParamsPromise?: PreviewSearchParamsPromise
) {
  const params = await paramsPromise;
  const route = regionalRiskRouteForPath(routeLocale, section, params.slug);
  if (!route) {
    notFound();
  }

  const article = await getArticle(route.contentLocale, "risk", route.slug);
  if (!article) {
    notFound();
  }

  await assertPublicArticleVisible(article, searchParamsPromise);

  if (shouldRedirectCountryRiskArticle(article, route)) {
    permanentRedirect(articlePath(article));
  }

  return articlePageDataForArticle(article);
}
