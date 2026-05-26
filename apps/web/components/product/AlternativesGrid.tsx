import Link from "next/link";
import type { Product } from "@global-import-lab/types";

export interface AlternativeProductLink {
  product: Product;
  href: string;
}

export function AlternativesGrid({ alternatives }: { alternatives: AlternativeProductLink[] }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Alternatives</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {alternatives.map(({ product, href }) => (
          <Link
            className="focus-ring rounded-md border border-neutral-200 p-3 hover:border-teal-700"
            href={href}
            key={product.id}
          >
            <p className="font-medium">{product.canonicalName}</p>
            <p className="mt-1 text-sm text-neutral-600">{product.category}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
