import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  buildExistingMarketContentHreflangMap,
  canonicalForMarketPath,
  hreflangKeyForMarket,
  marketContentPath
} from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { enabledMarkets, findMarket } from "@/lib/market/config";
import { marketContentHreflangVariants, readMarketTrends } from "@/lib/market/market-data";
import type { MarketTrendView } from "@/lib/market/market-data-types";
import { routeSlugMatches } from "@/lib/market/route-slugs";
import { labelsForLanguage } from "@/lib/market/ui-labels";
import { marketResearchMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ locale: string; language: string; slug: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().flatMap((market) =>
    readMarketTrends(market).map((trend) => ({ locale: market.market, language: market.language, slug: trend.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const trend = readMarketTrends(market).find((item) => routeSlugMatches(item.slug, slug));
  const path = marketContentPath(market, "trends", slug);
  const variants = marketContentHreflangVariants(enabledMarkets(), "trends", slug);
  const currentVariant = variants.find((variant) => variant.market === market.market && variant.language === market.language) ?? {
    market: market.market,
    language: market.language,
    path,
    hreflang: hreflangKeyForMarket(market),
    exists: Boolean(trend),
    indexable: true
  };
  return marketResearchMetadata({
    title: trend ? `${trend.title} | ${market.country} Trend` : `${market.country} Trend`,
    description: trend?.summary ?? `Market-specific trend page for ${market.country}.`,
    canonical: canonicalForMarketPath(path),
    hreflangMap: buildExistingMarketContentHreflangMap(variants, currentVariant)
  });
}

export default async function MarketTrendPage({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }
  const trend = readMarketTrends(market).find((item) => routeSlugMatches(item.slug, slug));
  if (!trend) {
    notFound();
  }
  const { labels } = labelsForLanguage(market.language);
  const trendPath = marketContentPath(market, "trends", trend.slug);
  const canonical = canonicalForMarketPath(trendPath);
  const primarySections = marketTrendSections(trend, market.country);
  const relatedPaths = [
    { label: "Keyword map", href: marketContentPath(market, "keywords", trend.slug), note: "Check localized search intent." },
    { label: "SERP pattern", href: marketContentPath(market, "serp", trend.slug), note: "Review ranking formats before drafting." },
    { label: "Content brief", href: marketContentPath(market, "briefs", trend.slug), note: "Turn the trend into a publishable article." }
  ];
  const methodRows = [
    [labels.score, trend.score.toFixed(1), scoreMeaning(trend.score)],
    [labels.category, trend.category || "Uncategorized", "Use this to choose the content template."],
    [labels.status, trend.status || "pending", "Move forward only after SERP and evidence review."]
  ] as const;
  const trendBriefRows = [
    {
      signal: "Primary keyword",
      value: trend.keyword,
      action: trend.angle || "Write the first paragraph as a direct local answer."
    },
    {
      signal: "Market",
      value: market.country,
      action: "Use local language, local examples, and hreflang variants."
    },
    {
      signal: "Monetization gate",
      value: trend.score >= 70 ? "Review product fit" : "Hold monetization",
      action: "Attach Top 10 recommendations only after buyer intent and evidence are clear."
    }
  ];

  return (
    <>
      <JsonLd data={buildMarketTrendJsonLd({ canonical, marketCountry: market.country, marketLanguage: market.language, trend, trendPath })} />
      <main className="mx-auto max-w-5xl px-4 py-5 md:py-8">
        <article className="space-y-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3 text-sm text-neutral-600">
            <Link className="focus-ring font-black uppercase tracking-normal text-neutral-950 hover:text-teal-800" href={market.pathPrefix}>
              Trend Picks
            </Link>
            <span>{market.country} trend guide</span>
          </div>
          <header className="border-b border-neutral-200 pb-7">
            <p className="text-sm font-semibold uppercase text-teal-700">
              {market.country} {labels.trendResearch}
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-normal text-neutral-950 md:text-5xl">
              {trend.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600">
              <span>{market.market.toUpperCase()} / {market.language}</span>
              <span>Trend score {trend.score.toFixed(1)}</span>
              <span>{trend.status}</span>
            </div>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-700">{trend.summary}</p>
          </header>

          <MarketTrendJumpLinks />

          <section className="space-y-10">
            <section id="quick-answer">
              <MarketTrendHeading>Quick answer</MarketTrendHeading>
              <p className="mt-5 max-w-4xl text-base leading-8 text-neutral-800">
                {primarySections[0]?.body}
              </p>
            </section>
            <section id="why-trending">
              <MarketTrendHeading>Why it is trending</MarketTrendHeading>
              <p className="mt-5 max-w-4xl text-base leading-8 text-neutral-800">
                {primarySections[1]?.body}
              </p>
            </section>
            <section id="what-to-check">
              <MarketTrendHeading>What to check now</MarketTrendHeading>
              <p className="mt-5 max-w-4xl text-base leading-8 text-neutral-800">
                {primarySections[2]?.body}
              </p>
            </section>
          </section>

          <section id="how-we-chose">
            <MarketTrendHeading>How this trend should become content</MarketTrendHeading>
            <p className="mt-5 max-w-4xl text-base leading-8 text-neutral-800">
              {trend.angle || "This page uses the same answer-first structure as the article renderer: summarize the trend, explain why it is moving, list the checks, then decide whether it deserves a buying guide or a non-monetized brief."}
            </p>
            <div className="mt-5 border-y border-neutral-200">
              {methodRows.map(([label, value, note]) => (
                <div className="grid gap-2 border-b border-neutral-200 py-4 last:border-b-0 md:grid-cols-[180px_minmax(0,1fr)]" key={label}>
                  <p className="text-sm font-black uppercase tracking-normal text-teal-700">{label}</p>
                  <div>
                    <p className="text-lg font-black text-neutral-950">{value}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-700">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="trend-brief-table">
            <MarketTrendHeading>Trend brief table</MarketTrendHeading>
            <p className="mt-5 max-w-4xl text-sm leading-6 text-neutral-600">
              Use this as the pre-article checkpoint before expanding into a Top 10 recommendation section.
            </p>
            <div className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200 md:hidden">
              {trendBriefRows.map((row) => (
                <div className="py-4" key={row.signal}>
                  <p className="text-xs font-black uppercase tracking-normal text-teal-700">{row.signal}</p>
                  <p className="mt-1 text-base font-black text-neutral-950">{row.value}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{row.action}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 hidden overflow-x-auto border-y border-neutral-200 md:block">
              <table className="min-w-[720px] text-sm">
                <thead>
                  <tr className="bg-teal-800 text-left text-white">
                    <th className="border-teal-700 text-white">Signal</th>
                    <th className="border-teal-700 text-white">Current value</th>
                    <th className="border-teal-700 text-white">Editorial action</th>
                  </tr>
                </thead>
                <tbody>
                  {trendBriefRows.map((row) => (
                    <tr key={row.signal}>
                      <td>{row.signal}</td>
                      <td>{row.value}</td>
                      <td>{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="border-t border-neutral-200 pt-8" id="next-content-steps">
            <MarketTrendHeading>Next content steps</MarketTrendHeading>
            <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
              {relatedPaths.map((item) => (
                <Link className="focus-ring block py-4 hover:text-teal-800" href={item.href} key={item.label}>
                  <span className="block font-bold text-neutral-950">{item.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-neutral-700">{item.note}</span>
                </Link>
              ))}
            </div>
          </section>

          {trend.sourceLinks.length > 0 ? (
            <section className="border-t border-neutral-200 pt-8" id="sources-to-verify">
              <MarketTrendHeading>Sources to verify</MarketTrendHeading>
              <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
                {trend.sourceLinks.slice(0, 4).map((source) => (
                  <a className="focus-ring block py-4 hover:text-teal-800" href={source.url} key={source.url} rel="noopener noreferrer" target="_blank">
                    <span className="block font-bold text-neutral-950">{source.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-neutral-700">{source.note}</span>
                    {source.checkedAt ? <span className="mt-1 block text-xs uppercase text-neutral-500">Checked {source.checkedAt}</span> : null}
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          <MarketTrendFAQ trend={trend} />

          <section className="grid gap-6 border-t border-neutral-200 pt-6 md:grid-cols-[1fr_0.9fr]" id="publishing-checklist">
            <div>
              <h2 className="text-lg font-black tracking-normal text-neutral-950">{labels.researchStatus}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{labels.contentDepthNote}</p>
            </div>
            <div>
              <h2 className="text-lg font-black tracking-normal text-neutral-950">Publishing checklist</h2>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                {(trend.checklist.length > 0
                  ? trend.checklist.slice(0, 5)
                  : [
                      "Confirm the top SERP format for the country.",
                      "Add sources and freshness evidence before indexing.",
                      "Use local language, examples, and risk notes.",
                      "Attach affiliate recommendations only after buyer intent is proven.",
                      `Keep canonical path aligned to ${trendPath}.`
                    ]).map((item) => (
                  <li className="flex gap-2" key={item}>
                    <span className="mt-1 h-3 w-3 rounded-sm border border-teal-700" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function MarketTrendJumpLinks() {
  return (
    <nav className="border-y border-neutral-200 py-3 text-sm" aria-label="Trend research sections">
      <ol className="flex flex-wrap gap-x-5 gap-y-2 text-neutral-700">
        {marketTrendTocItems.map(([href, label]) => (
          <li key={href}>
            <a className="focus-ring rounded-sm hover:text-teal-800" href={href}>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function MarketTrendHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-end gap-4 border-b-4 border-cyan-500 pb-3">
      <h2 className="flex-1 text-3xl font-black leading-tight tracking-normal text-sky-700 md:text-4xl">{children}</h2>
      <span className="mb-2 h-3 w-3 rotate-45 bg-orange-500" aria-hidden />
    </div>
  );
}

function scoreMeaning(score: number) {
  if (score >= 85) {
    return "High-priority trend. Draft a localized article and inspect commerce fit.";
  }
  if (score >= 70) {
    return "Useful trend. Validate SERP patterns before assigning a buying guide.";
  }
  return "Watchlist trend. Keep research-first until stronger demand appears.";
}

const marketTrendTocItems = [
  ["#quick-answer", "Quick answer"],
  ["#why-trending", "Why it is trending"],
  ["#what-to-check", "What to check now"],
    ["#how-we-chose", "How to expand"],
    ["#trend-brief-table", "Trend brief table"],
    ["#next-content-steps", "Next content steps"],
    ["#sources-to-verify", "Sources to verify"],
    ["#faq", "FAQ"],
    ["#publishing-checklist", "Publishing checklist"]
  ] as const;

function MarketTrendFAQ({ trend }: { trend: MarketTrendView }) {
  const faqs = marketTrendFaqs(trend);
  return (
    <section className="border-t border-neutral-200 pt-8" id="faq">
      <MarketTrendHeading>FAQ</MarketTrendHeading>
      <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
        {faqs.map((faq) => (
          <details className="group py-4" key={faq.question}>
            <summary className="cursor-pointer list-none text-base font-black text-neutral-950">
              <span className="mr-3 text-teal-700 group-open:text-orange-600">+</span>
              {faq.question}
            </summary>
            <p className="mt-3 pl-7 text-sm leading-6 text-neutral-700">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function fallbackTrendSections(trend: MarketTrendView, country: string) {
  return [
    {
      heading: "Quick answer",
      body: `${trend.title} is worth covering only after the current price, source freshness, local availability, and buyer intent are verified for ${country}.`
    },
    {
      heading: "Why it is trending",
      body: `The trend score is ${trend.score.toFixed(1)}, so the topic has enough signal to inspect related queries, ranking formats, and local timing before publication.`
    },
    {
      heading: "What to check",
      body: "Confirm country-specific language, freshness, official or specialist sources, competing page types, and whether the topic deserves a buying guide or an informational explainer."
    }
  ];
}

function marketTrendSections(trend: MarketTrendView, country: string) {
  const fallback = fallbackTrendSections(trend, country);
  return [trend.sections[0] ?? fallback[0], trend.sections[1] ?? fallback[1], trend.sections[2] ?? fallback[2]];
}

function buildMarketTrendJsonLd({
  canonical,
  marketCountry,
  marketLanguage,
  trend,
  trendPath
}: {
  canonical: string;
  marketCountry: string;
  marketLanguage: string;
  trend: MarketTrendView;
  trendPath: string;
}) {
  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: trend.title,
      description: trend.summary,
      mainEntityOfPage: canonical,
      url: canonical,
      inLanguage: marketLanguage,
      isAccessibleForFree: true,
      author: { "@type": "Organization", name: "Trend Picks editorial desk" },
      publisher: { "@type": "Organization", name: "Global Import Lab" },
      reviewedBy: { "@type": "Organization", name: "Global Import Lab trend review" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Markets", item: canonicalForMarketPath("/global/markets/") },
        { "@type": "ListItem", position: 2, name: `${marketCountry} / ${marketLanguage}`, item: canonicalForMarketPath(`/${marketCountry.toLowerCase()}/${marketLanguage}/`) },
        { "@type": "ListItem", position: 3, name: trend.title, item: canonicalForMarketPath(trendPath) }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: marketTrendFaqs(trend).map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer }
      }))
    }
  ];

  if (trend.sourceLinks.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${trend.title} sources to verify`,
      itemListElement: trend.sourceLinks.slice(0, 4).map((source, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: source.label,
        url: source.url
      }))
    });
  }

  return schemas;
}

function marketTrendFaqs(trend: MarketTrendView) {
  return [
    {
      question: `Is ${trend.keyword} ready for affiliate recommendations?`,
      answer:
        "Not by default. Affiliate links should be added only after the product candidate, current price, source evidence, seller or retailer policy, and local-risk checks are approved."
    },
    {
      question: "What should be checked before publishing?",
      answer:
        "Check the live SERP format, source freshness, market-specific wording, official or specialist references, and whether the topic should be a buying guide or a non-monetized explainer."
    },
    {
      question: "Why keep source links on the trend page?",
      answer:
        "Source links show what evidence should be rechecked before the page becomes an indexed guide, especially when prices, stock, reviews, or policy details can change quickly."
    }
  ];
}
