import type { Article } from "@global-import-lab/types";
import { articlePath } from "@global-import-lab/seo";
import { requiredRiskPaths } from "./validateSampleRouteExpectations";

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
