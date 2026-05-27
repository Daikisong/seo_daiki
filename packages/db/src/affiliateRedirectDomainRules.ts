export function hasSponsoredNofollow(rel: string) {
  const tokens = new Set(rel.split(/\s+/).filter(Boolean));
  return tokens.has("sponsored") && tokens.has("nofollow");
}

export function isAllowedMerchantUrl(value: string, allowedDomains: unknown) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return allowedDomainList(allowedDomains).some((domain) => hostMatchesDomain(host, domain));
  } catch {
    return false;
  }
}

export function allowedDomainList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => (typeof item === "string" && item.trim() ? [item.trim().toLowerCase()] : []));
}

export function hostMatchesDomain(host: string, domain: string) {
  const normalized = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^\*\./, "")
    .toLowerCase();

  return host === normalized || host.endsWith(`.${normalized}`);
}
