import { optional } from "./evidence-record-string-values";

export function optionalNumber(formData: FormData, name: string) {
  const raw = optional(formData, name);
  if (raw === undefined) {
    return undefined;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be numeric.`);
  }
  return value;
}

export function optionalInteger(formData: FormData, name: string) {
  const value = optionalNumber(formData, name);
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isInteger(value)) {
    throw new Error(`${name} must be an integer.`);
  }
  return value;
}
