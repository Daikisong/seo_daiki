import type { Article, Locale } from "@global-import-lab/types";
import { articlePath, sectionPathForArticle, type RegionalRiskRoute } from "@global-import-lab/seo";

export interface PreviewSearchParams {
  previewToken?: string | string[];
}

export function expectedReviewSectionForLocale(locale: Locale): "reviews" | "resenas" | "analises" {
  if (locale === "es") {
    return "resenas";
  }
  if (locale === "pt-br") {
    return "analises";
  }
  return "reviews";
}

export function expectedGuideSectionForLocale(locale: Locale): "guides" | "guias" {
  return locale === "en" ? "guides" : "guias";
}

export function articleMatchesLocalizedSection(article: Pick<Article, "locale" | "type">, section: string) {
  return section === sectionPathForArticle(article);
}

export function legacyRiskPathForArticle(article: Pick<Article, "locale" | "slug">) {
  return `/${article.locale}/risk/${article.slug}/`;
}

export function countryRiskRoutePath(route: Pick<RegionalRiskRoute, "routeLocale" | "section" | "slug">) {
  return `/${route.routeLocale}/${route.section}/${route.slug}/`;
}

export function shouldRedirectLegacyRiskArticle(article: Pick<Article, "locale" | "type" | "slug">) {
  return articlePath(article) !== legacyRiskPathForArticle(article);
}

export function shouldRedirectCountryRiskArticle(
  article: Pick<Article, "locale" | "type" | "slug">,
  route: Pick<RegionalRiskRoute, "routeLocale" | "section" | "slug">
) {
  return articlePath(article) !== countryRiskRoutePath(route);
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

export function reviewParamMatchesSection(
  param: Pick<Article, "locale">,
  section: "reviews" | "resenas" | "analises"
) {
  return expectedReviewSectionForLocale(param.locale) === section;
}

export function localizedParamMatchesSection(
  param: Pick<Article, "locale">,
  type: Article["type"],
  section: string
) {
  return articleMatchesLocalizedSection({ locale: param.locale, type }, section);
}
