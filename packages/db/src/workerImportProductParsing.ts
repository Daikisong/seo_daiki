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
