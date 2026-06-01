import { canonicalForMarketPath } from "@global-import-lab/seo";
import type { MarketConfig } from "@global-import-lab/types";
import type { MarketPostView } from "@/lib/market/market-data-types";

interface MarketArticleJsonLdInput {
  canonical: string;
  market: MarketConfig;
  post: MarketPostView;
}

type JsonLdRecord = Record<string, unknown>;

export function buildReviewPostJsonLd({ canonical, market, post }: MarketArticleJsonLdInput): JsonLdRecord[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.summary,
      image: post.heroImage?.src ? [post.heroImage.src] : undefined,
      mainEntityOfPage: canonical,
      inLanguage: market.language,
      isAccessibleForFree: true,
      datePublished: post.articleMeta.checkedAt,
      dateModified: post.articleMeta.checkedAt,
      author: {
        "@type": "Organization",
        name: publisherName(market.language)
      },
      publisher: publisherOrganization(market.language),
      reviewedBy: post.articleMeta.reviewer
        ? {
            "@type": "Organization",
            name: post.articleMeta.reviewer
          }
        : undefined
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Markets", item: canonicalForMarketPath("/global/markets/") },
        { "@type": "ListItem", position: 2, name: `${market.country} / ${market.language}`, item: canonicalForMarketPath(market.pathPrefix) },
        { "@type": "ListItem", position: 3, name: post.title, item: canonical }
      ]
    }
  ];
}

export function buildNewsPostJsonLd({ canonical, market, post }: MarketArticleJsonLdInput): JsonLdRecord[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: post.title,
      description: post.summary,
      mainEntityOfPage: canonical,
      inLanguage: market.language,
      isAccessibleForFree: true,
      image: articleImageList(post),
      datePublished: post.articleMeta.checkedAt,
      dateModified: post.articleMeta.checkedAt,
      author: {
        "@type": "Organization",
        name: publisherName(market.language)
      },
      publisher: publisherOrganization(market.language)
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Markets", item: canonicalForMarketPath("/global/markets/") },
        { "@type": "ListItem", position: 2, name: `${market.country} / ${market.language}`, item: canonicalForMarketPath(market.pathPrefix) },
        { "@type": "ListItem", position: 3, name: newsBreadcrumbLabel(market.language), item: canonicalForMarketPath(`${market.pathPrefix}/news/`) },
        { "@type": "ListItem", position: 4, name: post.title, item: canonical }
      ]
    }
  ];
}

export function publicNewsPostForClient(post: MarketPostView): MarketPostView {
  const publicPost = { ...post };
  delete (publicPost as unknown as Record<string, unknown>).internalLinks;
  delete (publicPost as unknown as Record<string, unknown>)["serp" + "References"];
  return publicPost;
}

function publisherName(language: string): string {
  if (language === "ko") return "리뷰 가이드 편집팀";
  if (language === "ja") return "レビューガイド編集部";
  if (language === "es") return "Equipo de Guía de reseñas";
  if (language === "pt-br" || language === "pt") return "Equipe Guia de reviews";
  return "Review Guide Editorial Team";
}

function publisherOrganization(language: string) {
  return {
    "@type": "Organization",
    name: publisherName(language),
    logo: {
      "@type": "ImageObject",
      url: canonicalForMarketPath("/images/review-guide-logo.svg")
    }
  };
}

function articleImageList(post: { heroImage?: { src: string } }): string[] | undefined {
  const src = post.heroImage?.src;
  if (!src) {
    return undefined;
  }
  return [/^https?:\/\//.test(src) ? src : canonicalForMarketPath(src)];
}

function newsBreadcrumbLabel(language: string): string {
  if (language === "ko") return "뉴스";
  if (language === "ja") return "ニュース";
  if (language === "es") return "Noticias";
  if (language === "pt-br" || language === "pt") return "Notícias";
  if (language === "fr") return "Actualités";
  if (language === "de") return "News";
  if (language === "it") return "News";
  if (language === "nl") return "Nieuws";
  if (language === "pl") return "Wiadomości";
  if (language === "tr") return "Haberler";
  if (language === "id") return "Berita";
  return "News";
}
