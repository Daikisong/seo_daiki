import type { QualityGateInput, ValidationIssue } from "./types";

export function validateClaimEvidence(input: QualityGateInput): ValidationIssue[] {
  const { article, evidencePack, product } = input;
  const evidenceIds = new Set(article.evidenceIds);
  const backedSections = article.sections.filter((section) => section.evidenceIds?.some((id) => evidenceIds.has(id)));
  const verifiedClaimCount = product?.verifiedClaims.length ?? evidencePack?.packJson.verifiedClaims.length ?? 0;
  const sellerClaimCount = product?.sellerClaims.length ?? evidencePack?.packJson.sellerClaims.length ?? 0;
  const attachedEvidenceCount = verifiedClaimCount + sellerClaimCount || article.evidenceIds.length;
  const issues: ValidationIssue[] = [];

  if (backedSections.length < 3 || attachedEvidenceCount < 3) {
    issues.push({
      code: "evidence_claims_low",
      message: "Indexable articles need at least 3 evidence-backed claims.",
      severity: "blocker"
    });
  }

  const fullText = [article.title, article.summary, ...article.sections.map((section) => section.body)].join(" ");
  const unsupportedTestPhrase = /\b(we tested|our test|lab measured|verified by test)\b/i.test(fullText);
  if (unsupportedTestPhrase && verifiedClaimCount === 0) {
    issues.push({
      code: "test_claim_without_verified_evidence",
      message: "The article uses direct-test language but no verified claims are attached.",
      severity: "blocker"
    });
  }

  return issues;
}
