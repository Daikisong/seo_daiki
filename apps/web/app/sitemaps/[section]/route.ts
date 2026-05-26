import { canonicalForArticle, getSiteUrl, shouldIncludeInSitemap } from "@global-import-lab/seo";
import { locales, type Locale } from "@global-import-lab/types";
import { getIndexedArticles } from "@/lib/content/repository";

interface RouteContext {
  params: Promise<{ section: string }>;
}

const sectionTypeMap: Record<string, string[]> = {
  hubs: ["hub"],
  products: ["review"],
  guides: ["guide", "risk"],
  lab: ["lab"],
  data: ["data"],
  compare: ["compare"],
  methodology: ["methodology"]
};

export async function GET(_request: Request, context: RouteContext) {
  const { section } = await context.params;
  const articles = await getIndexedArticles();
  if (section.replace(/\.xml$/, "") === "index") {
    return new Response(sitemapIndexXml(articles), {
      headers: {
        "content-type": "application/xml; charset=utf-8"
      }
    });
  }

  const parsed = parseSitemapSection(section);
  if (!parsed) {
    return new Response(emptySitemap(), {
      headers: {
        "content-type": "application/xml; charset=utf-8"
      }
    });
  }

  const { locale, bucket } = parsed;
  const types = sectionTypeMap[bucket ?? ""] ?? [];
  const urls = articles.filter(
    (article) => article.locale === locale && types.includes(article.type) && shouldIncludeInSitemap(article)
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (article) => `  <url>
    <loc>${escapeXml(canonicalForArticle(article))}</loc>
    <lastmod>${article.lastUpdated}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
}

function sitemapIndexXml(articles: Awaited<ReturnType<typeof getIndexedArticles>>) {
  const siteUrl = getSiteUrl();
  const sections = sitemapSectionsForArticles(articles);
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

function sitemapSectionsForArticles(articles: Awaited<ReturnType<typeof getIndexedArticles>>) {
  return locales.flatMap((locale) =>
    Object.entries(sectionTypeMap)
      .filter(([, types]) =>
        articles.some(
          (article) => article.locale === locale && types.includes(article.type) && shouldIncludeInSitemap(article)
        )
      )
      .map(([bucket]) => `${locale}-${bucket}`)
  );
}

function parseSitemapSection(section: string): { locale: Locale; bucket: string } | null {
  const cleanSection = section.replace(/\.xml$/, "");
  const locale = [...locales]
    .sort((a, b) => b.length - a.length)
    .find((candidate) => cleanSection.startsWith(`${candidate}-`));

  if (!locale) {
    return null;
  }

  return {
    locale,
    bucket: cleanSection.slice(locale.length + 1)
  };
}

function emptySitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
