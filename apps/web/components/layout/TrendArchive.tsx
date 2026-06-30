import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Article } from "@/lib/trend-site/types";
import { articlePath } from "@/lib/trend-site/routes";
import { getTrendAuthorById } from "@/lib/trend-site/authors";
import {
  trendCategoryForArticle,
  trendContentUnitPlural,
  trendHomeDescription,
  indexableTrendCategories,
  trendSiteName,
  type TrendCategory,
} from "@/lib/trend-site/categories";
import { InlineEmphasis, stripInlineEmphasisSyntax } from "./InlineEmphasis";

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
  const activeCategories = indexableTrendCategories(articles);
  return (
    <main className="bg-white text-neutral-950">
      <div className="mx-auto grid max-w-[1170px] gap-12 px-4 py-8 xl:min-h-[960px] xl:grid-cols-[minmax(0,700px)_300px] xl:gap-[90px] xl:px-10">
        <div>
          {showIntro ? (
            <HomeIntro
              activeCategories={activeCategories}
              articles={articles}
            />
          ) : null}
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
                    <span className="brief-title-link">{article.title}</span>
                  </span>
                </Link>
              ))}
            </div>
          </SidebarSection>
          <SidebarSection title="Categories">
            <ul className="space-y-2">
              {activeCategories.map((item) => (
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

export function HomeIntro({
  activeCategories,
  articles,
}: {
  activeCategories: TrendCategory[];
  articles: Article[];
}) {
  const leadArticle = articles[0];
  return (
    <section className="mb-10 space-y-8 text-neutral-900">
      <div>
        <p className="text-xs font-black uppercase tracking-normal text-[#5d84b4]">
          {trendHomeDescription}
        </p>
        <h1 className="mt-2 text-[26px] font-black leading-[29px] tracking-normal text-[#2b2f33] md:text-[34px] md:leading-[37px]">
          {trendSiteName} turns fast-moving trends into practical buying Briefs.
        </h1>
      </div>
      {leadArticle ? (
        <section className="border-y border-neutral-200 py-6" id="what-to-buy">
          <p className="text-xs font-black uppercase tracking-normal text-neutral-500">
            Lead story
          </p>
          <Link
            className="group mt-4 grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]"
            href={articlePath(leadArticle)}
          >
            <Image
              alt={`${leadArticle.title} thumbnail`}
              className="aspect-[16/10] w-full object-cover"
              height={220}
              priority
              src={articleImage(leadArticle)}
              width={340}
            />
            <span>
              <span className="brief-title-link block text-[24px] font-black leading-[28px] text-[#2b2f33] group-hover:text-[#2f7cd3]">
                {leadArticle.title}
              </span>
              <span className="mt-3 block text-[15px] leading-6 text-neutral-700">
                {postExcerpt(
                  stripInlineEmphasisSyntax(leadArticle.summary),
                  220,
                )}
              </span>
              <span className="mt-4 inline-block text-sm font-black text-[#2f7cd3]">
                Read the Brief
              </span>
            </span>
          </Link>
        </section>
      ) : null}
      {activeCategories.length > 0 ? (
        <section>
          <h2 className="border-b-4 border-cyan-500 pb-3 text-[24px] font-black leading-[28px] text-[#2b2f33]">
            What to buy
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeCategories.map((category) => (
              <Link
                className="border border-[#5d84b4] px-3 py-2 text-sm font-black text-[#2f343b] hover:bg-[#5d84b4] hover:text-white"
                href={category.href}
                key={category.slug}
              >
                {category.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <section className="grid gap-4 md:grid-cols-2" id="newsletter">
        <div className="border-l-4 border-cyan-500 bg-cyan-50 p-4">
          <h2 className="text-lg font-black text-neutral-950">
            TrendBrief Editors
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Briefs focus on exact variants, seller routes, current price checks,
            repeated buyer complaints, and the point where a trend becomes a
            practical buying decision.
          </p>
        </div>
        <div className="border-l-4 border-[#5d84b4] bg-neutral-50 p-4">
          <h2 className="text-lg font-black text-neutral-950">
            Get the next Brief
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Newsletter signup opens with the public launch. Until then, start
            with the current Briefs and the method page.
          </p>
          <Link
            className="mt-3 inline-block text-sm font-black text-[#2f7cd3] hover:underline"
            href="/methodology/"
          >
            How Briefs work
          </Link>
        </div>
      </section>
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
  const author = getTrendAuthorById(article.authorId);
  return (
    <article className="pb-8">
      <h2 className="max-w-[720px] text-[18px] font-bold leading-[19.8px] tracking-normal text-[#2b2f33] md:text-[30px] md:leading-[33px]">
        <Link
          className="brief-title-link focus-ring rounded-sm"
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
        {author ? (
          <span>
            Author:{" "}
            <Link
              className="focus-ring rounded-sm text-[#90949a] hover:text-[#2f7cd3]"
              href={author.authorPagePath}
            >
              {author.name}
            </Link>
          </span>
        ) : null}
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
        {postExcerpt(stripInlineEmphasisSyntax(article.summary))}
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
