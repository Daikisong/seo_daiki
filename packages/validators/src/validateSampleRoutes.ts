import type { Article } from "@global-import-lab/types";
import { articlePath } from "@global-import-lab/seo";

export const localizedSectionExpectations = [
  { type: "trend", locale: "en", section: "/en/trends/" },
  { type: "trend", locale: "es", section: "/es/tendencias/" },
  { type: "trend", locale: "pt-br", section: "/pt-br/tendencias/" },
  { type: "buyer_guide", locale: "en", section: "/en/buyer-guides/" },
  { type: "buyer_guide", locale: "es", section: "/es/guias-de-compra/" },
  { type: "buyer_guide", locale: "pt-br", section: "/pt-br/guias-de-compra/" },
  { type: "deal_watch", locale: "en", section: "/en/deals/" },
  { type: "deal_watch", locale: "es", section: "/es/ofertas/" },
  { type: "deal_watch", locale: "pt-br", section: "/pt-br/ofertas/" },
  { type: "ingredient_guide", locale: "en", section: "/en/ingredients/" },
  { type: "ingredient_guide", locale: "es", section: "/es/ingredientes/" },
  { type: "ingredient_guide", locale: "pt-br", section: "/pt-br/ingredientes/" }
] as const;

export const requiredRiskPaths = new Map([
  ["aliexpress-chargers-us-buyers", "/en-us/guides/aliexpress-chargers-us-buyers/"],
  ["aliexpress-chargers-uk-buyers", "/en-gb/guides/aliexpress-chargers-uk-buyers/"],
  ["cargadores-aliexpress-espana", "/es-es/guias/cargadores-aliexpress-espana/"],
  ["carregadores-aliexpress-brasil", "/pt-br/guias/carregadores-aliexpress-brasil/"]
]);

export function sampleRouteFailures({
  articles,
  indexableCount,
  plannedUrlTotal
}: {
  articles: Article[];
  indexableCount: number;
  plannedUrlTotal: number;
}) {
  return [
    ...samplePlanFailures(plannedUrlTotal, indexableCount),
    ...localizedReviewRouteFailures(articles),
    ...localizedGuideRouteFailures(articles),
    ...localizedSectionRouteFailures(articles),
    ...countryRiskRouteFailures(articles)
  ];
}

export function samplePlanFailures(plannedUrlTotal: number, indexableCount: number) {
  const failures: string[] = [];
  if (plannedUrlTotal !== 110) {
    failures.push(`Initial URL plan should generate 110 URLs, but generated ${plannedUrlTotal}.`);
  }

  if (indexableCount < 40 || indexableCount > 80) {
    failures.push(`Initial index selection should stay between 40 and 80 pages after trend-route expansion, but found ${indexableCount}.`);
  }
  return failures;
}

export function localizedReviewRouteFailures(articles: Article[]) {
  const failures: string[] = [];
  for (const article of articles.filter((item) => item.type === "review")) {
    const path = articlePath(article);
    if (article.locale === "es" && !path.includes("/es/resenas/")) {
      failures.push(`Spanish review should use /es/resenas/: ${path}`);
    }
    if (article.locale === "pt-br" && !path.includes("/pt-br/analises/")) {
      failures.push(`Brazilian review should use /pt-br/analises/: ${path}`);
    }
    if (article.locale === "en" && !path.includes("/en/reviews/")) {
      failures.push(`English review should use /en/reviews/: ${path}`);
    }
  }
  return failures;
}

export function localizedGuideRouteFailures(articles: Article[]) {
  const failures: string[] = [];
  for (const article of articles.filter((item) => item.type === "guide")) {
    const path = articlePath(article);
    if (article.locale === "es" && !path.includes("/es/guias/")) {
      failures.push(`Spanish guide should use /es/guias/: ${path}`);
    }
    if (article.locale === "pt-br" && !path.includes("/pt-br/guias/")) {
      failures.push(`Brazilian guide should use /pt-br/guias/: ${path}`);
    }
  }
  return failures;
}

export function localizedSectionRouteFailures(articles: Article[]) {
  const failures: string[] = [];
  for (const expectation of localizedSectionExpectations) {
    const article = articles.find((item) => item.type === expectation.type && item.locale === expectation.locale);
    const path = article ? articlePath(article) : undefined;
    if (!path?.startsWith(expectation.section)) {
      failures.push(`${expectation.locale}/${expectation.type} should use ${expectation.section}, but found ${path ?? "missing"}.`);
    }
  }
  return failures;
}

export function countryRiskRouteFailures(articles: Article[]) {
  const failures: string[] = [];
  for (const [slug, expectedPath] of requiredRiskPaths) {
    const article = articles.find((item) => item.type === "risk" && item.slug === slug);
    const path = article ? articlePath(article) : undefined;
    if (path !== expectedPath) {
      failures.push(`Country-risk page should use ${expectedPath}, but found ${path ?? "missing"}.`);
    }
  }
  return failures;
}
