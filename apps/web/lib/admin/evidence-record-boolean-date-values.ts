import { optional } from "./evidence-record-string-values";

export function optionalBoolean(formData: FormData, name: string) {
  const raw = optional(formData, name);
  if (raw === undefined) {
    return undefined;
  }
  if (["true", "yes", "1"].includes(raw.toLowerCase())) {
    return true;
  }
  if (["false", "no", "0"].includes(raw.toLowerCase())) {
    return false;
  }
  throw new Error(`${name} must be true or false.`);
}

export function optionalDate(formData: FormData, name: string) {
  const raw = optional(formData, name);
  if (!raw) {
    return undefined;
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${name} must be a valid date.`);
  }
  return date;
}
