import { permanentRedirect } from "next/navigation";
import { articlePath } from "@global-import-lab/seo";
import {
  expectedGuideSectionForLocale,
  expectedReviewSectionForLocale
} from "./page-loader-rules";
import type { ArticleRouteParams, PreviewSearchParamsPromise } from "./page-loader-types";
import { loadArticlePage } from "./article-page-base-loader";

export async function loadReviewPageForSection(
  paramsPromise: Promise<ArticleRouteParams>,
  section: "reviews" | "resenas" | "analises",
  searchParamsPromise?: PreviewSearchParamsPromise
) {
  const page = await loadArticlePage(paramsPromise, "review", searchParamsPromise);
  const expectedSection = expectedReviewSectionForLocale(page.article.locale);

  if (section !== expectedSection) {
    permanentRedirect(articlePath(page.article));
  }

  return page;
}

export async function loadGuidePageForSection(
  paramsPromise: Promise<ArticleRouteParams>,
  section: "guides" | "guias",
  searchParamsPromise?: PreviewSearchParamsPromise
) {
  const page = await loadArticlePage(paramsPromise, "guide", searchParamsPromise);
  const expectedSection = expectedGuideSectionForLocale(page.article.locale);

  if (section !== expectedSection) {
    permanentRedirect(articlePath(page.article));
  }

  return page;
}

export async function loadGuidePageForFixedLocale(
  paramsPromise: Promise<{ slug: string }>,
  locale: "es" | "pt-br",
  section: "guias",
  searchParamsPromise?: PreviewSearchParamsPromise
) {
  const params = await paramsPromise;
  return loadGuidePageForSection(Promise.resolve({ locale, slug: params.slug }), section, searchParamsPromise);
}
