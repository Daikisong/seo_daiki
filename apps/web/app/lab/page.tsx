import Link from "next/link";
import { articlePath } from "@global-import-lab/seo";
import { getAllArticles } from "@/lib/content/repository";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata = {
  title: "Lab Notes | Global Import Lab",
  description: "Measurement notes for import product output, thermals, SKU traps, and reusable evidence."
};

export default async function LabIndexPage() {
  const articles = (await getAllArticles())
    .filter((article) => article.type === "lab" && article.publishStatus === "published")
    .sort((left, right) => left.locale.localeCompare(right.locale) || left.title.localeCompare(right.title));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-teal-700">Measurement notes</p>
          <h1 className="mt-3 text-4xl font-semibold">Lab notes</h1>
          <p className="mt-3 text-neutral-700">
            Test-method pages and reusable evidence records before they are cited by indexed reviews.
          </p>
        </header>
        <PageGrid articles={articles} />
      </main>
      <SiteFooter />
    </>
  );
}

function PageGrid({ articles }: { articles: Awaited<ReturnType<typeof getAllArticles>> }) {
  return (
    <div className="mt-8 grid gap-3 md:grid-cols-2">
      {articles.map((article) => (
        <Link
          className="focus-ring rounded-md border border-neutral-200 bg-white p-4 hover:border-teal-700"
          href={articlePath(article)}
          key={article.id}
        >
          <span className="text-xs font-semibold uppercase text-teal-700">{article.locale}</span>
          <span className="mt-2 block text-lg font-semibold">{article.title}</span>
          <span className="mt-1 block text-sm text-neutral-600">{article.indexStatus}</span>
        </Link>
      ))}
    </div>
  );
}
