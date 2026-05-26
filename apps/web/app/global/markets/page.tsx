import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { enabledMarkets } from "@/lib/market/config";

export default function GlobalMarketsPage() {
  const markets = enabledMarkets();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">Global</p>
        <h1 className="mt-3 text-4xl font-semibold">Markets</h1>
        <p className="mt-3 max-w-3xl text-neutral-700">
          One domain, explicit market silos. Users choose a market URL; there is no IP-based auto redirect.
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {markets.map((market) => (
            <Link className="rounded-md border border-neutral-200 bg-white p-4 hover:border-teal-700" href={market.pathPrefix + "/"} key={market.pathPrefix}>
              <span className="block text-lg font-semibold">{market.country} / {market.language}</span>
              <span className="block text-sm text-neutral-600">{market.currency} / {market.timezone}</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
