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
  if (showIntro) {
    return (
      <main className="bg-white text-neutral-950">
        {articles[0] ? (
          <div className="lg:hidden">
            <HomeMagazineHero article={articles[0]} />
          </div>
        ) : null}
        <div className="mx-auto max-w-[1170px] px-5 py-10 xl:px-10">
          <HomeIntro activeCategories={activeCategories} articles={articles} />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-neutral-950">
      <div className="mx-auto grid max-w-[1170px] gap-12 px-5 py-10 xl:min-h-[960px] xl:grid-cols-[minmax(0,760px)_300px] xl:gap-[90px] xl:px-10">
        <div>
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
  activeCategories: _activeCategories,
  articles,
}: {
  activeCategories: TrendCategory[];
  articles: Article[];
}) {
  const leadArticle = articles[0];
  return (
    <section className="mb-12 space-y-10 text-neutral-900">
      <div
        className="border-b border-neutral-300 pb-4 md:flex md:items-end md:justify-between md:gap-8"
        id="what-to-buy"
      >
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#d80057]">
            {trendHomeDescription}
          </p>
          <h1 className="mt-2 font-serif text-[36px] font-normal leading-[40px] tracking-[-0.01em] text-[#061936] md:text-[54px] md:leading-[58px]">
            What to buy when a trend moves fast
          </h1>
        </div>
        <p className="mt-4 max-w-[310px] text-[15px] leading-6 text-neutral-700 md:mt-0 md:text-right">
          Briefs turn noisy search spikes into clear buying notes: what solves
          the problem, what does not, and what to check before clicking.
        </p>
      </div>
      {leadArticle ? (
        <section
          className="grid gap-8 border-b border-neutral-200 pb-10 md:grid-cols-[minmax(0,680px)_minmax(260px,1fr)]"
          id="latest-briefs"
        >
          <Link className="group block" href={articlePath(leadArticle)}>
            <span className="block overflow-hidden">
              <Image
                alt={`${leadArticle.title} thumbnail`}
                className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                height={420}
                priority
                src={articleImage(leadArticle)}
                width={670}
              />
            </span>
            <span className="mt-4 block text-[12px] font-black uppercase tracking-[0.16em] text-[#d80057]">
              Lead Brief
            </span>
            <span className="brief-title-link mt-2 block font-serif text-[32px] font-normal leading-[36px] text-[#061936] group-hover:text-[#2f7cd3] md:text-[40px] md:leading-[44px]">
              {leadArticle.title}
            </span>
            <span className="mt-4 block max-w-[650px] text-[16px] leading-7 text-neutral-700">
              {postExcerpt(stripInlineEmphasisSyntax(leadArticle.summary), 250)}
            </span>
            <span className="mt-4 inline-block text-sm font-black uppercase tracking-[0.08em] text-[#d80057]">
              Read the Brief
            </span>
          </Link>
          <div className="border-t border-neutral-300 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#d80057]">
              In this Brief
            </p>
            <ul className="mt-4 space-y-4 text-[16px] leading-7 text-neutral-800">
              <li className="border-t border-neutral-200 pt-4 first:border-t-0 first:pt-0">
                Which cooling products actually lower room temperature.
              </li>
              <li className="border-t border-neutral-200 pt-4">
                Which fan, cooler, controller, and import listings to treat as
                separate categories.
              </li>
              <li className="border-t border-neutral-200 pt-4">
                What to check before paying: voltage, window fit, delivery,
                stock, warranty, and return route.
              </li>
            </ul>
          </div>
        </section>
      ) : null}
      <section
        className="border-y border-neutral-300 py-6 md:flex md:items-center md:justify-between md:gap-8"
        id="newsletter"
      >
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#d80057]">
            Get the next Brief
          </p>
          <h2 className="mt-2 font-serif text-[30px] font-normal leading-[34px] text-[#061936]">
            Buyer notes for the next fast-moving trend
          </h2>
        </div>
        <p className="mt-3 max-w-[390px] text-[15px] leading-6 text-neutral-700 md:mt-0">
          Newsletter signup opens with the public launch. For now, start with
          the current Briefs and the method page.
        </p>
        <Link
          className="mt-4 inline-block bg-neutral-100 px-5 py-3 text-sm font-black text-black hover:bg-neutral-200 md:mt-0"
          href="/methodology/"
        >
          How Briefs work
        </Link>
      </section>
    </section>
  );
}

export function HomeMagazineHero({ article }: { article: Article }) {
  return (
    <section className="relative overflow-hidden bg-[#061936]">
      <Link className="group block" href={articlePath(article)}>
        <div className="relative min-h-[385px] xl:min-h-[475px]">
          <Image
            alt={`${article.title} hero image`}
            className="absolute inset-0 h-full w-full object-cover"
            height={900}
            priority
            sizes="100vw"
            src={articleImage(article)}
            width={1600}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/5" />
          <div className="absolute left-5 top-4 font-serif text-[35px] font-bold leading-none text-white drop-shadow xl:left-8 xl:top-5">
            {trendSiteName}
          </div>
          <div className="absolute inset-x-6 bottom-9 mx-auto max-w-[720px] bg-white px-7 py-5 text-center shadow-[0_4px_18px_rgba(0,0,0,0.12)] xl:bottom-10 xl:px-12 xl:py-6">
            <h2 className="font-serif text-[31px] font-normal leading-[34px] text-black xl:text-[38px] xl:leading-[42px]">
              {article.title}
            </h2>
            <div className="absolute inset-x-0 bottom-0 h-[7px] bg-gradient-to-r from-[#d80057] via-[#d80057] to-[#ff4f3f]" />
          </div>
        </div>
      </Link>
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
