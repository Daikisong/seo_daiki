import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function GlobalMethodologyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">Methodology</p>
        <h1 className="mt-3 text-4xl font-semibold">Trend-to-content methodology</h1>
        <div className="mt-6 grid gap-4 text-neutral-700">
          <p>
            Each market keeps its own trend queue. Google Trends-like signals are treated as relative and sampled, not
            absolute search volume.
          </p>
          <p>
            SERP intelligence uses manual CSV or approved providers. The system stores URLs, titles, snippets, headings,
            and summaries, not full competitor article bodies.
          </p>
          <p>
            Test posts are created without affiliate links. Product candidates and monetized placement drafts require
            human review before any link can be added.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
