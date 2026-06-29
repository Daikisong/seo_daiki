import Link from "next/link";

export function SiteFooter(_: { language?: string } = {}) {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-7 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Trend Picks - Jacob.</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="focus-ring rounded-sm hover:text-[#064fc4]" href="/">
            Home
          </Link>
          <Link className="focus-ring rounded-sm hover:text-[#064fc4]" href="/?category=trend#latest-posts">
            Trending Now
          </Link>
        </nav>
      </div>
    </footer>
  );
}
