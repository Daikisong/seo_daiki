import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";

export function validatePublishStateGuard(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (article.indexStatus === "index" && article.publishStatus !== "published") {
    issues.push({
      code: "publish_state_not_published",
      message: "Indexable articles must be published.",
      severity: "blocker"
    });
  }

  if (article.indexStatus === "index" && article.qualityScore < 80) {
    issues.push({
      code: "quality_score_below_index_threshold",
      message: `Indexable articles need qualityScore >= 80; found ${article.qualityScore}.`,
      severity: "blocker"
    });
  }

  return issues;
}
