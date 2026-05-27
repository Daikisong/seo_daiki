import type { Article } from "@global-import-lab/types";
import { canonicalForArticle, hreflangKeyForArticle } from "@global-import-lab/seo";
import type { ValidationIssue } from "./types";
import { normalizeUrl } from "./validationUtils";

export function canonicalIntegrityIssues(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const expectedCanonical = canonicalForArticle(article);
  const ownHref = article.hreflangMap[hreflangKeyForArticle(article)] ?? article.hreflangMap[article.locale];

  if (article.canonicalUrl && normalizeUrl(article.canonicalUrl) !== normalizeUrl(expectedCanonical)) {
    issues.push({
      code: "canonical_mismatch",
      message: `Stored canonical ${article.canonicalUrl} should match generated canonical ${expectedCanonical}.`,
      severity: "blocker"
    });
  }

  if (ownHref && normalizeUrl(ownHref) !== normalizeUrl(expectedCanonical)) {
    issues.push({
      code: "hreflang_self_mismatch",
      message: `Self hreflang ${ownHref} should match the page canonical ${expectedCanonical}.`,
      severity: "blocker"
    });
  }

  return issues;
}
