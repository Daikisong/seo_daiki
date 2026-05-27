export function normalizeUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    url.pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    return url.toString();
  } catch {
    return value.endsWith("/") ? value : `${value}/`;
  }
}

export function hostForUrl(value: string) {
  try {
    return new URL(value, "https://example.com").hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

export function hostMatchesDomain(host: string, domain: string) {
  const normalized = domain
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^\*\./, "")
    .toLowerCase();

  return host === normalized || host.endsWith(`.${normalized}`);
}
