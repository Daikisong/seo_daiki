import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticlePage } from "@/components/layout/ArticlePage";
import {
  getIndexedArticles,
  getStaticTrendParams,
  getTrendArticle,
  getTrendProducts,
} from "@/lib/trend-site/data";
import { articlePath } from "@/lib/trend-site/routes";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";
import { articleLanguageAlternates, articleRobots } from "@/lib/trend-site/seo";
import { trendSiteName } from "@/lib/trend-site/categories";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return getStaticTrendParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getTrendArticle(locale, slug);
  if (!article) {
    return {};
  }
  const canonicalUrl = await requestAbsoluteUrl(articlePath(article));
  const languages = articleLanguageAlternates(
    article,
    getIndexedArticles(),
    new URL(canonicalUrl).origin,
  );

  return {
    title: article.title,
    description: article.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      ...(languages ? { languages } : {}),
    },
    robots: articleRobots(article),
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: canonicalUrl,
      siteName: trendSiteName,
      type: "article",
    },
  };
}

export default async function TrendPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const article = getTrendArticle(locale, slug);
  if (!article) {
    notFound();
  }

  return (
    <ArticlePage
      article={article}
      pageUrl={await requestAbsoluteUrl(articlePath(article))}
      products={getTrendProducts()}
      publisherUrl={await requestAbsoluteUrl("/")}
    />
  );
}
