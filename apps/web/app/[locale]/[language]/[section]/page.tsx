import { notFound, redirect } from "next/navigation";
import { canonicalForMarketPath } from "@global-import-lab/seo";
import { MarketSectionPageContent } from "@/components/market/sections/MarketSectionPageContent";
import { sectionCopy } from "@/components/market/sections/market-section-copy";
import { enabledMarkets, findMarket } from "@/lib/market/config";
import { genericSectionDescription, isMarketSection, MARKET_TOPBAR_SECTIONS } from "@/lib/market/market-sections";

interface PageProps {
  params: Promise<{ locale: string; language: string; section: string }>;
  searchParams?: Promise<{ q?: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().flatMap((market) =>
    MARKET_TOPBAR_SECTIONS.map((section) => ({ locale: market.market, language: market.language, section }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: marketCode, language, section } = await params;
  const market = findMarket(marketCode, language);
  if (market && section === "buying-guide") {
    return {
      title: `Product reviews | ${market.country} ${market.language}`,
      description: "Buying guides are merged into the product reviews page.",
      alternates: { canonical: canonicalForMarketPath(`${market.pathPrefix}/reviews/`) },
      robots: { index: false, follow: true }
    };
  }
  if (!market || !isMarketSection(section)) {
    return {};
  }
  const copy = sectionCopy(market.language, section);
  const path = `${market.pathPrefix}/${section}/`;
  return {
    title: `${copy.title} | ${market.country} ${market.language}`,
    description: copy.description || genericSectionDescription(market.language, copy.title, market.country),
    alternates: { canonical: canonicalForMarketPath(path) },
    robots: { index: false, follow: true }
  };
}

export default async function MarketSectionPage({ params, searchParams }: PageProps) {
  const { locale: marketCode, language, section } = await params;
  const market = findMarket(marketCode, language);
  if (market && section === "buying-guide") {
    redirect(`${market.pathPrefix}/reviews/`);
  }
  if (!market || !isMarketSection(section)) {
    notFound();
  }

  return <MarketSectionPageContent market={market} query={((await searchParams)?.q ?? "").trim()} section={section} />;
}
