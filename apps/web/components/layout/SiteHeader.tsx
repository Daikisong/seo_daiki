"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  trendContentUnitPlural,
  trendSiteName,
  type TrendCategory,
} from "@/lib/trend-site/categories";

const utilityNavItems = [
  { label: "Newsletter", href: "/#newsletter" },
  { label: "About TrendBrief", href: "/about-me/" },
  { label: "Method", href: "/methodology/" },
];

export function SiteHeader({
  currentHref,
  locale: _locale,
  navCategories = [],
  searchQuery = "",
}: {
  locale?: string;
  currentHref?: string;
  navCategories?: readonly TrendCategory[];
  searchQuery?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const categoryNavItems = navCategories.map((category) => ({
    label: categoryNavLabel(category.label),
    href: category.href,
  }));
  const primaryNavItems = [
    { label: "Home", href: "/" },
    { label: "Trends", href: "/#latest-briefs" },
    { label: "What to buy", href: "/#what-to-buy" },
    { label: "Buying Guides", href: "/methodology/" },
    ...categoryNavItems,
    { label: "Editors", href: "/authors/trendbrief-editors/" },
  ];
  const mobileNavItems = [...primaryNavItems, ...utilityNavItems];

  return (
    <header className="bg-white">
      <div className="w-full px-5 pb-5 pt-5 xl:hidden">
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
          <div className="flex min-h-[118px] items-center justify-center">
            <LogoMark />
          </div>
          <HeaderSearch id="mobile-header-search" searchQuery={searchQuery} />
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
            {mobileNavItems.map((item) => (
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
      <div className="hidden xl:block">
        <div className="mx-auto grid max-w-[1170px] grid-cols-[250px_minmax(280px,1fr)_320px] items-center gap-8 px-10 py-3">
          <div className="justify-self-start">
            <LogoMark />
          </div>
          <HeaderSearch id="desktop-header-search" searchQuery={searchQuery} />
          <nav
            aria-label="Utility navigation"
            className="flex justify-end gap-4 text-sm font-bold text-[#2f343b]"
          >
            {utilityNavItems.map((item) => (
              <Link
                className={`focus-ring rounded-sm hover:text-[#2f7cd3] ${
                  isActiveNavItem(item.href, currentHref)
                    ? "text-[#2f7cd3]"
                    : ""
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <nav
        aria-label="Primary navigation"
        className="mx-auto hidden max-w-[1170px] bg-[#5d84b4] px-6 text-white xl:block"
      >
        <div className="flex flex-wrap justify-center">
          {primaryNavItems.map((item) => (
            <DesktopNavLink
              currentHref={currentHref}
              href={item.href}
              key={item.href}
              label={item.label}
            />
          ))}
        </div>
      </nav>
    </header>
  );
}

function DesktopNavLink({
  currentHref,
  href,
  label,
}: {
  currentHref?: string;
  href: string;
  label: string;
}) {
  return (
    <Link
      className={`focus-ring block px-3 py-3 text-[15px] leading-6 hover:bg-[#7899c0] ${
        isActiveNavItem(href, currentHref ?? "/") ? "bg-[#7899c0]" : ""
      }`}
      href={href}
    >
      {label}
    </Link>
  );
}

function isActiveNavItem(href: string, currentHref: string | undefined) {
  if (!currentHref) {
    return false;
  }
  return href === currentHref;
}

function HeaderSearch({
  id,
  searchQuery,
}: {
  id: string;
  searchQuery: string;
}) {
  return (
    <form action="/" className="mt-4 flex xl:mt-0" role="search">
      <label className="sr-only" htmlFor={id}>
        Search {trendContentUnitPlural.toLowerCase()}
      </label>
      <input
        className="h-10 min-w-0 flex-1 rounded-[3px] border border-[#c5c8cc] px-3 pr-11 text-[16px] text-neutral-950 outline-none focus:border-[#7d9bc0]"
        defaultValue={searchQuery}
        id={id}
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
      aria-label={trendSiteName}
      className="focus-ring inline-flex rounded-sm"
      href="/"
    >
      <Image
        alt={trendSiteName}
        className="h-[118px] w-auto object-contain sm:h-[132px] xl:h-[72px]"
        height={285}
        priority
        src="/brand/trendbrief-logo-main.png"
        width={1010}
      />
    </Link>
  );
}

function categoryNavLabel(label: string) {
  if (label === "Home Briefs") {
    return "Home & Climate";
  }
  return label;
}
