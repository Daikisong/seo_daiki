import type { Metadata } from "next";
import type { Article } from "@global-import-lab/types";
import { metadataForArticle } from "../seo/metadata";
import { canRenderArticle, isPreviewRequest } from "./article-visibility";
import type { PreviewSearchParamsPromise } from "./page-loader-types";

export async function metadataForRenderableArticle(
  article: Article | null | undefined,
  searchParamsPromise?: PreviewSearchParamsPromise
): Promise<Metadata> {
  if (!article || !(await canRenderArticle(article, searchParamsPromise))) {
    return {};
  }

  return metadataForArticle(article, { forceNoindex: await isPreviewRequest(searchParamsPromise) });
}
