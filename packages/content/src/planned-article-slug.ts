import type { Locale } from "@global-import-lab/types";
import type { UrlPlanRow } from "./article-draft-types";

export function plannedSlug(row: UrlPlanRow, ordinal: number) {
  const suffix = String(ordinal).padStart(2, "0");
  const baseByLocale: Record<Locale, string> = {
    en: "usb-c-import-verification",
    es: "verificacion-importacion-usb-c",
    "pt-br": "verificacao-importacao-usb-c"
  };
  return `${baseByLocale[row.locale]}-${row.type}-${suffix}`;
}
