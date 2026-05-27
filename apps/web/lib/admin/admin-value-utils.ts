export function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function summarizeJson(value: unknown) {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return `${value.length} items`;
  }
  if (isRecord(value)) {
    return Object.keys(value).slice(0, 5).join(", ");
  }
  return String(value);
}

export function numericRecord(value: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, numberFromUnknown(item)]));
}

export function scoreBreakdownSummary(value: Record<string, number>) {
  const entries = Object.entries(value);
  if (entries.length === 0) {
    return "-";
  }
  return entries
    .slice(0, 4)
    .map(([key, item]) => `${key.replace(/Score$/, "")} ${item}`)
    .join(", ");
}

export function stringFromSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function stringFromUnknown(value: unknown) {
  return typeof value === "string" ? value.trim() : value === undefined || value === null ? "" : String(value);
}

export function stringArrayFromUnknown(value: unknown) {
  return Array.isArray(value) ? value.flatMap((item) => (typeof item === "string" ? [item] : [])) : [];
}

export function numberFromUnknown(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}
