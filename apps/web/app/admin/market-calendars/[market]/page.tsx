import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { enabledMarkets } from "@/lib/market/config";
import { readMarketCalendar } from "@/lib/market/market-data";

interface PageProps {
  params: Promise<{ market: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().map((market) => ({ market: market.market }));
}

export default async function AdminMarketCalendarDetailPage({ params }: PageProps) {
  const { market: marketCode } = await params;
  const market = enabledMarkets().find((item) => item.market === marketCode);
  if (!market) {
    notFound();
  }
  const calendar = readMarketCalendar(market);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">Market calendar</p>
        <h1 className="mt-3 text-3xl font-semibold">{market.country} / {market.language}</h1>
        {!calendar ? (
          <p className="mt-6 text-neutral-700">No calendar yet. Run pnpm calendar:build.</p>
        ) : (
          <div className="mt-6 grid gap-3">
            {Array.isArray((calendar as { slots?: unknown }).slots) ? (
              ((calendar as { slots: Array<Record<string, unknown>> }).slots).map((slot) => (
                <div className="rounded-md border border-neutral-200 bg-white p-4" key={String(slot.id)}>
                  <p className="font-semibold">{String(slot.date)} priority {String(slot.priority)}</p>
                  <p className="mt-1 text-sm text-neutral-600">{String(slot.reason)}</p>
                </div>
              ))
            ) : (
              <p className="text-neutral-700">Calendar has no slots yet.</p>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
