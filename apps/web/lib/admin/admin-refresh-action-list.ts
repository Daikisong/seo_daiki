export function normalizeActionList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  if (value && typeof value === "object") {
    return [JSON.stringify(value)];
  }
  return value ? [String(value)] : [];
}
