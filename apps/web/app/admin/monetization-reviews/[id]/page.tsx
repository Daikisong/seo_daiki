import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { readJsonFile } from "@/lib/server/json-file";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminMonetizationReviewDetailPage({ params }: PageProps) {
  const { id } = await params;
  const payload = readJsonFile<{ reviews?: Array<Record<string, unknown>> }>("data/exports/monetization_reviews.json", { reviews: [] });
  const review = (payload.reviews ?? []).find((item) => item.id === id);
  if (!review) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">Human approval required</p>
        <h1 className="mt-3 text-3xl font-semibold">{String(review.id)}</h1>
        <dl className="mt-6 grid gap-3 rounded-md border border-neutral-200 bg-white p-4 text-sm">
          <div>
            <dt className="font-semibold">Status</dt>
            <dd className="text-neutral-700">{String(review.status)}</dd>
          </div>
          <div>
            <dt className="font-semibold">Article</dt>
            <dd className="text-neutral-700">{String(review.articleId)}</dd>
          </div>
          <div>
            <dt className="font-semibold">Rule</dt>
            <dd className="text-neutral-700">Links cannot be inserted until candidates and final placement are approved by a human.</dd>
          </div>
        </dl>
      </main>
      <SiteFooter />
    </>
  );
}
