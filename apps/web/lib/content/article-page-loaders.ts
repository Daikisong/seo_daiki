import { notFound, permanentRedirect } from "next/navigation";
import { articlePath, regionalRiskRouteForPath } from "@global-import-lab/seo";
import type { ArticleType } from "@global-import-lab/types";
import { isLocale } from "@/lib/i18n/locales";
import { assertPublicArticleVisible } from "./article-visibility";
import {
  articleMatchesLocalizedSection,
  expectedGuideSectionForLocale,
  expectedReviewSectionForLocale,
  shouldRedirectCountryRiskArticle,
  shouldRedirectLegacyRiskArticle
} from "./page-loader-rules";
import type { ArticleRouteParams, PreviewSearchParamsPromise } from "./page-loader-types";
import { getAllArticles, getAllProducts, getArticle, getProduct } from "./repository";

export async function loadArticlePage(
  paramsPromise: Promise<ArticleRouteParams>,
  type: ArticleType,
  searchParamsPromise?: PreviewSearchParamsPromise
) {
  const params = await paramsPromise;
  if (!isLocale(params.locale)) {
    notFound();
  }

  const article = await getArticle(params.locale, type, params.slug);
  if (!article) {
    notFound();
  }

  await assertPublicArticleVisible(article, searchParamsPromise);

  return {
    article,
    product: await getProduct(article.productId),
    allProducts: await getAllProducts(),
    allArticles: await getAllArticles()
  };
}

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

  return {
    article,
    product: await getProduct(article.productId),
    allProducts: await getAllProducts(),
    allArticles: await getAllArticles()
  };
}
