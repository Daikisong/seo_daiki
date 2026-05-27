import type { ArticleSection, InternalLink, Locale } from "@global-import-lab/types";

export function sampleInternalLinks(locale: Locale): InternalLink[] {
  const prefix = `/${locale}`;
  const hubSlug = locale === "en" ? "usb-c-chargers" : locale === "es" ? "cargadores-usb-c" : "carregadores-usb-c";
  return [
    { label: "USB-C charger hub", href: `${prefix}/${hubSlug}/`, reason: "category_hub" },
    {
      label: "How we test USB-C chargers",
      href: `${prefix}/methodology/how-we-test-usb-c-chargers/`,
      reason: "methodology"
    },
    {
      label: "65W charger output table",
      href: `${prefix}/data/65w-gan-charger-output-table/`,
      reason: "data"
    },
    {
      label: "65W vs 100W charger comparison",
      href: `${prefix}/compare/65w-vs-100w-gan-charger/`,
      reason: "compare"
    },
    {
      label: "Fake watts buying guide",
      href: `${prefix}/guides/aliexpress-charger-fake-watts/`,
      reason: "guide"
    },
    {
      label: "Wrong plug option guide",
      href: `${prefix}/guides/aliexpress-charger-wrong-plug-option/`,
      reason: "guide"
    }
  ];
}

export function sampleSections(headings: string[], evidenceIds: string[]): ArticleSection[] {
  return headings.map((heading, index) => ({
    heading,
    body:
      index % 2 === 0
        ? "This section separates seller claims from verified evidence, then explains the variant, plug, price, and return-risk implications before a buyer clicks an affiliate link."
        : "The decision rule is intentionally conservative: buy only when the selected SKU matches the tested claim, the final shipped price stays in the buy zone, and the local risk matrix is acceptable.",
    evidenceIds: evidenceIds.slice(index, index + 2)
  }));
}
