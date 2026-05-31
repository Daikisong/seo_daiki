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
import { marketContentHreflangVariants, readMarketSerp } from "@/lib/market/market-data";
import { labelsForLanguage } from "@/lib/market/ui-labels";
import { marketResearchMetadata } from "@/lib/seo/metadata";

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
  const variants = marketContentHreflangVariants(enabledMarkets(), "serp", slug);
  const currentVariant = variants.find((variant) => variant.market === market.market && variant.language === market.language) ?? {
    market: market.market,
    language: market.language,
    path,
    hreflang: hreflangKeyForMarket(market),
    exists: Boolean(item),
    indexable: true
  };
  return marketResearchMetadata({
    title: item ? `${item.keyword} | SERP Opportunity` : `${market.country} SERP Opportunity`,
    description: item?.recommendedAngle ?? `SERP opportunity page for ${market.country}.`,
    canonical: canonicalForMarketPath(path),
    hreflangMap: buildExistingMarketContentHreflangMap(variants, currentVariant)
  });
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
  const { labels } = labelsForLanguage(market.language);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">{labels.serpResearch}</p>
        <h1 className="mt-3 text-4xl font-semibold">{item.keyword}</h1>
        <p className="mt-4 text-neutral-700">{item.recommendedAngle}</p>
        <dl className="mt-6 rounded-md border border-neutral-200 bg-white p-4">
          <dt className="text-xs uppercase text-neutral-500">{labels.dominantIntent}</dt>
          <dd className="text-lg font-semibold">{item.dominantIntent}</dd>
          <dt className="mt-4 text-xs uppercase text-neutral-500">{labels.opportunityScore}</dt>
          <dd className="text-lg font-semibold">{item.opportunityScore.toFixed(1)}</dd>
        </dl>
        {item.patterns.length > 0 ? (
          <section className="mt-6 rounded-md border border-neutral-200 bg-white p-4">
            <h2 className="text-lg font-semibold">{labels.topPatterns}</h2>
            <ul className="mt-3 grid gap-2">
              {item.patterns.map((pattern) => (
                <li key={pattern}>{pattern}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
