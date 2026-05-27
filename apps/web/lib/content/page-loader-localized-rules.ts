import type { Article, Locale } from "@global-import-lab/types";
import { sectionPathForArticle } from "@global-import-lab/seo";

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
