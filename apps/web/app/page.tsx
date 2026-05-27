import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <section className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">Global Market Trend Desk</p>
            <h1 className="mt-3 text-5xl font-semibold leading-tight">Global Import Lab</h1>
            <p className="mt-5 max-w-2xl text-lg text-neutral-700">
              A market-silo trend research and test publishing system. Each country keeps its own trend feed, SERP
              intelligence, editorial queue, and no-link test posts before any monetization review.
            </p>
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="rounded-md border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Start with a market</h2>
            <p className="mt-2 text-sm text-neutral-700">
              One domain, separate market desks. For example, US magnesium sleep trends and Spain USB-C charger trends
              stay in different silos instead of one mixed global blog feed.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <MarketLink href="/us/en/" label="US / EN" />
              <MarketLink href="/es/es/" label="ES / ES" />
              <MarketLink href="/br/pt-br/" label="BR / PT-BR" />
              <MarketLink href="/global/trend-map/" label="Trend map" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function MarketLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className="focus-ring inline-flex rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
      href={href}
    >
      {label}
    </Link>
  );
}
