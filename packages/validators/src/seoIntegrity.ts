import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";
import { canonicalIntegrityIssues } from "./seoIntegrityCanonicalRules";
import { absoluteHreflangIssues } from "./seoIntegrityHreflangRules";
import { metadataIntegrityIssues } from "./seoIntegrityMetadataRules";
import { slugIntegrityIssues } from "./seoIntegritySlugRules";

export function validateSeoIntegrity(article: Article): ValidationIssue[] {
  return [
    ...canonicalIntegrityIssues(article),
    ...slugIntegrityIssues(article),
    ...metadataIntegrityIssues(article),
    ...absoluteHreflangIssues(article)
  ];
}
