export function legacyLocaleDefaultMarketPath(locale: string) {
  if (locale === "en") {
    return "/us/en/";
  }
  if (locale === "es") {
    return "/es/es/";
  }
  if (locale === "pt-br") {
    return "/br/pt-br/";
  }
  return undefined;
}
