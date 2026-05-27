import { shouldIncludeInSitemap } from "@global-import-lab/seo";
import { locales, type Article, type ArticleType, type Locale } from "@global-import-lab/types";

export const sitemapSectionTypeMap: Record<string, ArticleType[]> = {
  hubs: ["hub"],
  products: ["review"],
  guides: ["guide", "risk"],
  lab: ["lab"],
  data: ["data"],
  compare: ["compare"],
  methodology: ["methodology"],
  trends: ["trend"],
  "buyer-guides": ["buyer_guide"],
  deals: ["deal_watch"],
  ingredients: ["ingredient_guide"]
};

export function isSitemapIndexSection(section: string) {
  return cleanSitemapSection(section) === "index";
}

export function articlesForSitemapSection(articles: Article[], locale: Locale, bucket: string) {
  const types = sitemapSectionTypeMap[bucket] ?? [];
  return articles.filter(
    (article) => article.locale === locale && types.includes(article.type) && shouldIncludeInSitemap(article)
  );
}

export function sitemapSectionsForArticles(articles: Article[]) {
  return locales.flatMap((locale) =>
    Object.entries(sitemapSectionTypeMap)
      .filter(([, types]) =>
        articles.some(
          (article) => article.locale === locale && types.includes(article.type) && shouldIncludeInSitemap(article)
        )
      )
      .map(([bucket]) => `${locale}-${bucket}`)
  );
}

export function parseSitemapSection(section: string): { locale: Locale; bucket: string } | null {
  const cleanSection = cleanSitemapSection(section);
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

function cleanSitemapSection(section: string) {
  return section.replace(/\.xml$/, "");
}
