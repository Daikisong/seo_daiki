import type { ValidationIssue } from "./types";

export function dosageAdviceIssue(fullText: string, hasQualifiedHealthEvidence: boolean): ValidationIssue | undefined {
  if (hasQualifiedHealthEvidence) {
    return undefined;
  }
  if (!/\b(dosage|dose|take \d+|\d+\s?(mg|mcg|g|iu)\b|mg per day|capsules per day)\b/i.test(fullText)) {
    return undefined;
  }
  return {
    code: "health_dosage_without_source",
    message: "Supplement dosage advice needs qualified source evidence or label-direction context.",
    severity: "blocker"
  };
}

export function healthSensitiveWarningIssue(fullText: string): ValidationIssue | undefined {
  if (!/\b(pregnancy|pregnant|medication|children|child|chronic illness|chronic condition)\b/i.test(fullText)) {
    return undefined;
  }
  if (/\bconsult\b/i.test(fullText)) {
    return undefined;
  }
  return {
    code: "health_sensitive_warning_missing",
    message: "Health content mentioning pregnancy, medication, children, or chronic illness needs a consult-professional warning.",
    severity: "blocker"
  };
}
