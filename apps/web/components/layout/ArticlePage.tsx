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
  trendSiteDescription,
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
        className="mx-auto max-w-[1170px] px-5 py-4 md:py-6"
        lang={htmlLang}
      >
        <JsonLd
          data={articleJsonLdWithUrls(
            article,
            pageUrl ?? absoluteUrl(articlePath(article)),
            publisherUrl ?? absoluteUrl("/"),
          )}
        />
        <article className="space-y-4 md:space-y-5">
          <header className="border-b border-neutral-200 pb-4">
            <nav
              aria-label="Breadcrumb"
              className="mb-4 text-xs font-bold uppercase tracking-normal text-neutral-500"
            >
              <a className="hover:text-[#2f7cd3]" href="/">
                Home
              </a>
              <span className="mx-2 text-neutral-300">/</span>
              <span>{trendContentUnitName}</span>
            </nav>
            <h1 className="mt-0 text-[24px] font-black leading-[27px] tracking-normal text-neutral-950 md:text-[38px] md:leading-[42px]">
              {article.h1}
            </h1>
            <p className="mt-4 text-[15px] leading-[25px] text-neutral-700 md:text-base md:leading-[27px]">
              <InlineEmphasis>{article.summary}</InlineEmphasis>
            </p>
            <ArticleByline article={article} />
          </header>

          <figure className="overflow-hidden bg-neutral-100">
            <Image
              alt={`${article.title} hero image`}
              className="aspect-[21/9] w-full object-cover"
              height={613}
              priority
              sizes="(min-width: 1090px) 1090px, calc(100vw - 40px)"
              src={article.imageUrl}
              width={1090}
            />
          </figure>
          <ArticleJumpLinks article={article} />
          <TrendRecentUpdate article={article} />
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
    <section className="border-t-4 border-cyan-500 bg-neutral-50 p-4">
      <h2 className="text-base font-black text-neutral-950">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ArticleByline({ article }: { article: Article }) {
  const author = getTrendAuthorById(article.authorId);
  const evidenceEditor = getTrendAuthorById(article.productEvidenceById);
  if (!author) {
    throw new Error(`Missing public author for article: ${article.id}`);
  }

  return (
    <div className="mt-4 border-y border-neutral-200 py-3">
      <div className="grid gap-3 text-sm leading-6 text-neutral-700 md:grid-cols-3">
        <p>
          <span className="block text-xs font-black uppercase text-neutral-500">
            Written by
          </span>
          <a
            className="font-black text-neutral-950 hover:text-[#2f7cd3]"
            href={author.authorPagePath}
          >
            {author.name}
          </a>
          <span className="block text-neutral-600">{author.role}</span>
        </p>
        <p>
          <span className="block text-xs font-black uppercase text-neutral-500">
            Product evidence by
          </span>
          {evidenceEditor ? (
            <a
              className="font-black text-neutral-950 hover:text-[#2f7cd3]"
              href={evidenceEditor.authorPagePath}
            >
              {evidenceEditor.name}
            </a>
          ) : (
            <span className="font-black text-neutral-950">
              Specs, routes, prices, and review patterns
            </span>
          )}
          <span className="block text-neutral-600">
            Exact variant, stock, warranty, and return-path checks
          </span>
        </p>
        <p>
          <span className="block text-xs font-black uppercase text-neutral-500">
            Last updated
          </span>
          <span className="font-black text-neutral-950">
            {article.lastUpdated}
          </span>
          <span className="block text-neutral-600">{trendSiteDescription}</span>
        </p>
      </div>
      <p className="mt-3 border-l-4 border-cyan-500 bg-cyan-50 px-4 py-2 text-sm leading-6 text-neutral-700">
        <InlineEmphasis>{article.affiliateDisclosure}</InlineEmphasis>
      </p>
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
