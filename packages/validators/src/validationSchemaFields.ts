import { isRecord } from "./validationRecordUtils";

export function stringField(schema: Record<string, unknown>, field: string) {
  const value = schema[field];
  return typeof value === "string" ? value : undefined;
}

export function recordField(schema: Record<string, unknown>, field: string) {
  const value = schema[field];
  return isRecord(value) ? value : undefined;
}

export function arrayField(schema: Record<string, unknown>, field: string) {
  const value = schema[field];
  return Array.isArray(value) ? value : [];
}
