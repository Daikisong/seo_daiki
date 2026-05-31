import type { Metadata } from "next";
import { canonicalForArticle, localeConfig } from "@global-import-lab/seo";
import type { Article, HreflangMap } from "@global-import-lab/types";

export type MarketResearchMetadataInput = {
  title: string;
  description: string;
  canonical: string;
  hreflangMap?: HreflangMap;
};

export const researchRobots = {
  index: false,
  follow: true
} as const;

export function marketResearchMetadata({
  title,
  description,
  canonical,
  hreflangMap
}: MarketResearchMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: hreflangMap
    },
    robots: researchRobots
  };
}

export function metadataForArticle(article: Article, options: { forceNoindex?: boolean } = {}): Metadata {
  const canonical = canonicalForArticle(article);
  return {
    title: article.title,
    description: article.metaDescription,
    alternates: {
      canonical,
      languages: article.hreflangMap
    },
    robots: {
      index: !options.forceNoindex && article.indexStatus === "index",
      follow: true
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      locale: localeConfig[article.locale].htmlLang,
      url: canonical,
      siteName: "Global Import Lab",
      type: "article"
    }
  };
}
