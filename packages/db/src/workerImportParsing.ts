export function refreshSuggestionPayload(row: Record<string, unknown>) {
  return {
    action: Array.isArray(row.action) ? row.action.map((item) => String(item)) : [],
    priority: numberValue(row.priority) ?? undefined,
    country: stringValue(row.country) || undefined,
    device: stringValue(row.device) || undefined,
    diagnostics: isRecord(row.diagnostics) ? row.diagnostics : undefined,
    missing_sections: Array.isArray(row.missing_sections) ? row.missing_sections : [],
    title_candidate: stringValue(row.title_candidate) || undefined,
    meta_description_candidate: stringValue(row.meta_description_candidate) || undefined,
    internal_link_candidates: Array.isArray(row.internal_link_candidates) ? row.internal_link_candidates : []
  };
}

export function uniqueRows<T>(rows: T[], keyFn: (row: T) => string) {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = keyFn(row);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function variantKey(row: Record<string, unknown>) {
  return [row.option, row.optionName, row.source_sku, row.sourceSku].map(String).join("|");
}

export function claimKey(row: Record<string, unknown>) {
  return [row.claim_type, row.claimType, row.claim_value, row.claimValue, row.raw_text, row.rawText].map(String).join("|");
}

export function signalKey(row: Record<string, unknown>) {
  return [row.locale, row.topic, row.sentiment, row.window].map(String).join("|");
}

export function priceKey(row: Record<string, unknown>) {
  return [row.country, row.currency, row.price, row.shipping, row.final_price, row.finalPrice].map(String).join("|");
}

export function riskKey(row: Record<string, unknown>) {
  return [row.locale, row.country].map(String).join("|");
}

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

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function inferBrand(title: string) {
  return title.split(/\s+/)[0] || undefined;
}

export function parseWattage(value: string) {
  const match = value.match(/(\d+)\s*w/i);
  return match ? Number(match[1]) : undefined;
}

export function parsePlugType(value: string) {
  const match = value.match(/\b(US|EU|UK|AU)\b/i);
  return match ? match[1].toUpperCase() : undefined;
}

export function parseCableIncluded(value: string) {
  if (/no cable|without cable/i.test(value)) {
    return false;
  }
  if (/with cable|cable included/i.test(value)) {
    return true;
  }
  return undefined;
}
