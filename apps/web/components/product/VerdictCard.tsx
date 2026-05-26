import { CheckCircle2, XCircle } from "lucide-react";

interface VerdictCardProps {
  verdict: string;
  bestFor: string[];
  avoidIf: string[];
}

export function VerdictCard({ verdict, bestFor, avoidIf }: VerdictCardProps) {
  return (
    <section className="grid gap-4 rounded-md border border-neutral-200 bg-white p-5 md:grid-cols-[1.3fr_1fr_1fr]">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">Verdict</p>
        <p className="mt-2 text-xl font-semibold leading-snug">{verdict}</p>
      </div>
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 aria-hidden className="text-teal-700" size={18} />
          Best for
        </h2>
        <ul className="mt-2 space-y-1 text-sm text-neutral-700">
          {bestFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <XCircle aria-hidden className="text-red-700" size={18} />
          Avoid if
        </h2>
        <ul className="mt-2 space-y-1 text-sm text-neutral-700">
          {avoidIf.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
