export const affiliateClickUtmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content"
] as const;

export function collectUtmFromSearchParams(searchParams: URLSearchParams) {
  const utm: Record<string, string> = {};
  for (const key of affiliateClickUtmKeys) {
    const value = searchParams.get(key);
    if (value) {
      utm[key] = value;
    }
  }
  return utm;
}

export function optionalSearchParam(searchParams: URLSearchParams, key: string) {
  return searchParams.get(key) ?? undefined;
}

export function referrerFromHeaders(headers: Headers) {
  return headers.get("referer") ?? undefined;
}
