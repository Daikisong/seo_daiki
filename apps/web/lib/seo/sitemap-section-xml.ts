import { canonicalForArticle } from "@global-import-lab/seo";
import type { Article } from "@global-import-lab/types";

export const sitemapXmlHeaders = {
  "content-type": "application/xml; charset=utf-8"
};

export function sitemapXmlResponse(body: string) {
  return new Response(body, {
    headers: sitemapXmlHeaders
  });
}

export function sitemapIndexXml(sections: string[], siteUrl: string) {
  const body = sections
    .map(
      (section) => `  <sitemap>
    <loc>${escapeXml(`${siteUrl}/sitemaps/${section}.xml`)}</loc>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

export function sitemapUrlsetXml(articles: Article[], siteUrl?: string) {
  const body = articles
    .map(
      (article) => `  <url>
    <loc>${escapeXml(canonicalForArticle(article, siteUrl))}</loc>
    <lastmod>${article.lastUpdated}</lastmod>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export function emptySitemap() {
  return sitemapUrlsetXml([]);
}

export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
