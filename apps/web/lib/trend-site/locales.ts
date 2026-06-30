// Keep locale expansion centralized here. Supporting a locale only means the
// pipeline may generate localized content for it; it must not become public
// SEO surface until `status` is changed to "indexable" after local content,
// navigation, sitemap, hreflang, and QA are ready.
//
// The planned 18-locale model intentionally uses one global domain with fixed
// subdirectories. Do not serve different languages from the same URL by IP,
// cookie, or browser language. Do not use invalid hreflang regions such as
// en-eu, en-uk, EU, or UK.
export const targetLocaleConfigs = [
  {
    code: "en",
    label: "Global English",
    htmlLang: "en",
    languageName: "English",
    marketName: "Global English",
    status: "indexable"
  },
  {
    code: "en-us",
    label: "United States",
    htmlLang: "en-US",
    languageName: "English",
    marketName: "United States",
    status: "planned"
  },
  {
    code: "en-gb",
    label: "United Kingdom",
    htmlLang: "en-GB",
    languageName: "English",
    marketName: "United Kingdom",
    status: "planned"
  },
  {
    code: "de-de",
    label: "Germany",
    htmlLang: "de-DE",
    languageName: "Deutsch",
    marketName: "Germany",
    status: "planned"
  },
  {
    code: "fr-fr",
    label: "France",
    htmlLang: "fr-FR",
    languageName: "Français",
    marketName: "France",
    status: "planned"
  },
  {
    code: "it-it",
    label: "Italy",
    htmlLang: "it-IT",
    languageName: "Italiano",
    marketName: "Italy",
    status: "planned"
  },
  {
    code: "es-es",
    label: "Spain",
    htmlLang: "es-ES",
    languageName: "Español",
    marketName: "Spain",
    status: "planned"
  },
  {
    code: "ko-kr",
    label: "South Korea",
    htmlLang: "ko-KR",
    languageName: "한국어",
    marketName: "South Korea",
    status: "planned"
  },
  {
    code: "ja-jp",
    label: "Japan",
    htmlLang: "ja-JP",
    languageName: "日本語",
    marketName: "Japan",
    status: "planned"
  },
  {
    code: "zh-tw",
    label: "Taiwan",
    htmlLang: "zh-TW",
    languageName: "繁體中文",
    marketName: "Taiwan",
    status: "planned"
  },
  {
    code: "zh-hk",
    label: "Hong Kong",
    htmlLang: "zh-HK",
    languageName: "繁體中文",
    marketName: "Hong Kong",
    status: "planned"
  },
  {
    code: "pt-br",
    label: "Brazil",
    htmlLang: "pt-BR",
    languageName: "Português",
    marketName: "Brazil",
    status: "planned"
  },
  {
    code: "nl-nl",
    label: "Netherlands",
    htmlLang: "nl-NL",
    languageName: "Nederlands",
    marketName: "Netherlands",
    status: "planned"
  },
  {
    code: "pl-pl",
    label: "Poland",
    htmlLang: "pl-PL",
    languageName: "Polski",
    marketName: "Poland",
    status: "planned"
  },
  {
    code: "sv-se",
    label: "Sweden",
    htmlLang: "sv-SE",
    languageName: "Svenska",
    marketName: "Sweden",
    status: "planned"
  },
  {
    code: "tr-tr",
    label: "Turkey",
    htmlLang: "tr-TR",
    languageName: "Türkçe",
    marketName: "Turkey",
    status: "planned"
  },
  {
    code: "th-th",
    label: "Thailand",
    htmlLang: "th-TH",
    languageName: "ไทย",
    marketName: "Thailand",
    status: "planned"
  },
  {
    code: "vi-vn",
    label: "Vietnam",
    htmlLang: "vi-VN",
    languageName: "Tiếng Việt",
    marketName: "Vietnam",
    status: "planned"
  }
] as const;

export type Locale = (typeof targetLocaleConfigs)[number]["code"];
export type LocaleStatus = (typeof targetLocaleConfigs)[number]["status"];

export const defaultLocale: Locale = "en";

const localeConfigByCode = new Map(targetLocaleConfigs.map((config) => [config.code, config]));

export function isSupportedLocale(value: string): value is Locale {
  return localeConfigByCode.has(value as Locale);
}

export function getLocaleConfig(locale: Locale) {
  return localeConfigByCode.get(locale);
}

export function localeToHtmlLang(locale: Locale) {
  return getLocaleConfig(locale)?.htmlLang ?? locale;
}

export function isIndexableLocale(locale: Locale) {
  return getLocaleConfig(locale)?.status === "indexable";
}

export function indexableLocaleCodes() {
  return targetLocaleConfigs.filter((config) => config.status === "indexable").map((config) => config.code);
}

export function hreflangForLocale(locale: Locale) {
  return locale;
}

export function assertSupportedLocale(locale: string, fieldName: string) {
  if (!isSupportedLocale(locale)) {
    throw new Error(`${fieldName} uses unsupported locale "${locale}". Add it to targetLocaleConfigs first.`);
  }
}
