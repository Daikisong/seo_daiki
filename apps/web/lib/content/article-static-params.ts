import { regionalRiskRouteForArticle } from "@global-import-lab/seo";
import type { ArticleType, Locale } from "@global-import-lab/types";
import { localizedParamMatchesSection, reviewParamMatchesSection } from "./page-loader-rules";
import { getAllArticles, getStaticArticleParams } from "./repository";

export function staticParamsFor(type: ArticleType) {
  return getStaticArticleParams(type);
}

export async function staticReviewParamsForSection(section: "reviews" | "resenas" | "analises") {
  const params = await getStaticArticleParams("review");
  return params.filter((param) => reviewParamMatchesSection({ locale: param.locale as Locale }, section));
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
  return params.filter((param) => localizedParamMatchesSection({ locale: param.locale as Locale }, type, section));
}
