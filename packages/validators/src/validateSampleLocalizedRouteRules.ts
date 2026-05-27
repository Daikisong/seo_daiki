import type { Article } from "@global-import-lab/types";
import { articlePath } from "@global-import-lab/seo";
import { localizedSectionExpectations } from "./validateSampleRouteExpectations";

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
