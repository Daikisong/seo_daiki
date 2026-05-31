import { notFound } from "next/navigation";
import { buildMarketSectionHreflangMap, canonicalForMarketPath, marketSectionPath } from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { enabledMarkets, findMarket } from "@/lib/market/config";
import { readMarketCalendar } from "@/lib/market/market-data";
import { labelsForLanguage } from "@/lib/market/ui-labels";
import { marketResearchMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ market: string; language: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().map((market) => ({ market: market.market, language: market.language }));
}

export async function generateMetadata({ params }: PageProps) {
  const { market: marketCode, language } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const { labels } = labelsForLanguage(market.language);
  const path = marketSectionPath(market, "calendar");
  return marketResearchMetadata({
    title: `${market.country} ${labels.editorialCalendar}`,
    description: labels.calendarDescription,
    canonical: canonicalForMarketPath(path),
    hreflangMap: buildMarketSectionHreflangMap(enabledMarkets(), market, "calendar")
  });
}

export default async function MarketCalendarPage({ params }: PageProps) {
  const { market: marketCode, language } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }
  const calendar = readMarketCalendar(market);
  const slots = Array.isArray((calendar as Record<string, unknown> | undefined)?.slots)
    ? ((calendar as Record<string, unknown>).slots as Array<Record<string, unknown>>)
    : [];
  const { labels } = labelsForLanguage(market.language);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">{market.country} {labels.calendar}</p>
        <h1 className="mt-3 text-4xl font-semibold">{labels.editorialCalendar}</h1>
        <p className="mt-4 text-neutral-700">{labels.calendarDescription}</p>
        {slots.length === 0 ? (
          <p className="mt-4 text-neutral-700">{labels.calendarEmpty}</p>
        ) : (
          <div className="mt-8 grid gap-3">
            {slots.map((slot) => (
              <div className="rounded-md border border-neutral-200 bg-white p-4" key={String(slot.id)}>
                <p className="font-semibold">{String(slot.date)}: {String(slot.reason)}</p>
                <p className="text-sm text-neutral-600">
                  {labels.status} {String(slot.status)} / {labels.priorityScore} {String(slot.priority)}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
