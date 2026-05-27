import type { AdminQualityRow, AdminQualityStats } from "./admin-quality-types";
import { hasSeoIssues } from "./admin-quality-issues";

export function buildAdminQualityStats(rows: AdminQualityRow[]): AdminQualityStats {
  return {
    indexedPages: rows.filter(({ article }) => article.indexStatus === "index").length,
    avgInternalLinks: average(rows.map(({ article }) => article.internalLinks.length)),
    seoIssueRows: rows.filter(hasSeoIssues).length,
    duplicateCandidates: rows.reduce((sum, row) => sum + row.duplicateCandidateCount, 0)
  };
}

export function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
