export function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : value === undefined || value === null ? "" : String(value);
}

export function numberValue(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function dateValue(value: unknown) {
  const raw = stringValue(value);
  if (!raw) {
    return undefined;
  }
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? undefined : date;
}
