import type { IndexStatus } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";

export function indexStatusForQualityGate(score: number, issues: ValidationIssue[]): IndexStatus {
  const hasBlocker = issues.some((issue) => issue.severity === "blocker");
  return hasBlocker ? "noindex" : score >= 80 ? "index" : score >= 65 ? "pending" : "noindex";
}
