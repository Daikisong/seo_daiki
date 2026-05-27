export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");
}

export function absoluteUrl(path: string, siteUrl = getSiteUrl()) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
