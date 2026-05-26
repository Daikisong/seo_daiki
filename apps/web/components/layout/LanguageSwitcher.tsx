import Link from "next/link";
import type { HreflangMap, Locale } from "@global-import-lab/types";
import { localeConfig } from "@global-import-lab/seo";

interface LanguageSwitcherProps {
  currentLocale?: Locale;
  currentHref?: string;
  alternates?: HreflangMap;
}

export function LanguageSwitcher({ currentLocale, currentHref, alternates }: LanguageSwitcherProps) {
  const localeEntries = Object.entries(localeConfig) as Array<[Locale, (typeof localeConfig)[Locale]]>;

  return (
    <nav aria-label="Language" className="flex flex-wrap gap-2">
      {localeEntries.map(([locale, config]) => {
        const alternate = alternateForLocale(alternates, locale);
        const active = locale === currentLocale;
        const href = active && currentHref ? currentHref : alternate ? new URL(alternate).pathname : `/${locale}/`;
        return (
          <Link
            className={`focus-ring rounded-md border px-3 py-1.5 text-sm ${
              active
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-neutral-300 bg-white text-neutral-700 hover:border-teal-700"
            }`}
            href={href}
            hrefLang={config.htmlLang}
            key={locale}
          >
            {config.label}
          </Link>
        );
      })}
    </nav>
  );
}

function alternateForLocale(alternates: HreflangMap | undefined, locale: Locale) {
  if (!alternates) {
    return undefined;
  }

  const keysByLocale: Record<Locale, string[]> = {
    en: ["en", "en-US", "en-GB"],
    es: ["es", "es-ES"],
    "pt-br": ["pt-br", "pt-BR"]
  };

  return keysByLocale[locale].map((key) => alternates[key]).find(Boolean);
}
