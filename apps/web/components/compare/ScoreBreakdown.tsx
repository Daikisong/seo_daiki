export function ScoreBreakdown({ score }: { score: number }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Quality score</h2>
      <p className="mt-2 text-3xl font-semibold text-teal-800">{score}/100</p>
      <p className="mt-1 text-sm text-neutral-600">Indexing is allowed only after the evidence and link gates pass.</p>
    </section>
  );
}
