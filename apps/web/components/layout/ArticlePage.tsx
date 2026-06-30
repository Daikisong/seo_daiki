import Image from "next/image";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Article, Product } from "@/lib/trend-site/types";
import { getTrendAuthorById } from "@/lib/trend-site/authors";
import { absoluteUrl, articlePath } from "@/lib/trend-site/routes";
import { localeToHtmlLang } from "@/lib/trend-site/locales";
import {
  type TrendCategory,
  trendContentUnitName,
  trendSiteName,
} from "@/lib/trend-site/categories";
import { InlineEmphasis } from "./InlineEmphasis";
import { ArticleTypeContent } from "./ArticleTypeContent";
import { TrendRecentUpdate } from "./article-type-content-parts";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

interface ArticlePageProps {
  article: Article;
  navCategories?: readonly TrendCategory[];
  pageUrl?: string;
  products: Product[];
  publisherUrl?: string;
}

export function ArticlePage({
  article,
  navCategories = [],
  pageUrl,
  products,
  publisherUrl,
}: ArticlePageProps) {
  const htmlLang = localeToHtmlLang(article.locale);

  return (
    <>
      <SiteHeader
        locale={article.locale}
        currentHref={articlePath(article)}
        navCategories={navCategories}
      />
      <main
        className="mx-auto max-w-[1170px] px-5 py-10 md:py-14"
        lang={htmlLang}
      >
        <JsonLd
          data={articleJsonLdWithUrls(
            article,
            pageUrl ?? absoluteUrl(articlePath(article)),
            publisherUrl ?? absoluteUrl("/"),
          )}
        />
        <article className="space-y-8">
          <header className="mx-auto max-w-[890px] text-center">
            <nav
              aria-label="Breadcrumb"
              className="mb-4 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.08em] text-[#061936]"
            >
              <a
                className="underline decoration-neutral-400 underline-offset-3 hover:text-[#d80057]"
                href="/"
              >
                Home
              </a>
              <span aria-hidden className="text-black">
                ›
              </span>
              <span>What to buy</span>
              <span aria-hidden className="text-black">
                ›
              </span>
              <span>{trendContentUnitName}</span>
            </nav>
            <h1 className="mt-0 font-serif text-[34px] font-normal leading-[38px] tracking-normal text-black md:text-[46px] md:leading-[52px]">
              {article.h1}
            </h1>
            <p className="mx-auto mt-6 max-w-[760px] text-[16px] leading-[25px] text-black md:text-[18px] md:leading-[28px]">
              <InlineEmphasis>{article.summary}</InlineEmphasis>
            </p>
            <ArticleByline article={article} />
          </header>

          <figure className="mx-auto max-w-[1170px] overflow-hidden bg-neutral-100">
            <Image
              alt={`${article.title} hero image`}
              className="aspect-[16/7] w-full object-cover"
              height={613}
              priority
              sizes="(min-width: 1090px) 1090px, calc(100vw - 40px)"
              src={article.imageUrl}
              width={1090}
            />
            <figcaption className="mt-2 text-xs leading-5 text-neutral-600">
              Image credit: TrendBrief
            </figcaption>
          </figure>
          <ArticleShareRow />
          <div className="mx-auto max-w-[980px]">
            <TrendRecentUpdate article={article} />
            <ArticleJumpLinks article={article} />
          </div>
          <div className="grid gap-10 xl:grid-cols-[minmax(0,850px)_280px] xl:items-start">
            <div className="min-w-0 space-y-[25px]">
              <ArticleTypeContent article={article} products={products} />
            </div>
            <ArticleRightRail article={article} />
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function ArticleRightRail({ article }: { article: Article }) {
  const relatedLinks = (article.relatedArticles ?? []).slice(0, 3);
  return (
    <aside className="hidden space-y-6 xl:block">
      <RailBox title="In this brief">
        <ul className="space-y-2 text-sm leading-6">
          {[
            ["#quick-list", "The quick list"],
            ["#top-10-reviews", "Product notes"],
            ["#top-10-comparison", "Compare specs"],
            ["#final-thoughts", "Final thoughts"],
            ["#faq", "FAQ"],
          ].map(([href, label]) => (
            <li key={href}>
              <a
                className="font-bold text-[#2f7cd3] hover:text-[#1f5f9f] hover:underline"
                href={href}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </RailBox>
      {article.expertCopy.updateLog[0] ? (
        <RailBox title="Recent update">
          <p className="text-sm leading-6 text-neutral-700">
            <InlineEmphasis>{article.expertCopy.updateLog[0]}</InlineEmphasis>
          </p>
        </RailBox>
      ) : null}
      {relatedLinks.length >= 2 ? (
        <RailBox title="More to read">
          <ul className="space-y-3 text-sm leading-6">
            {relatedLinks.map((item) => (
              <li key={item.href}>
                <a
                  className="font-bold text-neutral-950 underline decoration-[#2f7cd3] decoration-2 underline-offset-4 hover:text-[#2f7cd3]"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </RailBox>
      ) : null}
      <RailBox title="Trending Briefs">
        <p className="text-sm leading-6 text-neutral-700">
          The active Brief on this page tracks a fast-moving buyer problem and
          the product routes readers are most likely to compare first.
        </p>
        <a
          className="mt-3 inline-block text-sm font-black text-[#2f7cd3] hover:underline"
          href="/#latest-briefs"
        >
          See latest Briefs
        </a>
      </RailBox>
      <RailBox title="Affiliate note">
        <p className="text-sm leading-6 text-neutral-700">
          Some price buttons may be paid affiliate links. Product placement is
          still based on variant clarity, buyer fit, source checks, and return
          path.
        </p>
      </RailBox>
      <RailBox title="Get the next Brief">
        <p className="text-sm leading-6 text-neutral-700">
          TrendBrief is built for short, practical buyer notes when a trend
          starts changing what people need to compare.
        </p>
        <a
          className="mt-3 inline-block text-sm font-black text-[#2f7cd3] hover:underline"
          href="/#newsletter"
        >
          Newsletter
        </a>
      </RailBox>
      <RailBox title="How Briefs work">
        <p className="text-sm leading-6 text-neutral-700">
          TrendBrief compares exact variants, seller paths, review complaints,
          and return terms before a product belongs in a Brief.
        </p>
        <a
          className="mt-3 inline-block text-sm font-black text-[#2f7cd3] hover:underline"
          href="/methodology/"
        >
          Read the method
        </a>
      </RailBox>
    </aside>
  );
}

function RailBox({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="border-t-4 border-[#d80057] bg-neutral-50 p-4">
      <h2 className="text-base font-black text-neutral-950">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ArticleByline({ article }: { article: Article }) {
  const author = getTrendAuthorById(article.authorId);
  if (!author) {
    throw new Error(`Missing public author for article: ${article.id}`);
  }

  return (
    <div className="mx-auto mt-8 max-w-[620px]">
      <div className="flex flex-col items-center justify-center gap-4 text-[12px] leading-5 text-black md:flex-row">
        <div
          aria-hidden
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#061936] font-serif text-lg font-bold text-white"
        >
          J
        </div>
        <p className="text-center md:text-left">
          <span className="font-black uppercase">By </span>
          <a
            className="font-black uppercase text-black hover:text-[#d80057]"
            href={author.authorPagePath}
          >
            {author.name}
          </a>
          <span className="ml-1 uppercase text-neutral-500">
            Last updated {article.lastUpdated}
          </span>
        </p>
      </div>
      <p className="mt-7 text-center text-[13px] leading-6 text-neutral-800">
        <InlineEmphasis>{article.affiliateDisclosure}</InlineEmphasis>
      </p>
    </div>
  );
}

function ArticleShareRow() {
  return (
    <div className="mx-auto flex max-w-[760px] flex-wrap items-center justify-center gap-4 border-b border-neutral-200 pb-6 text-sm text-black">
      <span className="font-bold">Share this article</span>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#061936] text-xs font-black text-white">
        f
      </span>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-black text-white">
        x
      </span>
      <a
        className="font-bold underline decoration-neutral-400 underline-offset-3 hover:text-[#d80057]"
        href="/#newsletter"
      >
        Subscribe to our newsletter
      </a>
    </div>
  );
}

function ArticleJumpLinks({ article }: { article: Article }) {
  const links = [
    article.expertCopy.updateLog.length > 0
      ? { href: "#recent-update", label: "Recent update" }
      : null,
    article.trendSignalBox
      ? { href: "#trend-signal", label: "Trend signal" }
      : null,
    article.sections.some((section) => section.role === "quick-answer")
      ? { href: "#quick-answer", label: "Quick answer" }
      : null,
    { href: "#quick-list", label: "The quick list" },
    { href: "#top-10-reviews", label: "Product notes" },
    { href: "#top-10-comparison", label: "Compare specs" },
    { href: "#faq", label: "FAQ" },
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  return (
    <nav
      aria-label={`${trendContentUnitName} sections`}
      className="border-y border-neutral-200 py-3"
    >
      <p className="text-xs font-black uppercase tracking-normal text-neutral-500">
        Jump to
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            className="border border-neutral-300 px-3 py-2 text-sm font-bold leading-5 text-neutral-900 hover:border-[#2f7cd3] hover:text-[#2f7cd3]"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function articleJsonLdWithUrls(
  article: Article,
  url: string,
  publisherUrl: string,
) {
  const imageUrl = new URL(article.imageUrl, publisherUrl).toString();
  const author = getTrendAuthorById(article.authorId);
  if (!author) {
    throw new Error(`Missing public author for article JSON-LD: ${article.id}`);
  }
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: imageUrl,
    inLanguage: localeToHtmlLang(article.locale),
    dateModified: article.lastUpdated,
    datePublished: article.lastUpdated,
    author: {
      "@type": "Person",
      name: author.name,
      url: new URL(author.authorPagePath, publisherUrl).toString(),
    },
    publisher: {
      "@type": "Organization",
      name: trendSiteName,
      url: publisherUrl,
    },
    mainEntityOfPage: url,
    url,
  };
}
