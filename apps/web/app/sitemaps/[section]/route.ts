import { getIndexedArticles } from "@/lib/content/repository";
import {
  articlesForSitemapSection,
  isSitemapIndexSection,
  parseSitemapSection,
  sitemapSectionsForArticles
} from "@/lib/seo/sitemap-section-model";
import {
  emptySitemap,
  sitemapIndexXml,
  sitemapUrlsetXml,
  sitemapXmlResponse
} from "@/lib/seo/sitemap-section-xml";
import { getSiteUrl } from "@global-import-lab/seo";

interface RouteContext {
  params: Promise<{ section: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { section } = await context.params;
  const articles = await getIndexedArticles();
  if (isSitemapIndexSection(section)) {
    return sitemapXmlResponse(sitemapIndexXml(sitemapSectionsForArticles(articles), getSiteUrl()));
  }

  const parsed = parseSitemapSection(section);
  if (!parsed) {
    return sitemapXmlResponse(emptySitemap());
  }

  const { locale, bucket } = parsed;
  return sitemapXmlResponse(sitemapUrlsetXml(articlesForSitemapSection(articles, locale, bucket)));
}
