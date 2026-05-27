import type { Locale } from "@global-import-lab/types";

export const localeConfig: Record<
  Locale,
  { label: string; htmlLang: string; marketName: string; country?: string }
> = {
  en: { label: "English", htmlLang: "en", marketName: "Global English" },
  es: { label: "Español", htmlLang: "es", marketName: "Spain and LATAM", country: "ES" },
  "pt-br": { label: "Português (Brasil)", htmlLang: "pt-BR", marketName: "Brazil", country: "BR" }
};
