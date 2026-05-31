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
import { marketContentHreflangVariants, readMarketTrends } from "@/lib/market/market-data";
import { labelsForLanguage } from "@/lib/market/ui-labels";
import { marketResearchMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ market: string; language: string; slug: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().flatMap((market) =>
    readMarketTrends(market).map((trend) => ({ market: market.market, language: market.language, slug: trend.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { market: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const trend = readMarketTrends(market).find((item) => item.slug === slug);
  const path = marketContentPath(market, "trends", slug);
  const variants = marketContentHreflangVariants(enabledMarkets(), "trends", slug);
  const currentVariant = variants.find((variant) => variant.market === market.market && variant.language === market.language) ?? {
    market: market.market,
    language: market.language,
    path,
    hreflang: hreflangKeyForMarket(market),
    exists: Boolean(trend),
    indexable: true
  };
  return marketResearchMetadata({
    title: trend ? `${trend.title} | ${market.country} Trend` : `${market.country} Trend`,
    description: trend?.summary ?? `Market-specific trend page for ${market.country}.`,
    canonical: canonicalForMarketPath(path),
    hreflangMap: buildExistingMarketContentHreflangMap(variants, currentVariant)
  });
}

export default async function MarketTrendPage({ params }: PageProps) {
  const { market: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }
  const trend = readMarketTrends(market).find((item) => item.slug === slug);
  if (!trend) {
    notFound();
  }
  const { labels } = labelsForLanguage(market.language);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">{market.country} {labels.trendResearch}</p>
        <h1 className="mt-3 text-4xl font-semibold">{trend.title}</h1>
        <p className="mt-4 text-neutral-700">{trend.summary}</p>
        <dl className="mt-8 grid gap-3 rounded-md border border-neutral-200 bg-white p-4 md:grid-cols-3">
          <div><dt className="text-xs uppercase text-neutral-500">{labels.score}</dt><dd className="text-xl font-semibold">{trend.score.toFixed(1)}</dd></div>
          <div><dt className="text-xs uppercase text-neutral-500">{labels.category}</dt><dd className="text-xl font-semibold">{trend.category}</dd></div>
          <div><dt className="text-xs uppercase text-neutral-500">{labels.status}</dt><dd className="text-xl font-semibold">{trend.status}</dd></div>
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
