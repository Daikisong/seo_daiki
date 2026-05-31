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
import { marketContentHreflangVariants, readMarketBriefs } from "@/lib/market/market-data";
import { routeSlugMatches } from "@/lib/market/route-slugs";
import { labelsForLanguage } from "@/lib/market/ui-labels";
import { marketResearchMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ locale: string; language: string; slug: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().flatMap((market) =>
    readMarketBriefs(market).map((brief) => ({ locale: market.market, language: market.language, slug: brief.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const brief = readMarketBriefs(market).find((item) => routeSlugMatches(item.slug, slug));
  const path = marketContentPath(market, "briefs", slug);
  const variants = marketContentHreflangVariants(enabledMarkets(), "briefs", slug);
  const currentVariant = variants.find((variant) => variant.market === market.market && variant.language === market.language) ?? {
    market: market.market,
    language: market.language,
    path,
    hreflang: hreflangKeyForMarket(market),
    exists: Boolean(brief),
    indexable: true
  };
  return marketResearchMetadata({
    title: brief ? `${brief.title} | Content Brief` : `${market.country} Content Brief`,
    description: brief?.angle ?? `Content brief for ${market.country}.`,
    canonical: canonicalForMarketPath(path),
    hreflangMap: buildExistingMarketContentHreflangMap(variants, currentVariant)
  });
}

export default async function MarketBriefPage({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }
  const brief = readMarketBriefs(market).find((item) => routeSlugMatches(item.slug, slug));
  if (!brief) {
    notFound();
  }
  const { labels } = labelsForLanguage(market.language);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">{labels.contentBrief}</p>
        <h1 className="mt-3 text-4xl font-semibold">{brief.title}</h1>
        <p className="mt-4 text-neutral-700">{brief.angle}</p>
        <ul className="mt-6 grid gap-2 rounded-md border border-neutral-200 bg-white p-4">
          {brief.sections.map((section) => <li key={section}>{section}</li>)}
        </ul>
        <p className="mt-4 text-sm text-neutral-600">
          {labels.monetizationDeferred}: {brief.monetizationDeferred ? labels.yes : labels.no}
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
