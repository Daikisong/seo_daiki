import Link from "next/link";
import { Search } from "lucide-react";
import type { HreflangMap, Locale } from "@global-import-lab/types";
import { LanguagePreferenceBanner } from "./LanguagePreferenceBanner";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Home Essentials", href: "/?nav=home-essentials#latest-posts" },
  { label: "Garden Essentials", href: "/?nav=garden-essentials#latest-posts" },
  { label: "Auto Essentials", href: "/?nav=auto-essentials#latest-posts" },
  { label: "Outdoor Essentials", href: "/?nav=outdoor-essentials#latest-posts" },
  { label: "Tool Essentials", href: "/?nav=tool-essentials#latest-posts" },
  { label: "Electronics Essentials", href: "/?nav=electronics-essentials#latest-posts" },
  { label: "Personal Mobility", href: "/?nav=personal-mobility#latest-posts" },
  { label: "About Me", href: "/?nav=about-me#latest-posts" }
] as const;

export function SiteHeader({
  locale,
  alternates
}: {
  locale?: Locale;
  currentHref?: string;
  alternates?: HreflangMap;
}) {
  return (
    <header className="bg-white">
      {locale ? <LanguagePreferenceBanner currentLocale={locale} alternates={alternates} /> : null}
      <div className="mx-auto max-w-[1170px] px-5 pb-8 pt-6 md:px-4 md:pt-8">
        <div className="flex items-center justify-between gap-4">
          <Link className="focus-ring inline-flex items-center gap-3 rounded-sm" href="/">
            <span className="relative h-[76px] w-[76px] overflow-hidden rounded-full border border-[#cdd5df] bg-[#eef3f7] md:h-[92px] md:w-[92px]">
              <span className="absolute left-1/2 top-4 h-7 w-9 -translate-x-1/2 rounded-t-full bg-[#24384a]" />
              <span className="absolute left-1/2 top-6 h-8 w-8 -translate-x-1/2 rounded-full bg-[#f0c7aa]" />
              <span className="absolute bottom-2 left-1/2 h-8 w-14 -translate-x-1/2 rounded-t-full bg-[#7f9ebd]" />
            </span>
            <span className="whitespace-nowrap text-[28px] font-black uppercase leading-none tracking-normal text-[#103a59] md:text-[34px]">
              Trend Picks
            </span>
          </Link>
          <details className="relative md:hidden">
            <summary className="focus-ring list-none rounded-sm p-2 text-[#5d84b4] marker:hidden">
              <span className="block h-1 w-9 bg-current" />
              <span className="mt-2 block h-1 w-9 bg-current" />
              <span className="mt-2 block h-1 w-9 bg-current" />
              <span className="sr-only">Menu</span>
            </summary>
            <div className="absolute right-0 top-12 z-20 w-56 border border-neutral-200 bg-white shadow-sm">
              {navItems.map((item) => (
                <Link className="focus-ring block px-4 py-3 text-sm text-neutral-950 hover:bg-neutral-50" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
        <form action="/" className="mt-8 flex md:hidden" role="search">
          <label className="sr-only" htmlFor="mobile-header-search">
            Search posts
          </label>
          <input
            className="min-w-0 flex-1 rounded-[4px] border border-neutral-300 px-3 py-2.5 text-sm text-neutral-950 outline-none focus:border-[#2f7cd3]"
            id="mobile-header-search"
            name="s"
            type="search"
          />
          <button
            className="focus-ring -ml-10 inline-flex w-10 items-center justify-center text-neutral-500 hover:text-[#2f7cd3]"
            type="submit"
          >
            <Search aria-hidden size={18} />
            <span className="sr-only">Search</span>
          </button>
        </form>
      </div>
      <nav aria-label="Primary navigation" className="mx-auto hidden max-w-[1170px] bg-[#5d84b4] px-10 text-white md:block">
        <div className="flex flex-wrap">
          {navItems.map((item, index) => (
            <Link
              className={`focus-ring block px-5 py-5 text-base hover:bg-[#7899c0] ${
                index === 0 ? "bg-[#7899c0]" : ""
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
