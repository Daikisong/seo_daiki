import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import { complianceIssuesFromJson } from "./admin-section-utils";

export const complianceIssuePrefixes = [
  "health_",
  "unsafe_",
  "localization_",
  "translation_",
  "affiliate_placements_over_limit",
  "affiliate_links_exceed_internal_links",
  "affiliate_placement",
  "merchant_allowlist"
];

export interface ComplianceGateResult {
  issues: Array<{ code: string }>;
}

export interface BuildSampleComplianceRowsInput {
  sampleArticles: Article[];
  products: Product[];
  evidencePacks: EvidencePack[];
  evaluateQualityGate: (input: { article: Article; product?: Product; evidencePack?: EvidencePack }) => ComplianceGateResult;
  limit?: number;
}

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

export function isComplianceRelevantIssue(code: string, prefixes = complianceIssuePrefixes) {
  return prefixes.some((prefix) => code.startsWith(prefix));
}

export function shouldSkipSampleComplianceRow(article: Article, relevantIssueCodes: string[]) {
  return (
    article.healthSensitivity === "none" &&
    article.complianceStatus === "passed" &&
    relevantIssueCodes.length === 0
  );
}
