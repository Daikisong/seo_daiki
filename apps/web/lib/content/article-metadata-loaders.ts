import type { Metadata } from "next";
import { regionalRiskRouteForPath } from "@global-import-lab/seo";
import type { ArticleType } from "@global-import-lab/types";
import { isLocale } from "@/lib/i18n/locales";
import { metadataForArticle } from "@/lib/seo/metadata";
import { canRenderArticle, isPreviewRequest } from "./article-visibility";
import type { ArticleRouteParams, PreviewSearchParamsPromise } from "./page-loader-types";
import { getArticle } from "./repository";

export async function generateArticleMetadata(
  paramsPromise: Promise<ArticleRouteParams>,
  type: ArticleType,
  searchParamsPromise?: PreviewSearchParamsPromise
): Promise<Metadata> {
  const params = await paramsPromise;
  if (!isLocale(params.locale)) {
    return {};
  }

  const article = await getArticle(params.locale, type, params.slug);
  if (!article || !(await canRenderArticle(article, searchParamsPromise))) {
    return {};
  }

  return metadataForArticle(article, { forceNoindex: await isPreviewRequest(searchParamsPromise) });
}

export async function generateCountryRiskGuideMetadata(
  paramsPromise: Promise<{ slug: string }>,
  routeLocale: string,
  section: "guides" | "guias",
  searchParamsPromise?: PreviewSearchParamsPromise
): Promise<Metadata> {
  const params = await paramsPromise;
  const route = regionalRiskRouteForPath(routeLocale, section, params.slug);
  if (!route) {
    return {};
  }

  const article = await getArticle(route.contentLocale, "risk", route.slug);
  if (!article || !(await canRenderArticle(article, searchParamsPromise))) {
    return {};
  }

  return metadataForArticle(article, { forceNoindex: await isPreviewRequest(searchParamsPromise) });
}

export async function generateFixedLocaleGuideMetadata(
  paramsPromise: Promise<{ slug: string }>,
  locale: "es" | "pt-br",
  searchParamsPromise?: PreviewSearchParamsPromise
): Promise<Metadata> {
  const params = await paramsPromise;
  const article = await getArticle(locale, "guide", params.slug);
  if (!article || !(await canRenderArticle(article, searchParamsPromise))) {
    return {};
  }

  return metadataForArticle(article, { forceNoindex: await isPreviewRequest(searchParamsPromise) });
}
