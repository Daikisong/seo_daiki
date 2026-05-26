import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
      {items.map((item, index) => (
        <span className="flex items-center gap-2" key={item.href}>
          {index > 0 ? <ChevronRight aria-hidden size={14} /> : null}
          <Link className="focus-ring rounded-sm hover:text-neutral-950" href={item.href}>
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
