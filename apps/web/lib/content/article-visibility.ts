import { notFound } from "next/navigation";
import type { Article } from "@global-import-lab/types";
import { canRenderArticleWithPreview, isPreviewTokenAllowed } from "./page-loader-rules";
import type { PreviewSearchParamsPromise } from "./page-loader-types";

export async function assertPublicArticleVisible(
  article: Article,
  searchParamsPromise?: PreviewSearchParamsPromise
) {
  if (await canRenderArticle(article, searchParamsPromise)) {
    return;
  }

  notFound();
}

export async function canRenderArticle(article: Article, searchParamsPromise?: PreviewSearchParamsPromise) {
  return canRenderArticleWithPreview(article, await isPreviewRequest(searchParamsPromise));
}

export async function isPreviewRequest(searchParamsPromise?: PreviewSearchParamsPromise) {
  const expectedToken = process.env.PREVIEW_TOKEN;
  const searchParams = searchParamsPromise ? await searchParamsPromise : undefined;
  return isPreviewTokenAllowed(searchParams, expectedToken);
}
