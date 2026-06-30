import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  HomeMagazineHero,
  TrendArchive,
  filterArchiveArticles,
} from "@/components/layout/TrendArchive";
import {
  getIndexedArticles,
  getPublicNavCategories,
} from "@/lib/trend-site/data";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";
import {
  sortTrendArticles,
  trendHomeDescription,
  trendSiteName,
  visibleTrendArticles,
} from "@/lib/trend-site/categories";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${trendSiteName} | ${trendHomeDescription}`,
    description: trendHomeDescription,
    alternates: {
      canonical: await requestAbsoluteUrl("/"),
    },
  };
}

type HomeSearchParams = {
  s?: string | string[];
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<HomeSearchParams>;
}) {
  const params = await searchParams;
  const searchQuery = firstParam(params?.s).trim();
  const articles = visibleTrendArticles(await getIndexedArticles()).sort(
    sortTrendArticles,
  );
  const filteredArticles = filterArchiveArticles(articles, searchQuery);
  const archiveTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : undefined;

  return (
    <>
      <SiteHeader
        currentHref="/"
        navCategories={getPublicNavCategories()}
        searchQuery={searchQuery}
      />
      {!searchQuery && articles[0] ? (
        <div className="hidden lg:block">
          <HomeMagazineHero article={articles[0]} />
        </div>
      ) : null}
      <TrendArchive
        archiveTitle={archiveTitle}
        articles={articles}
        filteredArticles={filteredArticles}
        searchQuery={searchQuery}
        showIntro={!searchQuery}
      />
      <SiteFooter />
    </>
  );
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}
