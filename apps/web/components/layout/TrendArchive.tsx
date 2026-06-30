import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Article } from "@/lib/trend-site/types";
import { articlePath } from "@/lib/trend-site/routes";
import {
  trendCategoryForArticle,
  trendContentUnitPlural,
  trendHomeDescription,
  trendSiteName,
  visibleTrendCategories,
  type TrendCategory,
} from "@/lib/trend-site/categories";

export function TrendArchive({
  activeCategory,
  archiveTitle,
  articles,
  filteredArticles,
  searchQuery,
  showIntro = false,
}: {
  activeCategory?: TrendCategory;
  archiveTitle?: string;
  articles: Article[];
  filteredArticles: Article[];
  searchQuery: string;
  showIntro?: boolean;
}) {
  const latestBriefs = articles;
  return (
    <main className="bg-white text-neutral-950">
      <div className="mx-auto grid max-w-[1170px] gap-12 px-4 py-8 xl:min-h-[960px] xl:grid-cols-[minmax(0,700px)_300px] xl:gap-[90px] xl:px-10">
        <div>
          {showIntro ? <HomeIntro /> : null}
          <section id="latest-briefs">
            {archiveTitle ? (
              <div className="mb-6">
                <h1 className="text-[21px] font-bold leading-[23.1px] tracking-normal text-[#2b2f33] md:text-[25.6px] md:leading-[28.16px] xl:text-[32px] xl:leading-[35.2px]">
                  {archiveTitle}
                </h1>
                {searchQuery || activeCategory ? (
                  <Link
                    className="focus-ring mt-2 inline-block rounded-sm text-sm text-[#2f7cd3] hover:text-[#1f5f9f]"
                    href="/"
                  >
                    Back to all briefs
                  </Link>
                ) : null}
              </div>
            ) : null}

            <div>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <ArchivePost article={article} key={article.id} />
                ))
              ) : (
                <div>
                  <h2 className="text-[21px] font-bold leading-[23.1px] tracking-normal text-[#2b2f33] md:text-[25.6px] md:leading-[28.16px]">
                    No briefs found.
                  </h2>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="hidden space-y-8 pt-1 xl:block">
          <SidebarSearch
            actionHref={activeCategory?.href ?? "/"}
            searchQuery={searchQuery}
          />
          <SidebarSection title="Latest Briefs">
            <div className="space-y-5">
              {latestBriefs.map((article) => (
                <Link
                  className="focus-ring group grid grid-cols-[76px_minmax(0,1fr)] gap-4 rounded-sm"
                  href={articlePath(article)}
                  key={article.id}
                >
                  <Image
                    alt={`${article.title} thumbnail`}
                    className="h-[76px] w-[76px] object-cover"
                    height={76}
                    src={articleImage(article)}
                    width={76}
                  />
                  <span className="block text-base leading-6 text-[#2f7cd3] group-hover:text-[#1f5f9f]">
                    {article.title}
                  </span>
                </Link>
              ))}
            </div>
          </SidebarSection>
          <SidebarSection title="Categories">
            <ul className="space-y-2">
              {visibleTrendCategories.map((item) => (
                <li key={item.slug}>
                  <Link
                    className="focus-ring rounded-sm text-base text-[#2f7cd3] hover:text-[#1f5f9f]"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </SidebarSection>
        </aside>
      </div>
    </main>
  );
}

export function HomeIntro() {
  return (
    <section className="mb-10 max-w-[740px] text-neutral-900">
      <h1 className="text-[21px] font-bold leading-[23.1px] tracking-normal text-[#2b2f33] md:text-[25.6px] md:leading-[28.16px] xl:text-[32px] xl:leading-[35.2px]">
        {trendSiteName} - {trendHomeDescription}
      </h1>
      <div className="mt-[25px] space-y-[25px] text-[15px] leading-[21px] text-neutral-800 md:text-base md:leading-6">
        <p className="font-normal text-neutral-950">Hi, I&apos;m Jacob</p>
        <p>
          Welcome to {trendSiteName} - buyer notes for products that suddenly
          become hard to judge across AliExpress, Temu, Amazon, iHerb, and other
          fast-moving marketplaces.
        </p>
        <p>
          For most briefs, I compare public specs, live listing claims, current
          prices, seller terms, warranty or return details, credible review
          coverage, and repeated buyer complaints.
        </p>
        <p>
          The goal is to make the buying decision clearer: why a product is
          worth checking, who it fits, who should skip it, and what can go wrong
          after checkout.
        </p>
      </div>
    </section>
  );
}

export function filterArchiveArticles(
  articles: Article[],
  searchQuery: string,
  activeCategory?: TrendCategory,
) {
  const normalizedQuery = searchQuery.toLowerCase();
  return articles.filter((article) => {
    const category = trendCategoryForArticle(article);
    if (activeCategory && category.slug !== activeCategory.slug) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    return `${article.title} ${article.summary} ${category.label}`
      .toLowerCase()
      .includes(normalizedQuery);
  });
}

function ArchivePost({ article }: { article: Article }) {
  const category = trendCategoryForArticle(article);
  return (
    <article className="pb-8">
      <h2 className="max-w-[720px] text-[18px] font-bold leading-[19.8px] tracking-normal text-[#2b2f33] md:text-[30px] md:leading-[33px]">
        <Link
          className="focus-ring rounded-sm underline decoration-[#b8c8d8] decoration-2 underline-offset-[5px] hover:text-[#2f7cd3] hover:decoration-[#2f7cd3]"
          href={articlePath(article)}
        >
          {article.title}
        </Link>
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2 text-[12.75px] leading-[21.675px] text-[#90949a] md:mt-4 md:text-[13.6px] md:leading-[23.12px]">
        <span>{formatDate(article.lastUpdated)}</span>
        <span>
          Category:{" "}
          <Link
            className="focus-ring rounded-sm text-[#90949a] hover:text-[#2f7cd3]"
            href={category.href}
          >
            {category.label}
          </Link>
        </span>
        <span>Author: Jacob</span>
      </div>
      <Link
        className="focus-ring mt-[14px] block self-start overflow-hidden bg-white md:mt-5"
        href={articlePath(article)}
      >
        <Image
          alt={`${article.title} thumbnail`}
          className="aspect-[16/9] w-full object-contain"
          height={420}
          priority
          src={articleImage(article)}
          width={740}
        />
      </Link>
      <p className="mt-[25px] text-[15px] leading-[21px] text-neutral-800 md:text-base md:leading-6">
        {postExcerpt(article.summary)}
      </p>
      <Link
        className="focus-ring mt-[14px] inline-block rounded-sm text-[15px] leading-[21px] text-[#2f7cd3] hover:text-[#1f5f9f] md:text-base md:leading-6"
        href={articlePath(article)}
      >
        Read brief
      </Link>
    </article>
  );
}

function SidebarSearch({
  actionHref,
  searchQuery,
}: {
  actionHref: string;
  searchQuery: string;
}) {
  return (
    <section>
      <h2 className="text-base font-normal tracking-normal text-neutral-950">
        Search
      </h2>
      <form action={actionHref} className="mt-1 flex gap-3" role="search">
        <label className="sr-only" htmlFor="site-search">
          Search {trendContentUnitPlural.toLowerCase()}
        </label>
        <input
          className="min-w-0 flex-1 border border-[#9ca0a6] px-3 py-3 text-base text-neutral-950 outline-none focus:border-[#2f7cd3]"
          defaultValue={searchQuery}
          id="site-search"
          name="s"
          suppressHydrationWarning
          type="search"
        />
        <button
          className="focus-ring bg-[#2f343b] px-6 py-3 text-base text-white hover:bg-[#1e2329]"
          type="submit"
        >
          Search
        </button>
      </form>
    </section>
  );
}

function SidebarSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section>
      <h2 className="text-[24px] font-bold leading-[26.4px] tracking-normal text-[#2b2f33]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function postExcerpt(value: string, maxLength = 260) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function articleImage(article: Article) {
  return article.imageUrl;
}

function formatDate(value: string) {
  const date = new Date(value);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getUTCFullYear()}`;
}
