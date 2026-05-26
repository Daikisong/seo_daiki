import { Download } from "lucide-react";

export function DatasetDownload({ href }: { href: string }) {
  return (
    <a
      className="focus-ring inline-flex items-center gap-2 rounded-md bg-neutral-950 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
      href={href}
    >
      <Download aria-hidden size={16} />
      Download dataset
    </a>
  );
}
