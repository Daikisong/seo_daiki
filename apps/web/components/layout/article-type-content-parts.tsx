import type { Article } from "@global-import-lab/types";
import { EvidenceList } from "@/components/product/EvidenceList";
import { UpdateLog } from "@/components/seo/UpdateLog";

export function ArticleEvidenceFooter({ article, includeUpdateLog = true }: { article: Article; includeUpdateLog?: boolean }) {
  return (
    <>
      <EvidenceList evidenceIds={article.evidenceIds} />
      {includeUpdateLog ? <UpdateLog lastUpdated={article.lastUpdated} /> : null}
    </>
  );
}

export function SectionGrid({ article }: { article: Article }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {article.sections.map((section) => (
        <div className="rounded-md border border-neutral-200 bg-white p-4" key={section.heading}>
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          <p className="mt-2 text-sm text-neutral-700">{section.body}</p>
        </div>
      ))}
    </section>
  );
}

export function TrendSignalCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <TrendSignalCard label="Why it is rising" value="Growth, freshness, and repeated search-demand signals." />
      <TrendSignalCard label="Buyer problem" value="Separate useful demand from seller-led hype before drafting." />
      <TrendSignalCard label="Publishing rule" value="Keep noindex until evidence, links, and compliance gates pass." />
    </section>
  );
}

export function HealthContentNotice() {
  return (
    <section className="rounded-md border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
      <h2 className="text-base font-semibold">Health content notice</h2>
      <p className="mt-2">
        This page is informational only, not medical advice. Readers should consult a qualified healthcare professional
        before using supplements, especially during pregnancy, medication use, or chronic conditions.
      </p>
    </section>
  );
}

function TrendSignalCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase text-teal-700">{label}</p>
      <p className="mt-2 text-sm text-neutral-700">{value}</p>
    </div>
  );
}
