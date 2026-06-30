"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  trendContentUnitPlural,
  trendSiteName,
  visibleTrendCategories,
} from "@/lib/trend-site/categories";

const navItems = [
  { label: "Home", href: "/" },
  ...visibleTrendCategories.map((category) => ({
    label: category.label,
    href: category.href,
  })),
  { label: "Method", href: "/methodology/" },
  { label: "About TrendBrief", href: "/about-me/" },
] as const;

export function SiteHeader({
  currentHref,
  locale: _locale,
  searchQuery = "",
}: {
  locale?: string;
  currentHref?: string;
  searchQuery?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="w-full px-5 pb-6 pt-6 xl:hidden">
        <div className="relative">
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-controls="site-mobile-menu"
            aria-expanded={menuOpen}
            className="focus-ring absolute right-0 top-0 z-30 flex h-12 w-12 cursor-pointer list-none flex-col items-center justify-center rounded-sm text-[#5d84b4] marker:hidden"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            <span className="block h-[3px] w-[38px] bg-current" />
            <span className="mt-[7px] block h-[3px] w-[38px] bg-current" />
            <span className="mt-[7px] block h-[3px] w-[38px] bg-current" />
          </button>
          <div className="flex min-h-[112px] items-center justify-center">
            <LogoMark />
          </div>
          <HeaderSearch searchQuery={searchQuery} />
          <nav
            aria-hidden={!menuOpen}
            aria-label="Mobile navigation"
            className={`-mx-5 overflow-hidden bg-[#5d84b4] text-white transition-[max-height,opacity,margin] duration-300 ease-out motion-reduce:transition-none ${
              menuOpen
                ? "mt-6 max-h-[560px] opacity-100"
                : "mt-0 max-h-0 opacity-0"
            }`}
            id="site-mobile-menu"
          >
            {navItems.map((item) => (
              <Link
                className={`focus-ring block border-t border-[#7899c0] px-5 py-4 text-[16px] leading-6 hover:bg-[#7899c0] ${
                  isActiveNavItem(item.href, currentHref) ? "bg-[#7899c0]" : ""
                }`}
                href={item.href}
                key={item.href}
                onClick={(event) => {
                  event.currentTarget.blur();
                  setMenuOpen(false);
                }}
                tabIndex={menuOpen ? undefined : -1}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto hidden max-w-[1170px] px-10 pb-10 pt-6 xl:block">
        <div className="flex min-h-[106px] items-center justify-start">
          <LogoMark />
        </div>
      </div>
      <nav
        aria-label="Primary navigation"
        className="mx-auto hidden max-w-[1170px] bg-[#5d84b4] px-10 text-white xl:block"
      >
        <div className="flex flex-wrap">
          {navItems.map((item) => (
            <Link
              className={`focus-ring block px-5 py-5 text-base hover:bg-[#7899c0] ${
                isActiveNavItem(item.href, currentHref ?? "/")
                  ? "bg-[#7899c0]"
                  : ""
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

function isActiveNavItem(href: string, currentHref: string | undefined) {
  if (!currentHref) {
    return false;
  }
  return href === currentHref;
}

function HeaderSearch({ searchQuery }: { searchQuery: string }) {
  return (
    <form action="/" className="mt-4 flex" role="search">
      <label className="sr-only" htmlFor="mobile-header-search">
        Search {trendContentUnitPlural.toLowerCase()}
      </label>
      <input
        className="h-10 min-w-0 flex-1 rounded-[3px] border border-[#c5c8cc] px-3 pr-11 text-[16px] text-neutral-950 outline-none focus:border-[#7d9bc0]"
        defaultValue={searchQuery}
        id="mobile-header-search"
        name="s"
        suppressHydrationWarning
        type="search"
      />
      <button
        className="focus-ring -ml-11 inline-flex h-10 w-11 items-center justify-center text-[#878b90] hover:text-[#2f7cd3]"
        type="submit"
      >
        <Search aria-hidden size={18} />
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
}

function LogoMark() {
  return (
    <Link
      className="focus-ring inline-flex min-w-0 items-center gap-2 rounded-sm min-[360px]:gap-3 sm:gap-4"
      href="/"
    >
      <span className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-full border border-[#cdd5df] bg-[#eef3f7] min-[360px]:h-[76px] min-[360px]:w-[76px] sm:h-[92px] sm:w-[92px]">
        <span className="absolute left-1/2 top-[18%] h-[28%] w-[48%] -translate-x-1/2 rounded-t-full bg-[#24384a]" />
        <span className="absolute left-1/2 top-[30%] h-[36%] w-[36%] -translate-x-1/2 rounded-full bg-[#f0c7aa]" />
        <span className="absolute bottom-[7%] left-1/2 h-[36%] w-[66%] -translate-x-1/2 rounded-t-full bg-[#7f9ebd]" />
      </span>
      <span className="whitespace-nowrap text-[22px] font-black leading-none tracking-normal text-[#103a59] min-[360px]:text-[28px] sm:text-[34px]">
        {trendSiteName}
      </span>
    </Link>
  );
}
