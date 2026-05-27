import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";

export function absoluteHreflangIssues(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [hreflang, href] of Object.entries(article.hreflangMap)) {
    if (!href) {
      continue;
    }
    if (!/^https?:\/\//i.test(href)) {
      issues.push({
        code: "hreflang_not_absolute",
        message: `Hreflang ${hreflang} must use an absolute URL: ${href}.`,
        severity: "blocker"
      });
    }
  }

  return issues;
}
