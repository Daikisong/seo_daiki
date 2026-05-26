import Link from "next/link";
import {
  absoluteUrl,
  articlePath,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildDatasetJsonLd,
  buildItemListJsonLd,
  buildProductJsonLd,
  buildProductSnippetJsonLd,
  sectionHrefForArticle
} from "@global-import-lab/seo";
import type { Article, Product } from "@global-import-lab/types";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";
import { AffiliateOutboundLink } from "@/components/seo/AffiliateOutboundLink";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { UpdateLog } from "@/components/seo/UpdateLog";
import { BuyAvoidCard } from "@/components/product/BuyAvoidCard";
import { SellerClaimTable } from "@/components/product/SellerClaimTable";
import { VerifiedClaimTable } from "@/components/product/VerifiedClaimTable";
import { VariantTrapMap } from "@/components/product/VariantTrapMap";
import { PriceTruthCard } from "@/components/product/PriceTruthCard";
import { ReviewSignalSummary } from "@/components/product/ReviewSignalSummary";
import { MarketRiskMatrix } from "@/components/product/MarketRiskMatrix";
import { AlternativesGrid } from "@/components/product/AlternativesGrid";
import { EvidenceList } from "@/components/product/EvidenceList";
import { TestMethodBlock } from "@/components/product/TestMethodBlock";
import { ProductComparisonTable } from "@/components/compare/ProductComparisonTable";
import { ScoreBreakdown } from "@/components/compare/ScoreBreakdown";
import { UseCaseRecommendation } from "@/components/compare/UseCaseRecommendation";
import { BenchmarkTable } from "@/components/data/BenchmarkTable";
import { SortableMetricTable } from "@/components/data/SortableMetricTable";
import { DatasetDownload } from "@/components/data/DatasetDownload";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { VerdictCard } from "@/components/product/VerdictCard";

interface ArticlePageProps {
  article: Article;
  product?: Product;
  allProducts: Product[];
  allArticles: Article[];
}

export function ArticlePage({ article, product, allProducts, allArticles }: ArticlePageProps) {
  const breadcrumbItems = [
    { label: "Home", href: `/${article.locale}/` },
    {
      label: article.type,
      href: article.type === "hub" ? articlePath(article) : sectionHrefForArticle(article)
    },
    { label: article.h1, href: articlePath(article) }
  ];
  const jsonLd = buildJsonLd(article, product, allProducts, allArticles);

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
                  href={affiliateTrackingHref(link, article)}
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

function affiliateTrackingHref(link: Article["affiliateLinks"][number], article: Article) {
  if (link.placementId && process.env.CONTENT_SOURCE === "database") {
    const params = new URLSearchParams({ placementId: link.placementId });
    return `/api/affiliate-click?${params.toString()}`;
  }

  if (!isUnsafeAffiliateTargetRedirectAllowed()) {
    return link.href;
  }

  const params = new URLSearchParams({
    target: link.href,
    articleId: article.id,
    locale: article.locale
  });

  if (article.productId) {
    params.set("productId", article.productId);
  }

  return `/api/affiliate-click?${params.toString()}`;
}

function isUnsafeAffiliateTargetRedirectAllowed() {
  return process.env.NODE_ENV !== "production" && process.env.ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT === "true";
}

function ArticleTypeContent({
  article,
  product,
  allProducts,
  allArticles
}: {
  article: Article;
  product?: Product;
  allProducts: Product[];
  allArticles: Article[];
}) {
  const alternatives = allProducts.filter((item) => item.id !== product?.id).slice(0, 3);
  const alternativeLinks = alternatives.flatMap((item) => {
    const href = reviewPathForProduct(article.locale, item, allArticles);
    return href ? [{ product: item, href }] : [];
  });
  const categoryProducts = product ? allProducts.filter((item) => item.category === product.category) : allProducts;

  if (article.type === "review" && product) {
    return (
      <>
        <VerdictCard
          verdict={article.summary}
          bestFor={["Travel backup", "Low-cost phone and tablet charging", "Buyers who check SKU options"]}
          avoidIf={["You need certified office equipment", "You need easy local returns", "You cannot verify plug and cable options"]}
        />
        <BuyAvoidCard
          buy="Buy only when the final shipped price stays below the buy zone and the selected SKU is the tested wattage."
          avoid="Avoid the cheapest option when it is a lower-wattage SKU under a high-wattage listing title."
        />
        <SellerClaimTable claims={product.sellerClaims} />
        <VerifiedClaimTable claims={product.verifiedClaims} />
        <VariantTrapMap variants={product.variants} />
        <PriceTruthCard snapshots={product.priceSnapshots} />
        <ReviewSignalSummary locale={article.locale} signals={product.reviewSignals} />
        <MarketRiskMatrix locale={article.locale} risks={product.marketRisks} />
        {alternativeLinks.length > 0 ? <AlternativesGrid alternatives={alternativeLinks} /> : null}
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "compare") {
    return (
      <>
        <ProductComparisonTable products={categoryProducts} />
        <ScoreBreakdown score={article.qualityScore} />
        <UseCaseRecommendation recommendation="Choose 65W for lower-cost travel charging. Choose 100W only when your laptop, cable, and plug setup can use the higher output." />
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "data") {
    return (
      <>
        <BenchmarkTable products={categoryProducts} />
        <SortableMetricTable products={categoryProducts} />
        <DatasetDownload href={`/datasets/${article.slug}.csv`} />
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "lab") {
    return (
      <>
        <TestMethodBlock />
        <BenchmarkTable products={categoryProducts} />
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "guide") {
    return (
      <>
        <section className="grid gap-4 md:grid-cols-2">
          {article.sections.map((section) => (
            <div className="rounded-md border border-neutral-200 bg-white p-4" key={section.heading}>
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              <p className="mt-2 text-sm text-neutral-700">{section.body}</p>
            </div>
          ))}
        </section>
        {product ? <VariantTrapMap variants={product.variants} /> : null}
        {product ? <MarketRiskMatrix locale={article.locale} risks={product.marketRisks} /> : null}
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "risk") {
    return (
      <>
        <SectionGrid article={article} />
        {product ? <MarketRiskMatrix locale={article.locale} risks={product.marketRisks} /> : null}
        <ProductComparisonTable products={categoryProducts} />
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "methodology") {
    return (
      <>
        <TestMethodBlock />
        <ScoreBreakdown score={article.qualityScore} />
        <SectionGrid article={article} />
        <EvidenceList evidenceIds={article.evidenceIds} />
      </>
    );
  }

  return (
    <>
      <ProductComparisonTable products={categoryProducts} />
      <SectionGrid article={article} />
      <EvidenceList evidenceIds={article.evidenceIds} />
      <UpdateLog lastUpdated={article.lastUpdated} />
    </>
  );
}

function SectionGrid({ article }: { article: Article }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {article.sections.map((section) => (
        <div className="rounded-md border border-neutral-200 bg-white p-4" key={section.heading}>
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          <p className="mt-2 text-sm text-neutral-700">{section.body}</p>
        </div>
      ))}
    </section>
  );
}

function reviewPathForProduct(locale: Article["locale"], product: Product, allArticles: Article[]) {
  const review =
    allArticles.find(
      (candidate) =>
        candidate.locale === locale &&
        candidate.type === "review" &&
        candidate.productId === product.id &&
        candidate.publishStatus === "published" &&
        candidate.indexStatus === "index"
    ) ??
    allArticles.find(
      (candidate) =>
        candidate.locale === locale &&
        candidate.type === "review" &&
        candidate.productId === product.id &&
        candidate.publishStatus === "published"
    );

  return review ? articlePath(review) : undefined;
}

function buildJsonLd(article: Article, product: Product | undefined, allProducts: Product[], allArticles: Article[]) {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", url: absoluteUrl(`/${article.locale}/`) },
    { name: article.type, url: absoluteUrl(sectionHrefForArticle(article)) },
    { name: article.h1, url: absoluteUrl(articlePath(article)) }
  ]);
  const articleJsonLd = buildArticleJsonLd(article);

  if (article.type === "data") {
    return [articleJsonLd, buildDatasetJsonLd(article), breadcrumbs];
  }

  if (article.type === "review" && product) {
    return [articleJsonLd, buildProductJsonLd(product, article), breadcrumbs];
  }

  if (article.type === "hub" || article.type === "compare") {
    const linkedProducts = allProducts.flatMap((item) => {
      const reviewPath = reviewPathForProduct(article.locale, item, allArticles);
      return reviewPath ? [{ product: item, name: item.canonicalName, url: absoluteUrl(reviewPath) }] : [];
    });
    const itemListLinks = internalLinkSchemaItems(article);

    if (article.type === "hub") {
      return [
        articleJsonLd,
        buildCollectionPageJsonLd(article, itemListLinks),
        buildItemListJsonLd(article.title, itemListLinks),
        breadcrumbs
      ];
    }

    return [
      articleJsonLd,
      buildItemListJsonLd(article.title, itemListLinks),
      ...linkedProducts.slice(0, 10).map((item) => buildProductSnippetJsonLd(item.product, item.url)),
      breadcrumbs
    ];
  }

  return [articleJsonLd, breadcrumbs];
}

function internalLinkSchemaItems(article: Article) {
  return article.internalLinks.map((link) => ({
    name: link.label,
    url: /^https?:\/\//i.test(link.href) ? link.href : absoluteUrl(link.href)
  }));
}
