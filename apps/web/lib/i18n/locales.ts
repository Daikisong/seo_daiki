import { localeConfig } from "@global-import-lab/seo";
import { locales, type Locale } from "@global-import-lab/types";

export { localeConfig, locales };
export type { Locale };

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localeLabel(locale: Locale) {
  return localeConfig[locale].label;
}
