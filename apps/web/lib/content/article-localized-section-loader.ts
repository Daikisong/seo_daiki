import { permanentRedirect } from "next/navigation";
import { articlePath } from "@global-import-lab/seo";
import type { ArticleType } from "@global-import-lab/types";
import { articleMatchesLocalizedSection } from "./page-loader-rules";
import type { ArticleRouteParams, PreviewSearchParamsPromise } from "./page-loader-types";
import { loadArticlePage } from "./article-page-base-loader";

export async function loadArticlePageForLocalizedSection(
  paramsPromise: Promise<ArticleRouteParams>,
  type: ArticleType,
  section: string,
  searchParamsPromise?: PreviewSearchParamsPromise
) {
  const page = await loadArticlePage(paramsPromise, type, searchParamsPromise);

  if (!articleMatchesLocalizedSection(page.article, section)) {
    permanentRedirect(articlePath(page.article));
  }

  return page;
}
