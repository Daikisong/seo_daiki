import type { Metadata } from "next";
import type { ArticleType } from "@global-import-lab/types";
import { isLocale } from "@/lib/i18n/locales";
import type { ArticleRouteParams, PreviewSearchParamsPromise } from "./page-loader-types";
import { getArticle } from "./repository";
import { metadataForRenderableArticle } from "./article-metadata-renderer";

export async function generateArticleMetadata(
  paramsPromise: Promise<ArticleRouteParams>,
  type: ArticleType,
  searchParamsPromise?: PreviewSearchParamsPromise
): Promise<Metadata> {
  const params = await paramsPromise;
  if (!isLocale(params.locale)) {
    return {};
  }

  return metadataForRenderableArticle(
    await getArticle(params.locale, type, params.slug),
    searchParamsPromise
  );
}
