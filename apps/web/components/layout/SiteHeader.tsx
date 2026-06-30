"use client";

import Link from "next/link";
import { Menu, Search, UserCircle, X } from "lucide-react";
import { useState } from "react";
import { trendSiteName, type TrendCategory } from "@/lib/trend-site/categories";

const utilityNavItems = [
  { label: "Latest Brief", href: "/#latest-briefs" },
  { label: "About TrendBrief", href: "/about-me/" },
  { label: "Method", href: "/methodology/" },
  { label: "Contact", href: "/contact/" },
];

const trendStripItems = [
  { label: "Europe heatwave cooling", href: "/#latest-briefs" },
  { label: "Marketplace risk notes", href: "/#what-to-buy" },
  { label: "Variant and return checks", href: "/#what-to-buy" },
  { label: "Review complaint patterns", href: "/methodology/" },
];

export function SiteHeader({
  currentHref,
  locale: _locale,
  navCategories = [],
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
    ...categoryNavItems,
  ];
  const mobileNavItems = [...primaryNavItems, ...utilityNavItems];

  return (
    <header className="bg-white text-[#061936]">
      <div className="flex h-[82px] items-center justify-between border-b border-neutral-200 px-4 lg:hidden">
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-controls="site-mobile-menu"
          aria-expanded={menuOpen}
          className="focus-ring inline-flex h-10 w-10 items-center justify-center"
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          {menuOpen ? (
            <X aria-hidden size={23} />
          ) : (
            <Menu aria-hidden size={25} />
          )}
        </button>
        <LogoMark mobile />
        <div className="flex items-center gap-3 text-[#061936]">
          <Link
            className="text-xs font-black uppercase tracking-[0.08em]"
            href="/methodology/"
          >
            Method
          </Link>
          <Link aria-label="About TrendBrief" href="/about-me/">
            <UserCircle aria-hidden size={22} />
          </Link>
          <Link aria-label="Search TrendBrief" href="/">
            <Search aria-hidden size={25} />
          </Link>
        </div>
      </div>

      <div className="hidden border-b border-neutral-200 lg:block">
        <div className="mx-auto flex h-9 max-w-[1170px] items-center justify-between border-b border-neutral-100 px-10 text-[11px] font-black uppercase tracking-[0.14em] text-[#5a6470]">
          <span>TrendBrief by Jacob</span>
          <nav aria-label="Utility navigation" className="flex items-center gap-5">
            {utilityNavItems.map((item) => (
              <Link
                className="hover:text-[#d80057]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="relative mx-auto flex h-[104px] max-w-[1170px] items-center justify-center px-10">
          <LogoMark />
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <HeaderSearchLink />
          </div>
        </div>
      </div>

      <nav
        aria-label="Primary navigation"
        className="hidden border-b border-[#9aa9bc] bg-[#061936] lg:block"
      >
        <div className="mx-auto flex max-w-[1170px] flex-wrap items-center justify-center gap-x-5 gap-y-0 px-6 py-[13px]">
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

      <nav
        aria-hidden={!menuOpen}
        aria-label="Mobile navigation"
        className={`overflow-hidden border-b border-neutral-200 bg-white transition-[max-height,opacity] duration-300 ease-out lg:hidden ${
          menuOpen ? "max-h-[720px] opacity-100" : "max-h-0 opacity-0"
        }`}
        id="site-mobile-menu"
      >
        {mobileNavItems.map((item) => (
          <Link
            className={`block border-t border-neutral-200 px-5 py-4 text-sm font-black uppercase tracking-[0.08em] ${
              isActiveNavItem(item.href, currentHref)
                ? "text-[#d80057]"
                : "text-[#061936]"
            }`}
            href={item.href}
            key={item.href}
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? undefined : -1}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-[1170px] items-center justify-between gap-8 overflow-x-auto px-5 py-5 text-sm lg:px-10">
          <span className="shrink-0 font-black uppercase text-[#d80057]">
            Now tracking
          </span>
          {trendStripItems.map((item) => (
            <Link
              className="shrink-0 text-black underline decoration-neutral-500 decoration-1 underline-offset-2 hover:text-[#d80057]"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function HeaderSearchLink() {
  return (
    <Link
      aria-label="Search TrendBrief"
      className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-[#061936] hover:border-[#d80057] hover:text-[#d80057]"
      href="/"
    >
      <Search aria-hidden size={25} strokeWidth={2.5} />
    </Link>
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
      className={`focus-ring whitespace-nowrap text-[13px] font-black uppercase tracking-[0.12em] hover:text-[#9ec5ff] ${
        isActiveNavItem(href, currentHref ?? "/")
          ? "text-[#9ec5ff]"
          : "text-white"
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

function LogoMark({ mobile = false }: { mobile?: boolean }) {
  return (
    <Link
      aria-label={trendSiteName}
      className="focus-ring inline-flex flex-col items-center rounded-sm text-[#061936]"
      href="/"
    >
      <span
        className={`font-serif font-semibold leading-none tracking-[-0.075em] ${
          mobile ? "text-[30px] sm:text-[34px]" : "text-[58px] xl:text-[72px]"
        }`}
      >
        {trendSiteName}
      </span>
      <span
        className={`mt-1 font-black uppercase leading-none tracking-[0.18em] ${
          mobile ? "text-[6px] sm:text-[7px]" : "text-[9px] xl:text-[10px]"
        }`}
      >
        Buyer notes for fast-moving trends
      </span>
    </Link>
  );
}

function categoryNavLabel(label: string) {
  return label;
}
