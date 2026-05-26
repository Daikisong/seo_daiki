import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@global-import-lab/seo";
import { getIndexedArticles } from "@/lib/content/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getIndexedArticles();
  return buildSitemapEntries(articles).map((entry) => ({
    url: entry.url,
    lastModified: new Date(entry.lastModified),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority
  }));
}
