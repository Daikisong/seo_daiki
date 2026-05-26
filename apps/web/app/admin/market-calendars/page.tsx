import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { enabledMarkets } from "@/lib/market/config";
import { readMarketCalendar } from "@/lib/market/market-data";

export default function AdminMarketCalendarsPage() {
  const markets = enabledMarkets();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">Admin</p>
        <h1 className="mt-3 text-3xl font-semibold">Market calendars</h1>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {markets.map((market) => {
            const calendar = readMarketCalendar(market);
            return (
              <Link className="rounded-md border border-neutral-200 bg-white p-4 hover:border-teal-700" href={`/admin/market-calendars/${market.market}/`} key={`${market.market}-${market.language}`}>
                <span className="block font-semibold">{market.country} / {market.language}</span>
                <span className="mt-1 block text-sm text-neutral-600">
                  {calendar ? "Calendar generated" : "Run calendar:build-all"}
                </span>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
