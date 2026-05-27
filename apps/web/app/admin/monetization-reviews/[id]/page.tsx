import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  candidateIdsText,
  monetizationReviewStatuses,
  reviewStatusSummary,
  type MonetizationReviewPayload
} from "@/lib/admin/admin-monetization-review-model";
import { readJsonFile } from "@/lib/server/json-file";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminMonetizationReviewDetailPage({ params }: PageProps) {
  const { id } = await params;
  const payload = readJsonFile<MonetizationReviewPayload>("data/exports/monetization_reviews.json", { reviews: [] });
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
            <dd className="text-neutral-700">{reviewStatusSummary(review)}</dd>
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
        <form action="/api/admin/monetization-review" className="mt-6 grid gap-4 rounded-md border border-neutral-200 bg-white p-4" method="post">
          <input name="id" type="hidden" value={review.id} />
          <input name="returnTo" type="hidden" value={`/admin/monetization-reviews/${review.id}/`} />
          <label className="text-sm">
            <span className="block font-semibold">Admin token</span>
            <input className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="adminToken" type="password" />
          </label>
          <label className="text-sm">
            <span className="block font-semibold">Review status</span>
            <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={review.status ?? "pending_human_review"} name="status">
              {monetizationReviewStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block font-semibold">Approved candidate ids</span>
            <textarea className="mt-1 min-h-24 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={candidateIdsText(review.approvedCandidateIdsJson)} name="approvedCandidateIds" />
          </label>
          <label className="text-sm">
            <span className="block font-semibold">Rejected candidate ids</span>
            <textarea className="mt-1 min-h-24 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={candidateIdsText(review.rejectedCandidateIdsJson)} name="rejectedCandidateIds" />
          </label>
          <label className="text-sm">
            <span className="block font-semibold">Reviewer notes</span>
            <textarea className="mt-1 min-h-28 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={review.reviewerNotes ?? ""} name="reviewerNotes" />
          </label>
          <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
            Save review decision
          </button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
