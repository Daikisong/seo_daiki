import { headers } from "next/headers";
import { absoluteUrl, getSiteUrl } from "./routes";

const PLACEHOLDER_SITE_HOSTS = new Set(["example.com", "www.example.com"]);

function isPlaceholderSiteUrl(siteUrl: string) {
  try {
    return PLACEHOLDER_SITE_HOSTS.has(new URL(siteUrl).hostname.toLowerCase());
  } catch {
    return true;
  }
}

async function getRequestSiteUrl() {
  const configuredSiteUrl = getSiteUrl();
  if (!isPlaceholderSiteUrl(configuredSiteUrl)) {
    return configuredSiteUrl;
  }

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  if (!host) {
    return configuredSiteUrl;
  }

  const forwardedProto = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const firstHost = host.split(",")[0]?.trim();
  const protocol =
    forwardedProto ||
    (firstHost.startsWith("localhost") || firstHost.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${protocol}://${firstHost}`;
}

export async function requestAbsoluteUrl(path: string) {
  return absoluteUrl(path, await getRequestSiteUrl());
}
