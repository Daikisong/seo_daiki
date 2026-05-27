import { required } from "./evidence-record-string-values";

export const evidenceRecordLocales = ["en", "es", "pt-br"] as const;

export function parseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`packJson must be valid JSON: ${error instanceof Error ? error.message : "parse failed"}`);
  }
}

export function requiredLocale(formData: FormData) {
  const locale = required(formData, "locale");
  if (!evidenceRecordLocales.includes(locale as (typeof evidenceRecordLocales)[number])) {
    throw new Error(`Invalid locale: ${locale}`);
  }
  return locale;
}
