import type { ValidationIssue } from "@global-import-lab/validators";
import type { AdminQualityRow } from "./admin-quality-types";

export function issueCodes(issues: ValidationIssue[]) {
  return issues.length ? issues.map((issue) => issue.code).join(", ") : "-";
}

export function hasSeoIssues(row: Pick<AdminQualityRow, "affiliateIssues" | "hreflangIssues" | "schemaIssues">) {
  return row.affiliateIssues.length > 0 || row.hreflangIssues.length > 0 || row.schemaIssues.length > 0;
}

export function issuesWithPrefix(issues: ValidationIssue[], prefix: string) {
  return issues.filter((issue) => issue.code.startsWith(prefix));
}
