import { notFound } from "next/navigation";
import { buildMarketContentHreflangMap, canonicalForMarketPath, marketContentPath } from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { enabledMarkets, findMarket } from "@/lib/market/config";
import { readMarketBriefs } from "@/lib/market/market-data";

interface PageProps {
  params: Promise<{ market: string; language: string; slug: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().flatMap((market) =>
    readMarketBriefs(market).map((brief) => ({ market: market.market, language: market.language, slug: brief.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { market: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const brief = readMarketBriefs(market).find((item) => item.slug === slug);
  const path = marketContentPath(market, "briefs", slug);
  return {
    title: brief ? `${brief.title} | Content Brief` : `${market.country} Content Brief`,
    description: brief?.angle ?? `Content brief for ${market.country}.`,
    alternates: {
      canonical: canonicalForMarketPath(path),
      languages: buildMarketContentHreflangMap(enabledMarkets(), market, "briefs", slug)
    }
  };
}

export default async function MarketBriefPage({ params }: PageProps) {
  const { market: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }
  const brief = readMarketBriefs(market).find((item) => item.slug === slug);
  if (!brief) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">Content brief</p>
        <h1 className="mt-3 text-4xl font-semibold">{brief.title}</h1>
        <p className="mt-4 text-neutral-700">{brief.angle}</p>
        <ul className="mt-6 grid gap-2 rounded-md border border-neutral-200 bg-white p-4">
          {brief.sections.map((section) => <li key={section}>{section}</li>)}
        </ul>
        <p className="mt-4 text-sm text-neutral-600">Monetization deferred: {brief.monetizationDeferred ? "yes" : "no"}</p>
      </main>
      <SiteFooter />
    </>
  );
}
