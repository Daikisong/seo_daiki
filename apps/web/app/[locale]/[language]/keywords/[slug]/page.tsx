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
import { marketContentHreflangVariants, readMarketKeywords } from "@/lib/market/market-data";
import { routeSlugMatches } from "@/lib/market/route-slugs";
import { labelsForLanguage } from "@/lib/market/ui-labels";
import { marketResearchMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ locale: string; language: string; slug: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().flatMap((market) =>
    readMarketKeywords(market).map((keyword) => ({ locale: market.market, language: market.language, slug: keyword.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const keyword = readMarketKeywords(market).find((item) => routeSlugMatches(item.slug, slug));
  const path = marketContentPath(market, "keywords", slug);
  const variants = marketContentHreflangVariants(enabledMarkets(), "keywords", slug);
  const currentVariant = variants.find((variant) => variant.market === market.market && variant.language === market.language) ?? {
    market: market.market,
    language: market.language,
    path,
    hreflang: hreflangKeyForMarket(market),
    exists: Boolean(keyword),
    indexable: true
  };
  return marketResearchMetadata({
    title: keyword ? `${keyword.keyword} | ${market.country} Keyword` : `${market.country} Keyword`,
    description: keyword ? `${keyword.intent} keyword candidate for ${market.country}.` : `Market keyword page for ${market.country}.`,
    canonical: canonicalForMarketPath(path),
    hreflangMap: buildExistingMarketContentHreflangMap(variants, currentVariant)
  });
}

export default async function MarketKeywordPage({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }
  const keyword = readMarketKeywords(market).find((item) => routeSlugMatches(item.slug, slug));
  if (!keyword) {
    notFound();
  }
  const { labels } = labelsForLanguage(market.language);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">{market.country} {labels.keywordResearch}</p>
        <h1 className="mt-3 text-4xl font-semibold">{keyword.keyword}</h1>
        <dl className="mt-6 grid gap-3 rounded-md border border-neutral-200 bg-white p-4 md:grid-cols-3">
          <div><dt className="text-xs uppercase text-neutral-500">{labels.intent}</dt><dd className="text-xl font-semibold">{keyword.intent}</dd></div>
          <div><dt className="text-xs uppercase text-neutral-500">{labels.serpStatus}</dt><dd className="text-xl font-semibold">{keyword.status}</dd></div>
          <div><dt className="text-xs uppercase text-neutral-500">{labels.priorityScore}</dt><dd className="text-xl font-semibold">{keyword.score.toFixed(1)}</dd></div>
        </dl>
        <section className="mt-6 rounded-md border border-neutral-200 bg-white p-4">
          <h2 className="text-lg font-semibold">{labels.researchStatus}</h2>
          <p className="mt-2 text-neutral-700">{labels.contentDepthNote}</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
