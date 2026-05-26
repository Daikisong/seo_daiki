import { notFound } from "next/navigation";
import { buildMarketContentHreflangMap, canonicalForMarketPath, marketContentPath } from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { enabledMarkets, findMarket } from "@/lib/market/config";
import { readMarketTrends } from "@/lib/market/market-data";

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
  return {
    title: trend ? `${trend.title} | ${market.country} Trend` : `${market.country} Trend`,
    description: trend?.summary ?? `Market-specific trend page for ${market.country}.`,
    alternates: {
      canonical: canonicalForMarketPath(path),
      languages: buildMarketContentHreflangMap(enabledMarkets(), market, "trends", slug)
    }
  };
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

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">{market.country} trend</p>
        <h1 className="mt-3 text-4xl font-semibold">{trend.title}</h1>
        <p className="mt-4 text-neutral-700">{trend.summary}</p>
        <dl className="mt-8 grid gap-3 rounded-md border border-neutral-200 bg-white p-4 md:grid-cols-3">
          <div><dt className="text-xs uppercase text-neutral-500">Score</dt><dd className="text-xl font-semibold">{trend.score.toFixed(1)}</dd></div>
          <div><dt className="text-xs uppercase text-neutral-500">Category</dt><dd className="text-xl font-semibold">{trend.category}</dd></div>
          <div><dt className="text-xs uppercase text-neutral-500">Status</dt><dd className="text-xl font-semibold">{trend.status}</dd></div>
        </dl>
      </main>
      <SiteFooter />
    </>
  );
}
