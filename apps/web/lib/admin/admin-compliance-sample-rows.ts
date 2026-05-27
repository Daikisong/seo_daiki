import { complianceIssuesFromJson } from "./admin-section-utils";
import {
  isComplianceRelevantIssue,
  shouldSkipSampleComplianceRow
} from "./admin-compliance-issue-policy";
import type { BuildSampleComplianceRowsInput } from "./admin-compliance-types";

export function buildSampleComplianceRows({
  evaluateQualityGate,
  evidencePacks,
  limit = 80,
  products,
  sampleArticles
}: BuildSampleComplianceRowsInput) {
  return sampleArticles.flatMap((article) => {
    const product = article.productId ? products.find((item) => item.id === article.productId) : undefined;
    const evidencePack = evidencePacks.find((pack) => pack.productId === article.productId && pack.locale === article.locale);
    const gate = evaluateQualityGate({ article, product, evidencePack });
    const relevantIssues = gate.issues.filter((issue) => isComplianceRelevantIssue(issue.code));
    if (shouldSkipSampleComplianceRow(article, relevantIssues.map((issue) => issue.code))) {
      return [];
    }
    return [
      {
        id: article.id,
        title: article.title,
        locale: article.locale,
        type: article.type,
        slug: article.slug,
        publishStatus: article.publishStatus,
        indexStatus: article.indexStatus,
        healthSensitivity: article.healthSensitivity ?? "none",
        complianceStatus: article.complianceStatus ?? "unchecked",
        issues: [...complianceIssuesFromJson(article.complianceJson), ...relevantIssues.map((issue) => issue.code)]
      }
    ];
  }).slice(0, limit);
}
