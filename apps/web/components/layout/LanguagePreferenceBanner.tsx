"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { HreflangMap, Locale } from "@global-import-lab/types";
import { localeConfig } from "@global-import-lab/seo";

interface LanguagePreferenceBannerProps {
  currentLocale?: Locale;
  alternates?: HreflangMap;
}

const dismissedKey = "global-import-lab-language-banner-dismissed";

export function LanguagePreferenceBanner({ currentLocale, alternates }: LanguagePreferenceBannerProps) {
  const [suggestedLocale, setSuggestedLocale] = useState<Locale | null>(null);
  const href = useMemo(() => {
    if (!suggestedLocale) {
      return "/";
    }

    const alternate = alternateForLocale(alternates, suggestedLocale);
    return alternate ? new URL(alternate).pathname : `/${suggestedLocale}/`;
  }, [alternates, suggestedLocale]);

  useEffect(() => {
    if (window.localStorage.getItem(dismissedKey) === "1") {
      return;
    }

    const language = window.navigator.language.toLowerCase();
    const nextLocale: Locale = language.startsWith("pt-br")
      ? "pt-br"
      : language.startsWith("pt")
        ? "pt-br"
        : language.startsWith("es")
          ? "es"
          : "en";

    if (nextLocale !== currentLocale) {
      setSuggestedLocale(nextLocale);
    }
  }, [currentLocale]);

  if (!suggestedLocale) {
    return null;
  }

  return (
    <div className="border-b border-teal-200 bg-teal-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 text-sm text-teal-950 sm:flex-row sm:items-center sm:justify-between">
        <p>Looks like you may prefer {localeConfig[suggestedLocale].label}.</p>
        <div className="flex gap-2">
          <Link
            className="focus-ring rounded-md bg-teal-700 px-3 py-1.5 font-semibold text-white hover:bg-teal-800"
            href={href}
            hrefLang={localeConfig[suggestedLocale].htmlLang}
          >
            Switch language
          </Link>
          <button
            className="focus-ring rounded-md border border-teal-300 bg-white px-3 py-1.5 font-semibold text-teal-900 hover:border-teal-700"
            onClick={() => {
              window.localStorage.setItem(dismissedKey, "1");
              setSuggestedLocale(null);
            }}
            type="button"
          >
            Stay here
          </button>
        </div>
      </div>
    </div>
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
