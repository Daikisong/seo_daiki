import { complianceIssuesFromJson, summarizeJson } from "./admin-section-utils";
import type { ComplianceArticleRow, LocalizationGroupRow, PublishingJobRow } from "./admin-section-db-row-types";

export function mapDbPublishingJobRow(row: PublishingJobRow) {
  return {
    id: row.id,
    locale: row.locale,
    jobType: row.jobType,
    status: row.status,
    targetLabel: row.article?.title ?? row.topic?.canonicalTopic ?? row.articleId ?? row.topicId ?? "-",
    outputSummary: summarizeJson(row.outputJson),
    error: row.error,
    dbBacked: true
  };
}

export function mapDbComplianceArticleRow(row: ComplianceArticleRow) {
  return {
    id: row.id,
    title: row.title,
    locale: row.locale,
    type: row.type,
    slug: row.slug,
    publishStatus: row.publishStatus,
    indexStatus: row.indexStatus,
    healthSensitivity: row.healthSensitivity,
    complianceStatus: row.complianceStatus,
    issues: complianceIssuesFromJson(row.complianceJson)
  };
}

export function mapDbLocalizationGroupRow(row: LocalizationGroupRow) {
  return {
    id: row.id,
    topicLabel: row.canonicalTopic?.canonicalTopic ?? "translation group",
    sourceLabel: row.sourceArticle ? `${row.sourceArticle.locale}/${row.sourceArticle.type}/${row.sourceArticle.slug}` : "-",
    variants: row.variants.map((variant) => ({
      locale: variant.locale,
      status: variant.status,
      localizationDepthScore: variant.localizationDepthScore
    }))
  };
}
