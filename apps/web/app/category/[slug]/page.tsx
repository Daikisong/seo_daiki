import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  TrendArchive,
  filterArchiveArticles,
} from "@/components/layout/TrendArchive";
import {
  getIndexedArticles,
  getPublicNavCategories,
} from "@/lib/trend-site/data";
import {
  sortTrendArticles,
  trendContentUnitPlural,
  hasIndexableTrendCategoryArticles,
  indexableTrendCategories,
  trendCategoryBySlug,
  trendSiteName,
  visibleTrendArticles,
} from "@/lib/trend-site/categories";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ s?: string | string[] }>;
};

export function generateStaticParams() {
  return indexableTrendCategories(getIndexedArticles()).map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = trendCategoryBySlug(slug);
  if (!category || !category.isPublic) {
    return {};
  }
  const hasArticles = hasIndexableTrendCategoryArticles(
    category,
    getIndexedArticles(),
  );
  if (!hasArticles) {
    return {
      title: `${category.label} | ${trendSiteName}`,
      description: `${category.label} from ${trendSiteName}: ${trendContentUnitPlural.toLowerCase()} will appear here after enough real Briefs are published.`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }
  return {
    title: `${category.label} | ${trendSiteName}`,
    description: `${category.label} from ${trendSiteName}: ${trendContentUnitPlural.toLowerCase()} for fast-moving marketplace trends.`,
    alternates: {
      canonical: await requestAbsoluteUrl(category.href),
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = trendCategoryBySlug(slug);
  const articles = visibleTrendArticles(await getIndexedArticles()).sort(
    sortTrendArticles,
  );
  if (!category || !category.isPublic) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const searchQuery = firstParam(resolvedSearchParams?.s).trim();
  const filteredArticles = filterArchiveArticles(
    articles,
    searchQuery,
    category,
  );
  const archiveTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : category.label;

  return (
    <>
      <SiteHeader
        currentHref={category.href}
        navCategories={getPublicNavCategories()}
        searchQuery={searchQuery}
      />
      <TrendArchive
        activeCategory={category}
        archiveTitle={archiveTitle}
        articles={articles}
        filteredArticles={filteredArticles}
        searchQuery={searchQuery}
      />
      <SiteFooter />
    </>
  );
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}
