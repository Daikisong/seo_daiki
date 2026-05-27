import type { LocalizationVariantSummary } from "./admin-review-types";

export function localizationVariantStatusLabel(variants: LocalizationVariantSummary[]) {
  return variants.map((variant) => `${variant.locale}:${variant.status}`).join(", ") || "-";
}

export function localizationDepthLabel(variants: LocalizationVariantSummary[]) {
  return variants.map((variant) => `${variant.locale} ${variant.localizationDepthScore}`).join(", ") || "-";
}

export function localizationPrimaryLocale(variants: LocalizationVariantSummary[]) {
  return variants[0]?.locale || "en";
}
