const locales = ["en", "es", "pt-br"] as const;

export function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function required(formData: FormData, name: string) {
  const value = stringValue(formData.get(name));
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

export function optional(formData: FormData, name: string) {
  return stringValue(formData.get(name)) || undefined;
}

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

export function listValue(formData: FormData, name: string) {
  return stringValue(formData.get(name))
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`packJson must be valid JSON: ${error instanceof Error ? error.message : "parse failed"}`);
  }
}

export function requiredLocale(formData: FormData) {
  const locale = required(formData, "locale");
  if (!locales.includes(locale as (typeof locales)[number])) {
    throw new Error(`Invalid locale: ${locale}`);
  }
  return locale;
}
