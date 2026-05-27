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

  return (
    <>
      <SiteHeader locale={article.locale} currentHref={articlePath(article)} alternates={article.hreflangMap} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <JsonLd data={jsonLd} />
        <Breadcrumbs items={breadcrumbItems} />

        <article className="space-y-6">
          {article.indexStatus !== "index" ? (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              This page is generated but not indexable yet because the quality gate needs more evidence.
            </div>
          ) : null}

          {article.affiliateLinks.length > 0 ? <AffiliateDisclosure /> : null}

          <header className="max-w-4xl">
            <p className="text-sm font-semibold uppercase text-teal-700">{article.type}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{article.h1}</h1>
            <p className="mt-4 text-lg text-neutral-700">{article.summary}</p>
          </header>

          {article.affiliateLinks.length > 0 ? (
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

          <section className="rounded-md border border-neutral-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Internal link graph</h2>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {article.internalLinks.map((link) => (
                <Link className="focus-ring rounded-md border border-neutral-200 p-3 hover:border-teal-700" href={link.href} key={link.href}>
                  <span className="block font-medium">{link.label}</span>
                  <span className="mt-1 block text-xs uppercase text-neutral-500">{link.reason}</span>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
