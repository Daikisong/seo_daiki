import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function GlobalPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">Review Guide</p>
        <h1 className="mt-3 text-4xl font-semibold">Market overview</h1>
        <p className="mt-3 max-w-3xl text-neutral-700">
          Choose a country and language to see local reviews, rankings, and buying checks.
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <Link className="rounded-md border border-neutral-200 bg-white p-4 hover:border-teal-700" href="/global/trend-map/">Trend map</Link>
          <Link className="rounded-md border border-neutral-200 bg-white p-4 hover:border-teal-700" href="/global/topics/">Topics</Link>
          <Link className="rounded-md border border-neutral-200 bg-white p-4 hover:border-teal-700" href="/global/markets/">Markets</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
