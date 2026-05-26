import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getAllArticles, getAllEvidencePacks, getAllProducts } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

const adminSections = [
  "products",
  "articles",
  "evidence",
  "quality",
  "search-console",
  "audit",
  "merchants",
  "offers",
  "placements",
  "offer-matching"
];

export default async function AdminPage() {
  const [articles, evidencePacks, products] = await Promise.all([
    getAllArticles(),
    getAllEvidencePacks(),
    getAllProducts()
  ]);
  const indexable = articles.filter((article) => article.indexStatus === "index").length;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-semibold">Operations dashboard</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Metric label="Products" value={products.length} />
          <Metric label="Articles" value={articles.length} />
          <Metric label="Indexable" value={indexable} />
          <Metric label="Evidence packs" value={evidencePacks.length} />
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {adminSections.map((section) => (
            <Link
              className="focus-ring rounded-md border border-neutral-200 bg-white p-4 hover:border-teal-700"
              href={`/admin/${section}/`}
              key={section}
            >
              <span className="font-semibold">{section}</span>
              <span className="mt-1 block text-sm text-neutral-600">Inspect quality, evidence, and indexing state.</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </div>
  );
}
