import type { MetadataRoute } from "next";
import { getIndexedArticles } from "@/lib/trend-site/data";
import { articlePath } from "@/lib/trend-site/routes";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";
import { visibleTrendCategories } from "@/lib/trend-site/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getIndexedArticles();
  const articleEntries = await Promise.all(articles.map(async (article) => ({
    url: await requestAbsoluteUrl(articlePath(article)),
    lastModified: new Date(article.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.8
  })));
  const now = new Date();
  const staticEntries = await Promise.all([
    "/",
    "/about-me/",
    "/contact/",
    "/methodology/",
    "/privacy-policy/",
    "/terms-of-use/",
    "/advertising-policy/",
    "/do-not-sell-or-share/",
    ...visibleTrendCategories.map((item) => item.href)
  ].map(async (path) => ({
    url: await requestAbsoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7
  })));
  return [...staticEntries, ...articleEntries];
}
