import { notFound } from "next/navigation";
import { buildMarketContentHreflangMap, canonicalForMarketPath, marketContentPath } from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { enabledMarkets, findMarket } from "@/lib/market/config";
import { marketsWithContentSlug, readMarketSerp } from "@/lib/market/market-data";

interface PageProps {
  params: Promise<{ market: string; language: string; slug: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().flatMap((market) =>
    readMarketSerp(market).map((item) => ({ market: market.market, language: market.language, slug: item.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { market: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const item = readMarketSerp(market).find((row) => row.slug === slug);
  const path = marketContentPath(market, "serp", slug);
  return {
    title: item ? `${item.keyword} | SERP Opportunity` : `${market.country} SERP Opportunity`,
    description: item?.recommendedAngle ?? `SERP opportunity page for ${market.country}.`,
    alternates: {
      canonical: canonicalForMarketPath(path),
      languages: buildMarketContentHreflangMap(marketsWithContentSlug(enabledMarkets(), "serp", slug), market, "serp", slug)
    }
  };
}

export default async function MarketSerpPage({ params }: PageProps) {
  const { market: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }
  const item = readMarketSerp(market).find((row) => row.slug === slug);
  if (!item) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">SERP opportunity</p>
        <h1 className="mt-3 text-4xl font-semibold">{item.keyword}</h1>
        <p className="mt-4 text-neutral-700">{item.recommendedAngle}</p>
        <dl className="mt-6 rounded-md border border-neutral-200 bg-white p-4">
          <dt className="text-xs uppercase text-neutral-500">Dominant intent</dt>
          <dd className="text-lg font-semibold">{item.dominantIntent}</dd>
          <dt className="mt-4 text-xs uppercase text-neutral-500">Opportunity score</dt>
          <dd className="text-lg font-semibold">{item.opportunityScore.toFixed(1)}</dd>
        </dl>
      </main>
      <SiteFooter />
    </>
  );
}
