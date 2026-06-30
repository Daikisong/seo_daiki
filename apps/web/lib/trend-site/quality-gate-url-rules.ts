import { getSiteUrl } from "./routes";

export type DirectOutboundContext = {
  siteOrigin?: string;
};

export function isDirectHttpsOutbound(
  value: string,
  context: DirectOutboundContext = {},
) {
  try {
    const url = new URL(value);
    const siteOrigin = context.siteOrigin ?? configuredSiteOrigin();
    if (url.protocol !== "https:") {
      return false;
    }
    if (siteOrigin && url.origin === siteOrigin) {
      return false;
    }
    if (isInternalRedirectPath(url.pathname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function isInternalRedirectPath(pathname: string) {
  return /^\/(api|out|go|redirect|affiliate-click)(\/|$)/i.test(pathname);
}

export function isMarketplaceSearchUrl(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();
    const search = url.searchParams;
    return (
      (host.endsWith("aliexpress.com") &&
        (path.includes("/wholesale") ||
          search.has("SearchText") ||
          search.has("searchText") ||
          search.has("keyword"))) ||
      (isAmazonHost(host) && (path === "/s" || search.has("k"))) ||
      (host.endsWith("temu.com") &&
        (path.includes("search") ||
          search.has("search_key") ||
          search.has("q"))) ||
      (host.endsWith("iherb.com") &&
        (path.includes("/search") || search.has("kw") || search.has("q")))
    );
  } catch {
    return false;
  }
}

function isAmazonHost(host: string) {
  return (
    host === "amazon.com" ||
    host.endsWith(".amazon.com") ||
    /^www\.amazon\.[a-z.]+$/.test(host) ||
    /^amazon\.[a-z.]+$/.test(host)
  );
}

function configuredSiteOrigin() {
  try {
    return new URL(getSiteUrl()).origin;
  } catch {
    return undefined;
  }
}
