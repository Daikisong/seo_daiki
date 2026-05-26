import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { articlePath, regionalRiskRouteForArticle, regionalRiskRouteForPath, sectionPathForArticle } from "@global-import-lab/seo";
import type { ArticleType, Locale } from "@global-import-lab/types";
import { metadataForArticle } from "@/lib/seo/metadata";
import { isLocale } from "@/lib/i18n/locales";
import { getAllArticles, getAllProducts, getArticle, getProduct, getStaticArticleParams } from "./repository";

export interface ArticleRouteParams {
  locale: string;
  slug: string;
}

export interface PreviewSearchParams {
  previewToken?: string | string[];
}

type PreviewSearchParamsPromise = Promise<PreviewSearchParams> | undefined;

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
  const expectedSection =
    page.article.locale === "es" ? "resenas" : page.article.locale === "pt-br" ? "analises" : "reviews";

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
  const expectedSection = page.article.locale === "en" ? "guides" : "guias";

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
  const expectedSection = sectionPathForArticle(page.article);

  if (section !== expectedSection) {
    permanentRedirect(articlePath(page.article));
  }

  return page;
}

export async function loadLegacyRiskPage(
  paramsPromise: Promise<ArticleRouteParams>,
  searchParamsPromise?: PreviewSearchParamsPromise
) {
  const page = await loadArticlePage(paramsPromise, "risk", searchParamsPromise);
  const legacyPath = `/${page.article.locale}/risk/${page.article.slug}/`;

  if (articlePath(page.article) !== legacyPath) {
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

  if (articlePath(article) !== `/${route.routeLocale}/${route.section}/${route.slug}/`) {
    permanentRedirect(articlePath(article));
  }

  return {
    article,
    product: await getProduct(article.productId),
    allProducts: await getAllProducts(),
    allArticles: await getAllArticles()
  };
}

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

export function staticParamsFor(type: ArticleType) {
  return getStaticArticleParams(type);
}

export async function staticReviewParamsForSection(section: "reviews" | "resenas" | "analises") {
  const params = await getStaticArticleParams("review");
  return params.filter((param) => {
    if (section === "reviews") {
      return param.locale === "en";
    }
    if (section === "resenas") {
      return param.locale === "es";
    }
    return param.locale === "pt-br";
  });
}

export async function staticGuideParamsForSection(locale: "es" | "pt-br") {
  const params = await getStaticArticleParams("guide");
  return params.filter((param) => param.locale === locale).map((param) => ({ slug: param.slug }));
}

export async function staticCountryRiskGuideParamsFor(routeLocale: string, section: "guides" | "guias") {
  const articles = await getAllArticles();
  return articles.flatMap((article) => {
    const route = regionalRiskRouteForArticle(article);
    if (article.publishStatus === "published" && route?.routeLocale === routeLocale && route.section === section) {
      return [{ slug: article.slug }];
    }

    return [];
  });
}

export async function staticParamsForLocalizedSection(type: ArticleType, section: string) {
  const params = await getStaticArticleParams(type);
  return params.filter((param) => sectionPathForArticle({ locale: param.locale as Locale, type }) === section);
}

async function assertPublicArticleVisible(article: NonNullable<Awaited<ReturnType<typeof getArticle>>>, searchParamsPromise?: PreviewSearchParamsPromise) {
  if (await canRenderArticle(article, searchParamsPromise)) {
    return;
  }

  notFound();
}

async function canRenderArticle(article: NonNullable<Awaited<ReturnType<typeof getArticle>>>, searchParamsPromise?: PreviewSearchParamsPromise) {
  return article.publishStatus === "published" || (await isPreviewRequest(searchParamsPromise));
}

async function isPreviewRequest(searchParamsPromise?: PreviewSearchParamsPromise) {
  const expectedToken = process.env.PREVIEW_TOKEN;
  if (!expectedToken) {
    return false;
  }

  const searchParams = searchParamsPromise ? await searchParamsPromise : undefined;
  const token = Array.isArray(searchParams?.previewToken) ? searchParams?.previewToken[0] : searchParams?.previewToken;
  return token === expectedToken;
}
