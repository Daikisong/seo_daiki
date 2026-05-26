import type { Metadata } from "next";
import { canonicalForArticle, localeConfig } from "@global-import-lab/seo";
import type { Article } from "@global-import-lab/types";

export function metadataForArticle(article: Article): Metadata {
  const canonical = canonicalForArticle(article);
  return {
    title: article.title,
    description: article.metaDescription,
    alternates: {
      canonical,
      languages: article.hreflangMap
    },
    robots: {
      index: article.indexStatus === "index",
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
