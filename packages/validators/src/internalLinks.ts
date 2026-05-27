import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";

export function validateInternalLinks(article: Article): ValidationIssue[] {
  if (article.internalLinks.length >= 5) {
    return [];
  }

  return [
    {
      code: "internal_links_low",
      message: `Article has ${article.internalLinks.length} internal links; indexable pages need at least 5.`,
      severity: "blocker"
    }
  ];
}
