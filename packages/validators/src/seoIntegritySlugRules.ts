import type { Article } from "@global-import-lab/types";
import { articlePath } from "@global-import-lab/seo";
import type { ValidationIssue } from "./types";

export function slugIntegrityIssues(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const expectedPath = articlePath(article);

  if (!expectedPath.endsWith(`/${article.slug}/`)) {
    issues.push({
      code: "slug_path_mismatch",
      message: `Article slug ${article.slug} is not the final path segment in ${expectedPath}.`,
      severity: "blocker"
    });
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
    issues.push({
      code: "slug_format_invalid",
      message: `Slug should be lowercase ASCII words separated by hyphens: ${article.slug}.`,
      severity: "blocker"
    });
  }

  return issues;
}
