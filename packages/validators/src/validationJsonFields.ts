import { isRecord } from "./validationRecordUtils";

export function numericJsonField(value: unknown, field: string) {
  if (!isRecord(value)) {
    return undefined;
  }
  const raw = value[field];
  return typeof raw === "number" && Number.isFinite(raw) ? raw : undefined;
}

export function stringJsonField(value: unknown, field: string) {
  if (!isRecord(value)) {
    return undefined;
  }
  const raw = value[field];
  return typeof raw === "string" ? raw : undefined;
}

export function booleanJsonField(value: unknown, field: string) {
  if (!isRecord(value)) {
    return false;
  }
  return value[field] === true;
}
