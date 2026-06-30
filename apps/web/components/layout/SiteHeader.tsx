"use client";

import Link from "next/link";
import { Mail, Menu, Search, UserCircle, X } from "lucide-react";
import { useState } from "react";
import { trendSiteName, type TrendCategory } from "@/lib/trend-site/categories";

const utilityNavItems = [
  { label: "Newsletter", href: "/#newsletter" },
  { label: "About TrendBrief", href: "/about-me/" },
  { label: "Method", href: "/methodology/" },
];

const trendStripItems = [
  { label: "Portable ACs still in stock", href: "/#latest-briefs" },
  { label: "Top-rated fans", href: "/#latest-briefs" },
  { label: "Heatwave cooling checks", href: "/#what-to-buy" },
  { label: "Buying route by country", href: "/#what-to-buy" },
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
    { label: "Browse", href: "/#latest-briefs" },
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
        <div className="flex items-center gap-3">
          <Link className="text-xs font-black text-black" href="/#newsletter">
            Subscribe
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
        <div className="relative mx-auto flex h-[118px] max-w-[1170px] items-center justify-center px-10">
          <LogoMark />
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <HeaderUtility />
          </div>
        </div>
      </div>

      <nav
        aria-label="Primary navigation"
        className="hidden border-b-[6px] border-[#d80057] lg:block"
      >
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-center gap-x-6 gap-y-0 px-6 py-4">
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
            Trending
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

function HeaderUtility() {
  return (
    <div className="flex min-w-[300px] flex-col items-end gap-3 text-xs text-black">
      <div className="flex items-center gap-2">
        <Link
          className="inline-flex max-w-[130px] items-center gap-2 leading-[15px] hover:underline"
          href="/#newsletter"
        >
          <span className="inline-flex h-[19px] w-[19px] items-center justify-center rounded-full bg-black text-white">
            <Mail aria-hidden size={12} strokeWidth={2.4} />
          </span>
          <span>Sign up to our newsletter</span>
        </Link>
        {socialLinks.map((item) => (
          <Link
            aria-label={item.label}
            className={`inline-flex h-[23px] w-[23px] items-center justify-center rounded-full text-white ${item.className}`}
            href={item.href}
            key={item.label}
          >
            <item.Icon />
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link
          className="inline-flex items-center gap-1 leading-[15px] hover:underline"
          href="/about-me/"
        >
          <span>Sign in</span>
          <UserCircle aria-hidden size={18} />
        </Link>
        <Link
          className="bg-neutral-100 px-6 py-[9px] font-bold hover:bg-neutral-200"
          href="/#newsletter"
        >
          Subscribe
        </Link>
        <Link aria-label="Search TrendBrief" href="/">
          <Search aria-hidden size={33} strokeWidth={2.8} />
        </Link>
      </div>
    </div>
  );
}

const socialLinks = [
  {
    Icon: FacebookIcon,
    className: "bg-[#244b8f]",
    href: "/",
    label: "Facebook",
  },
  {
    Icon: XIcon,
    className: "bg-black",
    href: "/",
    label: "X",
  },
  {
    Icon: InstagramIcon,
    className: "bg-[#d80057]",
    href: "/",
    label: "Instagram",
  },
  {
    Icon: PinterestIcon,
    className: "bg-[#c90032]",
    href: "/",
    label: "Pinterest",
  },
  {
    Icon: YouTubeIcon,
    className: "bg-[#d23a21]",
    href: "/",
    label: "YouTube",
  },
] as const;

function FacebookIcon() {
  return (
    <svg aria-hidden className="h-[13px] w-[13px]" viewBox="0 0 24 24">
      <path
        d="M14.8 8.2h3V4.7c-.5-.1-2.1-.2-3.8-.2-3.7 0-6.2 2.2-6.2 6.3v3.1H4v3.9h3.8V24h4.7v-6.2h3.7l.6-3.9h-4.3v-2.7c0-1.1.3-2 2.3-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg aria-hidden className="h-[12px] w-[12px]" viewBox="0 0 24 24">
      <path
        d="M14.4 10.3 22.8 0h-2l-7.3 8.9L7.7 0H1l8.8 13.1L1 24h2l7.7-9.5 6.2 9.5h6.7l-9.2-13.7Zm-2.7 3.4-.9-1.3L3.7 1.5h3l5.7 8.7.9 1.3 7.5 11.2h-3l-6.1-9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden
      className="h-[13px] w-[13px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
    >
      <rect height="17" rx="5" width="17" x="3.5" y="3.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" fill="currentColor" r="1.1" stroke="none" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg aria-hidden className="h-[13px] w-[13px]" viewBox="0 0 24 24">
      <path
        d="M12.2 0C5.6 0 2.1 4.4 2.1 9.2c0 2.2 1.2 5 3.1 5.8.3.1.5 0 .6-.3l.4-1.7c.1-.2.1-.4-.1-.7-.6-.8-1-1.8-1-3 0-3.2 2.4-6.4 6.6-6.4 3.6 0 6.1 2.5 6.1 6 0 4-2 6.8-4.7 6.8-1.5 0-2.6-1.2-2.2-2.7.4-1.8 1.2-3.7 1.2-5 0-1.2-.6-2.1-1.9-2.1-1.5 0-2.8 1.6-2.8 3.7 0 1.4.5 2.3.5 2.3l-1.9 8c-.5 2.1-.1 4.5 0 4.7.1.1.2.1.3 0 .1-.1 1.8-2.2 2.3-4.3.2-.6.8-3.1.8-3.1.7 1.3 2.5 2.3 4.5 2.3 5.9 0 10.1-5.4 10.1-12.1C24 3.3 19.2 0 12.2 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg aria-hidden className="h-[14px] w-[14px]" viewBox="0 0 24 24">
      <path
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.9 12l-6.3 3.6Z"
        fill="currentColor"
      />
    </svg>
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
      className={`focus-ring whitespace-nowrap text-[15px] font-black uppercase tracking-[0.08em] hover:text-[#d80057] ${
        isActiveNavItem(href, currentHref ?? "/")
          ? "text-[#d80057]"
          : "text-black"
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
  if (label === "Home Briefs") {
    return "Home & Climate";
  }
  return label.replace(" Briefs", "");
}
