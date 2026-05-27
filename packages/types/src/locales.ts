export const locales = ["en", "es", "pt-br"] as const;
export type Locale = (typeof locales)[number];
