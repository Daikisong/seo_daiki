import { notFound } from "next/navigation";
import {
  buildExistingMarketContentHreflangMap,
  canonicalForMarketPath,
  hreflangKeyForMarket,
  marketContentPath
} from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { enabledMarkets, findMarket } from "@/lib/market/config";
import { marketContentHreflangVariants, readMarketPosts } from "@/lib/market/market-data";
import { labelsForLanguage } from "@/lib/market/ui-labels";
import { marketResearchMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ locale: string; language: string; slug: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().flatMap((market) =>
    readMarketPosts(market).map((post) => ({ locale: market.market, language: market.language, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const post = readMarketPosts(market).find((item) => item.slug === slug);
  const path = marketContentPath(market, "posts", slug);
  const variants = marketContentHreflangVariants(enabledMarkets(), "posts", slug);
  const currentVariant = variants.find((variant) => variant.market === market.market && variant.language === market.language) ?? {
    market: market.market,
    language: market.language,
    path,
    hreflang: hreflangKeyForMarket(market),
    exists: Boolean(post),
    indexable: true
  };
  return marketResearchMetadata({
    title: post ? `${post.title} | Test Post` : `${market.country} Test Post`,
    description: post?.summary ?? `Website test post for ${market.country}.`,
    canonical: canonicalForMarketPath(path),
    hreflangMap: buildExistingMarketContentHreflangMap(variants, currentVariant)
  });
}

export default async function MarketPostPage({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }
  const post = readMarketPosts(market).find((item) => item.slug === slug);
  if (!post) {
    notFound();
  }
  const { labels } = labelsForLanguage(market.language);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">{labels.websiteTestPost}</p>
        <h1 className="mt-3 text-4xl font-semibold">{post.title}</h1>
        <p className="mt-4 text-neutral-700">{post.summary}</p>
        <p className="mt-2 text-sm text-neutral-600">
          {labels.status}: {post.status}. {labels.productCandidateAnalysis}: {post.productCandidateState}.{" "}
          {labels.monetizationDeferred}: {post.monetizationDeferred ? labels.yes : labels.no}.
        </p>
        <article className="mt-8 grid gap-5">
          {post.sections.map((section) => (
            <section className="rounded-md border border-neutral-200 bg-white p-4" key={section.heading}>
              <h2 className="text-xl font-semibold">{section.heading}</h2>
              <p className="mt-2 text-neutral-700">{section.body}</p>
            </section>
          ))}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
