import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { readGlobalTrendMap } from "@/lib/market/market-data";

export default function GlobalTrendMapPage() {
  const report = readGlobalTrendMap();
  const clusters = Array.isArray(report.clusters) ? report.clusters as Array<Record<string, unknown>> : [];
  const patterns = Array.isArray(report.crossMarketPatterns) ? report.crossMarketPatterns as Array<Record<string, unknown>> : [];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">Global trend map</p>
        <h1 className="mt-3 text-4xl font-semibold">Cross-market patterns</h1>
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {patterns.map((pattern) => (
            <div className="rounded-md border border-neutral-200 bg-white p-4" key={String(pattern.topic)}>
              <h2 className="font-semibold">{String(pattern.topic)}</h2>
              <p className="mt-2 text-sm text-neutral-700">{String(pattern.classification)} / {String(pattern.reason)}</p>
            </div>
          ))}
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Market clusters</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {clusters.slice(0, 24).map((cluster) => (
              <Link
                className="rounded-md border border-neutral-200 bg-white p-4 hover:border-teal-700"
                href={`/${String(cluster.market)}/${String(cluster.language)}/trends/${String(cluster.slug)}/`}
                key={String(cluster.id)}
              >
                <span className="block font-semibold">{String(cluster.canonicalTopic)}</span>
                <span className="text-sm text-neutral-600">{String(cluster.market)} / {String(cluster.language)} / {String(cluster.score)}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
