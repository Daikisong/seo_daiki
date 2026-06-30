import { JsonLd } from "@/components/seo/JsonLd";
import type { Article, Product } from "@/lib/trend-site/types";
import { absoluteUrl, articlePath } from "@/lib/trend-site/routes";
import { localeToHtmlLang } from "@/lib/trend-site/locales";
import { ArticleTypeContent } from "./ArticleTypeContent";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

interface ArticlePageProps {
  article: Article;
  pageUrl?: string;
  products: Product[];
  publisherUrl?: string;
}

export function ArticlePage({ article, pageUrl, products, publisherUrl }: ArticlePageProps) {
  const htmlLang = localeToHtmlLang(article.locale);

  return (
    <>
      <SiteHeader locale={article.locale} currentHref={articlePath(article)} />
      <main className="mx-auto max-w-[1090px] px-5 py-5 md:py-8" lang={htmlLang}>
        <JsonLd
          data={articleJsonLdWithUrls(article, pageUrl ?? absoluteUrl(articlePath(article)), publisherUrl ?? absoluteUrl("/"))}
        />
        <article className="space-y-[25px]">
          <header className="border-b border-neutral-200 pb-[25px]">
            <h1 className="mt-0 text-[18px] font-bold leading-[19.8px] tracking-normal text-neutral-950 md:text-[30px] md:leading-[33px]">
              {article.h1}
            </h1>
            <div className="mt-[15px] flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.75px] leading-[21.675px] text-neutral-600 md:mt-5 md:text-[13.6px] md:leading-[23.12px]">
              <span>Updated {article.lastUpdated}</span>
              <span>By Jacob</span>
              <span>Buyer decision guide</span>
            </div>
            <p className="mt-[25px] text-[15px] leading-[27px] text-neutral-700 md:text-base md:leading-[28.8px]">
              {article.summary}
            </p>
            <p className="mt-4 border-l-4 border-cyan-500 bg-cyan-50 px-4 py-3 text-sm leading-6 text-neutral-700">
              {article.affiliateDisclosure}
            </p>
          </header>

          <ArticleTypeContent article={article} products={products} />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

export function articleJsonLdWithUrls(article: Article, url: string, publisherUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: article.imageUrl,
    inLanguage: localeToHtmlLang(article.locale),
    dateModified: article.lastUpdated,
    datePublished: article.lastUpdated,
    author: { "@type": "Person", name: "Jacob" },
    publisher: { "@type": "Organization", name: "TREND - Jacob", url: publisherUrl },
    reviewedBy: { "@type": "Person", name: "Jacob" },
    mainEntityOfPage: url,
    url
  };
}
