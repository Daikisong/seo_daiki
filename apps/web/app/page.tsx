import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Article, ArticleType } from "@global-import-lab/types";
import { articlePath } from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getIndexedArticles } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Trend Picks - Jacob | AliExpress Trend Guides",
  description: "Best travel GaN charger AliExpress trend: fake wattage checks and top 10 picks."
};

type HomeSearchParams = {
  s?: string | string[];
  category?: string | string[];
};

const homeArticleTypes = new Set<ArticleType>(["trend", "buyer_guide", "deal_watch", "ingredient_guide"]);

const articleTypeLabel: Record<ArticleType, string> = {
  hub: "Hub",
  review: "Review",
  guide: "Guide",
  compare: "Compare",
  data: "Data",
  lab: "Lab",
  risk: "Risk",
  methodology: "Method",
  trend: "Trending Now",
  buyer_guide: "AliExpress Guides",
  deal_watch: "Deals",
  ingredient_guide: "Ingredients"
};

const articleTypeRank: Partial<Record<ArticleType, number>> = {
  trend: 0,
  buyer_guide: 1,
  deal_watch: 2,
  ingredient_guide: 3
};

const primaryPostTitle = "Best travel GaN charger AliExpress trend: fake wattage checks and top 10 picks";

const categoryLinks = [
  { label: "All Posts", href: "/", type: undefined },
  { label: "Trending Now", href: "/?category=trend#latest-posts", type: "trend" },
  { label: "AliExpress Guides", href: "/?category=buyer_guide#latest-posts", type: "buyer_guide" },
  { label: "Deals", href: "/?category=deal_watch#latest-posts", type: "deal_watch" },
  { label: "Ingredients", href: "/?category=ingredient_guide#latest-posts", type: "ingredient_guide" }
] satisfies Array<{ label: string; href: string; type?: ArticleType }>;

export default async function HomePage({ searchParams }: { searchParams?: Promise<HomeSearchParams> }) {
  const params = await searchParams;
  const searchQuery = firstParam(params?.s).trim();
  const activeCategory = categoryParam(params?.category);
  const allHomeArticles = (await getIndexedArticles())
    .filter((article) => article.locale === "en" && homeArticleTypes.has(article.type))
    .sort(sortHomeArticles);
  const articles = allHomeArticles.filter((article) => article.title === primaryPostTitle);
  const filteredArticles = filterArticles(articles, searchQuery, activeCategory);
  const latestPosts = articles;
  const archiveTitle = archiveHeading(searchQuery, activeCategory);

  return (
    <>
      <SiteHeader />
      <main className="bg-white text-neutral-950">
        <div className="mx-auto grid max-w-[1170px] gap-12 px-4 py-8 lg:min-h-[960px] lg:grid-cols-[minmax(0,740px)_300px] lg:gap-[90px]">
          <div>
            <section id="latest-posts">
              {(searchQuery || activeCategory) ? (
                <div className="mb-6">
                  <h1 className="text-3xl font-bold tracking-normal text-[#2b2f33]">{archiveTitle}</h1>
                  <Link className="focus-ring mt-2 inline-block rounded-sm text-sm text-[#2f7cd3] hover:text-[#1f5f9f]" href="/">
                    Clear filters
                  </Link>
                </div>
              ) : null}

              <div>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => <ArchivePost article={article} key={article.id} />)
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold tracking-normal text-[#2b2f33]">No posts found.</h1>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="hidden space-y-8 pt-1 lg:block">
            <SidebarSearch activeCategory={activeCategory} searchQuery={searchQuery} />
            <SidebarSection title="Latest Posts">
              <div className="space-y-5">
                {latestPosts.map((article) => (
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
                {categoryLinks.map((item) => (
                  categoryCount(articles, item.type) > 0 ? (
                    <li key={item.label}>
                      <Link className="focus-ring rounded-sm text-base text-[#2f7cd3] hover:text-[#1f5f9f]" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ) : null
                ))}
              </ul>
            </SidebarSection>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function ArchivePost({ article }: { article: Article }) {
  return (
    <article className="pb-8">
      <h1 className="max-w-[720px] text-[30px] font-bold leading-[1.15] tracking-normal text-[#2b2f33] md:text-[34px]">
        <Link className="focus-ring rounded-sm hover:text-[#2f7cd3]" href={articlePath(article)}>
          {article.title}
        </Link>
      </h1>
      <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-[#90949a]">
        <span>{formatDate(article.lastUpdated)}</span>
        <span>
          Category:{" "}
          <Link className="focus-ring rounded-sm text-[#90949a] hover:text-[#2f7cd3]" href={categoryHref(article.type)}>
            {articleTypeLabel[article.type]}
          </Link>
        </span>
        <span>Author: Jacob</span>
        <span>0</span>
      </div>
      <Link className="focus-ring mt-7 block self-start overflow-hidden bg-neutral-100" href={articlePath(article)}>
        <Image
          alt={`${article.title} thumbnail`}
          className="aspect-[16/9] w-full object-cover"
          height={420}
          priority
          src={articleImage(article)}
          width={740}
        />
      </Link>
      <p className="mt-5 text-base leading-7 text-neutral-800">{article.summary}</p>
      <Link className="focus-ring mt-4 inline-block rounded-sm text-base text-[#2f7cd3] hover:text-[#1f5f9f]" href={articlePath(article)}>
        Read more
      </Link>
    </article>
  );
}

function SidebarSearch({ activeCategory, searchQuery }: { activeCategory?: ArticleType; searchQuery: string }) {
  return (
    <section>
      <h2 className="text-base font-normal tracking-normal text-neutral-950">Search</h2>
      <form action="/" className="mt-1 flex gap-3" role="search">
        {activeCategory ? <input name="category" type="hidden" value={activeCategory} /> : null}
        <label className="sr-only" htmlFor="site-search">
          Search posts
        </label>
        <input
          className="min-w-0 flex-1 border border-[#9ca0a6] px-3 py-3 text-base text-neutral-950 outline-none focus:border-[#2f7cd3]"
          defaultValue={searchQuery}
          id="site-search"
          name="s"
          type="search"
        />
        <button className="focus-ring bg-[#2f343b] px-6 py-3 text-base text-white hover:bg-[#1e2329]" type="submit">
          Search
        </button>
      </form>
    </section>
  );
}

function SidebarSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-normal text-[#2b2f33]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function filterArticles(articles: Article[], searchQuery: string, activeCategory?: ArticleType) {
  const normalizedQuery = searchQuery.toLowerCase();
  return articles.filter((article) => {
    if (activeCategory && article.type !== activeCategory) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    return `${article.title} ${article.summary} ${articleTypeLabel[article.type]}`.toLowerCase().includes(normalizedQuery);
  });
}

function archiveHeading(searchQuery: string, activeCategory?: ArticleType) {
  if (searchQuery) {
    return `Search results for "${searchQuery}"`;
  }
  if (activeCategory) {
    return articleTypeLabel[activeCategory];
  }
  return "Latest Posts";
}

function categoryParam(value: string | string[] | undefined) {
  const param = firstParam(value);
  if (homeArticleTypes.has(param as ArticleType)) {
    return param as ArticleType;
  }
  return undefined;
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function categoryHref(type: ArticleType) {
  return `/?category=${type}#latest-posts`;
}

function categoryCount(articles: Article[], type?: ArticleType) {
  return type ? articles.filter((article) => article.type === type).length : articles.length;
}

function articleImage(article: Article) {
  if (article.slug.includes("gaming-monitor")) {
    return "/images/trend-articles/gaming-monitor-korea-2026.png";
  }
  if (article.slug.includes("runway") || article.slug.includes("aleph")) {
    return "/images/trend-articles/runway-aleph-ai-video-editor.png";
  }
  if (article.type === "buyer_guide") {
    return "/images/market-guides/us-samsung-s90f-oled-hero.png";
  }
  if (article.type === "ingredient_guide") {
    return "/images/market-guides/kr-2026-admission-checklist-hero.png";
  }
  return "/images/trend-products/trend-product-contact-sheet.png";
}

function sortHomeArticles(a: Article, b: Article) {
  const dateDiff = Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated);
  if (dateDiff !== 0) {
    return dateDiff;
  }
  return (articleTypeRank[a.type] ?? 99) - (articleTypeRank[b.type] ?? 99);
}

function formatDate(value: string) {
  const date = new Date(value);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getUTCFullYear()}`;
}
