import type { MetadataRoute } from "next";
import { absoluteUrl, buildSitemapEntries } from "@global-import-lab/seo";
import { getIndexedArticles } from "@/lib/content/repository";
import { enabledMarkets } from "@/lib/market/config";
import { marketHomeSitemapEligibility } from "@/lib/seo/market-index-policy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getIndexedArticles();
  const articleEntries = buildSitemapEntries(articles).map((entry) => ({
    url: entry.url,
    lastModified: new Date(entry.lastModified),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority
  }));
  const now = new Date();
  const marketEntries = enabledMarkets()
    .filter((market) => marketHomeSitemapEligibility(market).eligible)
    .map((market) => ({
      url: absoluteUrl(`${market.pathPrefix}/`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8
    }));
  const globalEntries = ["/global/", "/global/trend-map/", "/global/topics/", "/global/methodology/", "/global/markets/"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));
  return [...articleEntries, ...marketEntries, ...globalEntries];
}
