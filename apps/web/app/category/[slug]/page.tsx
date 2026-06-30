import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TrendArchive, filterArchiveArticles } from "@/components/layout/TrendArchive";
import { getIndexedArticles } from "@/lib/trend-site/data";
import {
  sortTrendArticles,
  trendCategoryBySlug,
  visibleTrendCategories,
  visibleTrendArticles
} from "@/lib/trend-site/categories";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ s?: string | string[] }>;
};

export function generateStaticParams() {
  return visibleTrendCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = trendCategoryBySlug(slug);
  if (!category || !category.isPublic) {
    return {};
  }
  return {
    title: `${category.label} | TREND - Jacob`,
    description: `${category.label} from TREND - Jacob: marketplace buying guides across AliExpress, Temu, Amazon, iHerb, and other fast-moving shops.`,
    alternates: {
      canonical: await requestAbsoluteUrl(category.href)
    }
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const category = trendCategoryBySlug(slug);
  if (!category || !category.isPublic) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const searchQuery = firstParam(resolvedSearchParams?.s).trim();
  const articles = visibleTrendArticles(await getIndexedArticles()).sort(sortTrendArticles);
  const filteredArticles = filterArchiveArticles(articles, searchQuery, category);
  const archiveTitle = searchQuery ? `Search results for "${searchQuery}"` : category.label;

  return (
    <>
      <SiteHeader currentHref={category.href} searchQuery={searchQuery} />
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
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
