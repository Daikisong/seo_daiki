import type { Article } from "@global-import-lab/types";

export interface PreviewSearchParams {
  previewToken?: string | string[];
}

export function previewTokenFromSearchParams(searchParams?: PreviewSearchParams) {
  return Array.isArray(searchParams?.previewToken) ? searchParams?.previewToken[0] : searchParams?.previewToken;
}

export function isPreviewTokenAllowed(searchParams: PreviewSearchParams | undefined, expectedToken: string | undefined) {
  if (!expectedToken) {
    return false;
  }
  return previewTokenFromSearchParams(searchParams) === expectedToken;
}

export function canRenderArticleWithPreview(article: Pick<Article, "publishStatus">, previewAllowed: boolean) {
  return article.publishStatus === "published" || previewAllowed;
}
