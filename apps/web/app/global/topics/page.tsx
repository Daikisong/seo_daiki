import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { readGlobalTrendMap } from "@/lib/market/market-data";

export default function GlobalTopicsPage() {
  const report = readGlobalTrendMap();
  const clusters = Array.isArray(report.clusters) ? report.clusters as Array<Record<string, unknown>> : [];
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">Global topics</p>
        <h1 className="mt-3 text-4xl font-semibold">Topic inventory</h1>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {clusters.map((cluster) => (
            <Link
              className="rounded-md border border-neutral-200 bg-white p-4 hover:border-teal-700"
              href={`/${String(cluster.market)}/${String(cluster.language)}/trends/${String(cluster.slug)}/`}
              key={String(cluster.id)}
            >
              <span className="block font-semibold">{String(cluster.canonicalTopic)}</span>
              <span className="block text-sm text-neutral-600">{String(cluster.category)} / {String(cluster.status)}</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
