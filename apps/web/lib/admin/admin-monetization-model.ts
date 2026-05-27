export function booleanStatusLabel(value: boolean, trueLabel: string, falseLabel: string) {
  return value ? trueLabel : falseLabel;
}

export function merchantHealthLabel(merchant: { healthSensitive: boolean }) {
  return booleanStatusLabel(merchant.healthSensitive, "health-sensitive", "standard");
}

export function merchantEnabledLabel(merchant: { enabled: boolean }) {
  return booleanStatusLabel(merchant.enabled, "enabled", "disabled");
}

export function allowedDomainsLabel(domains: string[]) {
  return domains.join(", ");
}

export function offerLocaleLabel(locale?: string | null) {
  return locale ?? "-";
}

export function placementDisclosureLabel(placement: { disclosureShown: boolean }) {
  return booleanStatusLabel(placement.disclosureShown, "confirmed", "missing");
}

export function candidateApprovalLabel(candidate: { humanApprovalRequired: boolean }) {
  return booleanStatusLabel(candidate.humanApprovalRequired, "human approval required", "not required");
}

export function candidateArticleLabel(candidate: { articleId?: string | null; briefId?: string | null }) {
  return candidate.articleId || candidate.briefId || "-";
}

export function articleRouteLabel(article: { articleLocale: string; articleSlug: string; articleType: string }) {
  return `${article.articleLocale}/${article.articleType}/${article.articleSlug}`;
}
