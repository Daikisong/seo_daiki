import { normalizeUrl, stringField } from "./validationUtils";
import type { ValidationIssue } from "./types";

export function requireSchemaType(
  issues: ValidationIssue[],
  schema: Record<string, unknown>,
  expectedType: string,
  code: string,
  message: string
) {
  if (stringField(schema, "@type") !== expectedType) {
    issues.push({ code, message, severity: "blocker" });
  }
}

export function requireTextField(
  issues: ValidationIssue[],
  schema: Record<string, unknown>,
  field: string,
  code: string,
  message: string
) {
  if (!stringField(schema, field)?.trim()) {
    issues.push({ code, message, severity: "blocker" });
  }
}

export function requireUrlField(
  issues: ValidationIssue[],
  schema: Record<string, unknown>,
  field: string,
  expectedUrl: string,
  code: string,
  message: string
) {
  const value = stringField(schema, field);
  if (!value || normalizeUrl(value) !== normalizeUrl(expectedUrl)) {
    issues.push({ code, message, severity: "blocker" });
  }
}
