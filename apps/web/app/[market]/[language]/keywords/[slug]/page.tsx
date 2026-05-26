import { notFound } from "next/navigation";
import { buildMarketContentHreflangMap, canonicalForMarketPath, marketContentPath } from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { enabledMarkets, findMarket } from "@/lib/market/config";
import { readMarketKeywords } from "@/lib/market/market-data";

interface PageProps {
  params: Promise<{ market: string; language: string; slug: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().flatMap((market) =>
    readMarketKeywords(market).map((keyword) => ({ market: market.market, language: market.language, slug: keyword.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { market: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const keyword = readMarketKeywords(market).find((item) => item.slug === slug);
  const path = marketContentPath(market, "keywords", slug);
  return {
    title: keyword ? `${keyword.keyword} | ${market.country} Keyword` : `${market.country} Keyword`,
    description: keyword ? `${keyword.intent} keyword candidate for ${market.country}.` : `Market keyword page for ${market.country}.`,
    alternates: {
      canonical: canonicalForMarketPath(path),
      languages: buildMarketContentHreflangMap(enabledMarkets(), market, "keywords", slug)
    }
  };
}

export default async function MarketKeywordPage({ params }: PageProps) {
  const { market: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }
  const keyword = readMarketKeywords(market).find((item) => item.slug === slug);
  if (!keyword) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">{market.country} keyword</p>
        <h1 className="mt-3 text-4xl font-semibold">{keyword.keyword}</h1>
        <p className="mt-4 text-neutral-700">Intent: {keyword.intent}. SERP status: {keyword.status}.</p>
        <p className="mt-2 text-neutral-700">Priority score: {keyword.score.toFixed(1)}.</p>
      </main>
      <SiteFooter />
    </>
  );
}
