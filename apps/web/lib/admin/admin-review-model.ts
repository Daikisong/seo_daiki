export interface LocalizationVariantSummary {
  locale: string;
  status: string;
  localizationDepthScore: number;
}

export function issueListLabel(issues: string[]) {
  return issues.length > 0 ? issues.join(", ") : "-";
}

export function duplicateCandidateLabel(count: number) {
  return count || "-";
}

export function articleLocaleTypeLabel(article: { locale: string; type: string }) {
  return `${article.locale} / ${article.type}`;
}

export function articleStoredStatusLabel(article: { indexStatus: string; publishStatus: string }) {
  return `${article.publishStatus}/${article.indexStatus}`;
}

export function articlePathLabel(article: { locale: string; slug: string; type: string }) {
  return `${article.locale}/${article.type}/${article.slug}`;
}

export function healthComplianceLabel(row: { complianceStatus: string; healthSensitivity: string }) {
  return `${row.healthSensitivity}/${row.complianceStatus}`;
}

export function auditActorLabel(actor?: string | null) {
  return actor || "-";
}

export function auditSummaryLabel(summary?: string | null) {
  return summary || "-";
}

export function localizationVariantStatusLabel(variants: LocalizationVariantSummary[]) {
  return variants.map((variant) => `${variant.locale}:${variant.status}`).join(", ") || "-";
}

export function localizationDepthLabel(variants: LocalizationVariantSummary[]) {
  return variants.map((variant) => `${variant.locale} ${variant.localizationDepthScore}`).join(", ") || "-";
}

export function localizationPrimaryLocale(variants: LocalizationVariantSummary[]) {
  return variants[0]?.locale || "en";
}
