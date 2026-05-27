import type { Article, Locale } from "@global-import-lab/types";

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
