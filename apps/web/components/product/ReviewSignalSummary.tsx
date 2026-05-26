import type { Locale, ReviewSignal } from "@global-import-lab/types";

export function ReviewSignalSummary({ signals, locale }: { signals: ReviewSignal[]; locale: Locale }) {
  const visible = signals.filter((signal) => signal.locale === locale || signal.locale === "en");
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Review signal summary</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {visible.map((signal) => (
          <div className="rounded-md border border-neutral-200 p-3" key={signal.id}>
            <p className="font-medium">{signal.topic}</p>
            <p className="mt-1 text-sm text-neutral-600">
              {signal.sentiment} signal, {signal.count} mentions, {Math.round(signal.confidence * 100)}% confidence
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
