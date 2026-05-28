import type { Metadata } from "next";
import type { PreviewSearchParamsPromise } from "./page-loader-types";
import { getArticle } from "./repository";
import { metadataForRenderableArticle } from "./article-metadata-renderer";

export async function generateFixedLocaleGuideMetadata(
  paramsPromise: Promise<{ slug: string }>,
  locale: "es" | "pt-br",
  searchParamsPromise?: PreviewSearchParamsPromise
): Promise<Metadata> {
  const params = await paramsPromise;
  return metadataForRenderableArticle(
    await getArticle(locale, "guide", params.slug),
    searchParamsPromise
  );
}
