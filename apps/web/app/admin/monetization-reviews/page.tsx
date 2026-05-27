import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { reviewStatusSummary, type MonetizationReviewPayload } from "@/lib/admin/admin-monetization-review-model";
import { readJsonFile } from "@/lib/server/json-file";

export default function AdminMonetizationReviewsPage() {
  const payload = readJsonFile<MonetizationReviewPayload>("data/exports/monetization_reviews.json", { reviews: [] });
  const reviews = payload.reviews ?? [];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">Admin</p>
        <h1 className="mt-3 text-3xl font-semibold">Monetization reviews</h1>
        <div className="mt-6 grid gap-3">
          {reviews.length === 0 ? (
            <p className="text-neutral-700">No review file yet. Run pnpm monetization:create-review after product analysis.</p>
          ) : (
            reviews.map((review) => (
              <Link className="rounded-md border border-neutral-200 bg-white p-4 hover:border-teal-700" href={`/admin/monetization-reviews/${String(review.id)}/`} key={String(review.id)}>
                <span className="block font-semibold">{String(review.id)}</span>
                <span className="mt-1 block text-sm text-neutral-600">{reviewStatusSummary(review)}</span>
              </Link>
            ))
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
