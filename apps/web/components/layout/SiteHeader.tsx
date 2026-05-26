import Link from "next/link";
import { Database, FlaskConical, Search } from "lucide-react";
import type { HreflangMap, Locale } from "@global-import-lab/types";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LanguagePreferenceBanner } from "./LanguagePreferenceBanner";
import { MarketSwitcher } from "./MarketSwitcher";

export function SiteHeader({
  locale,
  currentHref,
  alternates
}: {
  locale?: Locale;
  currentHref?: string;
  alternates?: HreflangMap;
}) {
  return (
    <header className="bg-white">
      <LanguagePreferenceBanner currentLocale={locale} alternates={alternates} />
      <div className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link className="focus-ring flex items-center gap-3 rounded-sm" href={locale ? `/${locale}/` : "/"}>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-950 text-white">
              <Search aria-hidden size={20} />
            </span>
            <span>
              <span className="block text-base font-semibold">Global Import Lab</span>
              <span className="block text-xs text-neutral-500">Product evidence database</span>
            </span>
          </Link>
          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex gap-2 text-sm text-neutral-600">
              <Link className="focus-ring inline-flex items-center gap-1 rounded-sm hover:text-neutral-950" href="/data/">
                <Database aria-hidden size={15} />
                Data
              </Link>
              <Link className="focus-ring inline-flex items-center gap-1 rounded-sm hover:text-neutral-950" href="/lab/">
                <FlaskConical aria-hidden size={15} />
                Lab
              </Link>
            </div>
            <MarketSwitcher />
            <LanguageSwitcher currentLocale={locale} currentHref={currentHref} alternates={alternates} />
          </div>
        </div>
      </div>
    </header>
  );
}
