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
    body: sampleSectionBody(heading, index),
    evidenceIds: evidenceIds.slice(index, index + 2)
  }));
}

function sampleSectionBody(heading: string, index: number) {
  const normalized = heading.toLowerCase();

  if (normalized.includes("price") || normalized.includes("offer") || normalized.includes("deal") || normalized.includes("buy")) {
    return "Check the live price, coupon, shipping cost, and seller return path before treating the offer as a deal. A strong deal-watch section should say whether to buy, wait, or avoid, then explain which exact variant and final shipped price make the recommendation valid.";
  }

  if (
    normalized.includes("ingredient") ||
    normalized.includes("claim") ||
    normalized.includes("safety") ||
    normalized.includes("iherb") ||
    normalized.includes("magnesium")
  ) {
    return "Keep the health angle evidence-first: explain what the ingredient is, separate supported claims from unsupported claims, show the source basis, and keep product links secondary until safety warnings and local compliance notes are clear.";
  }

  if (normalized.includes("local")) {
    return "Localize the recommendation before publishing: check plug type, certification wording, customs or VAT exposure, delivery timing, return route, currency, and whether a local retailer is a safer alternative than a cross-border marketplace listing.";
  }

  if (normalized.includes("evidence") || normalized.includes("signal")) {
    return "Use this section to connect the trend signal to evidence: tested output, temperature behavior, seller claim wording, review complaints, price history, and the exact SKU. The page should not move into a Top 10 recommendation block until these checks support the buyer intent.";
  }

  if (normalized.includes("why") || normalized.includes("rising") || normalized.includes("growing")) {
    return "The trend is rising because shoppers want smaller travel chargers but are also searching for fake-wattage warnings, variant traps, and final-price checks. Explain the freshness signal first, then show what changed in the market or search results.";
  }

  if (normalized.includes("problem") || normalized.includes("avoid")) {
    return "The buyer problem is not just finding a cheap charger. Readers need to avoid mystery SKUs, inflated wattage claims, missing cable details, unsafe plug options, weak returns, and listings where the final shipped price no longer beats a trusted local option.";
  }

  if (index === 0) {
    return "Quick answer: treat this trend as a buying-risk guide, not just a news item. Start with the exact product variant, verified output, final shipped price, and return path; only then compare AliExpress-style recommendations in the Top 10 section below.";
  }

  return "The decision rule is intentionally conservative: recommend only when the selected SKU matches the tested claim, the final shipped price stays in the buy zone, and the local risk matrix is acceptable for the reader's country.";
}
