import type { Article } from "@global-import-lab/types";
import { hreflangKeyForArticle } from "@global-import-lab/seo";
import type { ValidationIssue } from "./types";

export function validateHreflang(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ownHref = article.hreflangMap[hreflangKeyForArticle(article)] ?? article.hreflangMap[article.locale];
  if (!ownHref) {
    issues.push({
      code: "hreflang_self_missing",
      message: "Localized pages must include a self hreflang alternate.",
      severity: "blocker"
    });
  }

  if (!article.hreflangMap["x-default"]) {
    issues.push({
      code: "hreflang_default_missing",
      message: "Localized pages must include an x-default alternate.",
      severity: "warning"
    });
  }

  return issues;
}
