import Image from "next/image";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Article, Product } from "@/lib/trend-site/types";
import { getTrendAuthorById } from "@/lib/trend-site/authors";
import { absoluteUrl, articlePath } from "@/lib/trend-site/routes";
import { localeToHtmlLang } from "@/lib/trend-site/locales";
import {
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
  pageUrl?: string;
  products: Product[];
  publisherUrl?: string;
}

export function ArticlePage({
  article,
  pageUrl,
  products,
  publisherUrl,
}: ArticlePageProps) {
  const htmlLang = localeToHtmlLang(article.locale);

  return (
    <>
      <SiteHeader locale={article.locale} currentHref={articlePath(article)} />
      <main
        className="mx-auto max-w-[1090px] px-5 py-5 md:py-8"
        lang={htmlLang}
      >
        <JsonLd
          data={articleJsonLdWithUrls(
            article,
            pageUrl ?? absoluteUrl(articlePath(article)),
            publisherUrl ?? absoluteUrl("/"),
          )}
        />
        <article className="space-y-[25px]">
          <header className="border-b border-neutral-200 pb-[25px]">
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
            <h1 className="mt-0 text-[18px] font-bold leading-[19.8px] tracking-normal text-neutral-950 md:text-[30px] md:leading-[33px]">
              {article.h1}
            </h1>
            <p className="mt-[18px] text-[15px] leading-[27px] text-neutral-700 md:text-base md:leading-[28.8px]">
              <InlineEmphasis>{article.summary}</InlineEmphasis>
            </p>
            <ArticleByline article={article} />
          </header>

          <ArticleJumpLinks article={article} />
          <TrendRecentUpdate article={article} />
          <figure className="overflow-hidden bg-neutral-100">
            <Image
              alt={`${article.title} hero image`}
              className="aspect-[16/9] w-full object-cover"
              height={613}
              priority
              sizes="(min-width: 1090px) 1090px, calc(100vw - 40px)"
              src={article.imageUrl}
              width={1090}
            />
          </figure>
          <ArticleTypeContent article={article} products={products} />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function ArticleByline({ article }: { article: Article }) {
  const author = getTrendAuthorById(article.authorId);
  if (!author) {
    throw new Error(`Missing public author for article: ${article.id}`);
  }

  return (
    <div className="mt-5 border-y border-neutral-200 py-4">
      <div className="grid gap-4 text-sm leading-6 text-neutral-700 md:grid-cols-3">
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
            Product checks
          </span>
          <span className="font-black text-neutral-950">
            Specs, routes, prices, and review patterns
          </span>
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
      <p className="mt-4 border-l-4 border-cyan-500 bg-cyan-50 px-4 py-3 text-sm leading-6 text-neutral-700">
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
      className="border-y border-neutral-200 py-4"
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
