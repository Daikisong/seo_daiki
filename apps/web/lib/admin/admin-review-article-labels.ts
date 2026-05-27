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
