type SiteUrlEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  NODE_ENV?: string;
};

export function getSiteUrl(
  env: SiteUrlEnv = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV
  }
) {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim();

  if (env.NODE_ENV === "production" && !siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is required in production.");
  }

  return (siteUrl ?? "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(path: string, siteUrl = getSiteUrl()) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
