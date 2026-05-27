import type { ValidationIssue } from "./types";

export interface ForbiddenHealthClaimRule {
  pattern: RegExp;
  code: string;
  message: string;
}

export const forbiddenHealthClaimRules: ForbiddenHealthClaimRule[] = [
  {
    pattern: /\b(cure|cures|cured|curing|treat|treats|treated|treating|prevent|prevents|prevented|preventing)\b/i,
    code: "health_claim_disease_language",
    message: "Health content cannot use cure, treatment, or prevention language without qualified evidence and manual approval."
  },
  {
    pattern: /\bguaranteed\b/i,
    code: "health_claim_guarantee",
    message: "Health content cannot use guaranteed outcome language."
  },
  {
    pattern: /\bdoctor recommended\b/i,
    code: "health_claim_doctor_recommended",
    message: "Doctor-recommended claims need qualified source evidence and manual approval."
  },
  {
    pattern: /\bclinically proven\b/i,
    code: "health_claim_clinically_proven",
    message: "Clinically-proven claims need qualified clinical source evidence."
  },
  {
    pattern: /\breplace (your )?(medicine|medication|treatment|doctor)\b/i,
    code: "health_claim_medical_replacement",
    message: "Health content cannot recommend replacing medical treatment or a professional consultation."
  },
  {
    pattern: /\b(before and after|transformation|transform your body|rapid results)\b/i,
    code: "health_claim_transformation",
    message: "Unsupported before/after or transformation claims are blocked for health content."
  },
  {
    pattern: /\b(you should take|you need to take|safe for everyone|stop taking medication)\b/i,
    code: "health_claim_medical_advice",
    message: "Medical advice language is blocked for supplement content."
  }
];

export function forbiddenHealthClaimIssues(fullText: string, hasQualifiedHealthEvidence: boolean): ValidationIssue[] {
  if (hasQualifiedHealthEvidence) {
    return [];
  }

  return forbiddenHealthClaimRules
    .filter((claim) => claim.pattern.test(fullText))
    .map((claim) => ({
      code: claim.code,
      message: claim.message,
      severity: "blocker" as const
    }));
}
