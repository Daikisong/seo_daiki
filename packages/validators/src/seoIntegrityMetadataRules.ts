import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";

export function metadataIntegrityIssues(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (article.title.length < 35 || article.title.length > 80) {
    issues.push({
      code: "title_length_outside_seo_range",
      message: `Title length should stay between 35 and 80 characters; found ${article.title.length}.`,
      severity: "warning"
    });
  }

  if (article.metaDescription.length < 90 || article.metaDescription.length > 170) {
    issues.push({
      code: "meta_description_length_outside_seo_range",
      message: `Meta description length should stay between 90 and 170 characters; found ${article.metaDescription.length}.`,
      severity: "warning"
    });
  }

  if (/^best\b.+\b20\d{2}\b/i.test(article.title)) {
    issues.push({
      code: "generic_best_year_title",
      message: "Title should not use generic 'Best ... 20xx' phrasing without evidence-first specificity.",
      severity: "blocker"
    });
  }

  return issues;
}
