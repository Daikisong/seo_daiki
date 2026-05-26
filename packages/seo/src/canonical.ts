import type { Article, ArticleType, Locale } from "@global-import-lab/types";

export const localeConfig: Record<
  Locale,
  { label: string; htmlLang: string; marketName: string; country?: string }
> = {
  en: { label: "English", htmlLang: "en", marketName: "Global English" },
  es: { label: "Español", htmlLang: "es", marketName: "Spain and LATAM", country: "ES" },
  "pt-br": { label: "Português (Brasil)", htmlLang: "pt-BR", marketName: "Brazil", country: "BR" }
};

export const sectionPathByType: Record<ArticleType, string> = {
  hub: "",
  review: "reviews",
  guide: "guides",
  compare: "compare",
  data: "data",
  lab: "lab",
  risk: "risk",
  methodology: "methodology"
};

export interface RegionalRiskRoute {
  contentLocale: Locale;
  routeLocale: string;
  hreflang: string;
  country: string;
  section: "guides" | "guias";
  slug: string;
}

export const regionalRiskRoutes: RegionalRiskRoute[] = [
  {
    contentLocale: "en",
    routeLocale: "en-us",
    hreflang: "en-US",
    country: "US",
    section: "guides",
    slug: "aliexpress-chargers-us-buyers"
  },
  {
    contentLocale: "en",
    routeLocale: "en-gb",
    hreflang: "en-GB",
    country: "GB",
    section: "guides",
    slug: "aliexpress-chargers-uk-buyers"
  },
  {
    contentLocale: "es",
    routeLocale: "es-es",
    hreflang: "es-ES",
    country: "ES",
    section: "guias",
    slug: "cargadores-aliexpress-espana"
  },
  {
    contentLocale: "pt-br",
    routeLocale: "pt-br",
    hreflang: "pt-BR",
    country: "BR",
    section: "guias",
    slug: "carregadores-aliexpress-brasil"
  }
];

const localizedReviewSection: Record<Locale, string> = {
  en: "reviews",
  es: "resenas",
  "pt-br": "analises"
};

const localizedGuideSection: Record<Locale, string> = {
  en: "guides",
  es: "guias",
  "pt-br": "guias"
};

export function sectionPathForArticle(article: Pick<Article, "locale" | "type">) {
  if (article.type === "review") {
    return localizedReviewSection[article.locale];
  }

  if (article.type === "guide") {
    return localizedGuideSection[article.locale];
  }

  return sectionPathByType[article.type];
}

export function regionalRiskRouteForArticle(article: Pick<Article, "locale" | "type" | "slug">) {
  if (article.type !== "risk") {
    return undefined;
  }

  return regionalRiskRoutes.find(
    (route) => route.contentLocale === article.locale && route.slug === article.slug
  );
}

export function regionalRiskRouteForPath(routeLocale: string, section: string, slug: string) {
  return regionalRiskRoutes.find(
    (route) => route.routeLocale === routeLocale && route.section === section && route.slug === slug
  );
}

export function pathForRegionalRiskRoute(route: RegionalRiskRoute) {
  return `/${route.routeLocale}/${route.section}/${route.slug}/`;
}

export function sectionHrefForArticle(article: Pick<Article, "locale" | "type" | "slug">) {
  const regionalRoute = regionalRiskRouteForArticle(article);
  if (regionalRoute) {
    return `/${regionalRoute.routeLocale}/${regionalRoute.section}/`;
  }

  const section = sectionPathForArticle(article);
  return section.length === 0 ? `/${article.locale}/` : `/${article.locale}/${section}/`;
}

export function hreflangKeyForArticle(article: Pick<Article, "locale" | "type" | "slug">) {
  return regionalRiskRouteForArticle(article)?.hreflang ?? localeConfig[article.locale].htmlLang;
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");
}

export function articlePath(article: Pick<Article, "locale" | "type" | "slug">) {
  const regionalRoute = regionalRiskRouteForArticle(article);
  if (regionalRoute) {
    return pathForRegionalRiskRoute(regionalRoute);
  }

  const section = sectionPathForArticle(article);
  if (section.length === 0) {
    return `/${article.locale}/${article.slug}/`;
  }
  return `/${article.locale}/${section}/${article.slug}/`;
}

export function absoluteUrl(path: string, siteUrl = getSiteUrl()) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function canonicalForArticle(article: Pick<Article, "locale" | "type" | "slug">, siteUrl = getSiteUrl()) {
  return absoluteUrl(articlePath(article), siteUrl);
}
