import type { Article } from "./types";

export function articlePath(article: Article) {
  return `/${article.locale}/trends/${article.slug}/`;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function absoluteUrl(path: string, siteUrl = getSiteUrl()) {
  return new URL(path, siteUrl).toString();
}
