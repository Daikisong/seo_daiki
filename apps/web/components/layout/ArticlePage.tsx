import Link from "next/link";
import { articlePath } from "@global-import-lab/seo";
import type { Article, Product } from "@global-import-lab/types";
import {
  affiliateTrackingHrefForArticle,
  breadcrumbItemsForArticle,
  buildArticlePageJsonLd
} from "@/lib/content/article-page-model";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";
import { AffiliateOutboundLink } from "@/components/seo/AffiliateOutboundLink";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleTypeContent } from "./ArticleTypeContent";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

interface ArticlePageProps {
  article: Article;
  product?: Product;
  allProducts: Product[];
  allArticles: Article[];
}

export function ArticlePage({ article, product, allProducts, allArticles }: ArticlePageProps) {
  const breadcrumbItems = breadcrumbItemsForArticle(article);
  const jsonLd = buildArticlePageJsonLd(article, product, allProducts, allArticles);
  const isTrendCommerceArticle = article.type === "trend";
  const showTopAffiliateActions = article.type !== "trend" && article.affiliateLinks.length > 0;

  return (
    <>
      <SiteHeader locale={article.locale} currentHref={articlePath(article)} alternates={article.hreflangMap} />
      <main className={isTrendCommerceArticle ? "mx-auto max-w-5xl px-4 py-5 md:py-8" : "mx-auto max-w-7xl px-4 py-8"}>
        <JsonLd data={jsonLd} />
        <div>
          <div>
            {isTrendCommerceArticle ? <TrendEditorialMasthead /> : <Breadcrumbs items={breadcrumbItems} />}
            <article className="space-y-7">
              {article.indexStatus !== "index" ? (
                <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                  This page is generated but not indexable yet because the quality gate needs more evidence.
                </div>
              ) : null}

              {showTopAffiliateActions ? <AffiliateDisclosure /> : null}

              <header className={isTrendCommerceArticle ? "border-b border-neutral-200 pb-7" : "max-w-4xl"}>
                {isTrendCommerceArticle ? null : (
                  <p className="text-sm font-semibold uppercase text-teal-700">{article.type.replace("_", " ")}</p>
                )}
                <h1
                  className={
                    isTrendCommerceArticle
                      ? "mt-4 text-3xl font-black leading-tight tracking-normal text-neutral-950 md:text-5xl"
                      : "mt-3 text-4xl font-black leading-tight tracking-normal text-neutral-950 md:text-5xl"
                  }
                >
                  {article.h1}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600">
                  <span>Updated {article.lastUpdated}</span>
                  <span>{article.locale}</span>
                  <span>By Jacob</span>
                </div>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-700">{article.summary}</p>
              </header>

              {showTopAffiliateActions ? (
                <div className="flex flex-wrap gap-3">
                  {article.affiliateLinks.map((link) => (
                    <AffiliateOutboundLink
                      articleId={article.id}
                      href={affiliateTrackingHrefForArticle(link, article)}
                      key={link.href}
                      label={link.label}
                      locale={article.locale}
                      productId={article.productId}
                      rel={link.rel}
                    />
                  ))}
                </div>
              ) : null}

              <ArticleTypeContent article={article} product={product} allProducts={allProducts} allArticles={allArticles} />

              <section className="border-t border-neutral-200 pt-6">
                <h2 className="text-lg font-black tracking-normal text-neutral-950">Related trend guides</h2>
                <div className="mt-3 divide-y divide-neutral-200 border-y border-neutral-200">
                  {article.internalLinks.map((link) => (
                    <Link className="focus-ring block py-3 hover:text-teal-800" href={link.href} key={link.href}>
                      <span className="block font-medium">{link.label}</span>
                      <span className="mt-1 block text-xs uppercase text-neutral-500">{link.reason}</span>
                    </Link>
                  ))}
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function TrendEditorialMasthead() {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3 text-sm text-neutral-600">
      <span className="font-black uppercase tracking-normal text-neutral-950">Trend guide</span>
      <span>Independent trend guide</span>
    </div>
  );
}
