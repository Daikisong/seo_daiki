import type { Article, Product } from "@/lib/trend-site/types";
import type { ReactNode } from "react";
import { AffiliateOutboundLink } from "@/components/seo/AffiliateOutboundLink";
import {
  buildTrendRecommendationModel,
  type TrendRecommendation,
} from "@/lib/trend-site/recommendations";

const articleBodyClass =
  "text-[15px] leading-[27px] text-neutral-800 md:text-base md:leading-[28.8px]";

export function SectionGrid({
  article,
  startIndex = 0,
}: {
  article: Article;
  startIndex?: number;
}) {
  const sections = article.sections.slice(startIndex);
  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {sections.map((section) => (
        <div
          className="rounded-md border border-neutral-200 bg-white p-4"
          key={section.heading}
        >
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          <p className="mt-2 text-sm text-neutral-700">{section.body}</p>
        </div>
      ))}
    </section>
  );
}

export function HealthContentNotice() {
  return (
    <section className="rounded-md border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
      <h2 className="text-base font-semibold">Health content notice</h2>
      <p className="mt-2">
        This page is informational only, not medical advice. Readers should
        consult a qualified healthcare professional before using supplements,
        especially during pregnancy, medication use, or chronic conditions.
      </p>
    </section>
  );
}

export function TrendEditorialSections({
  article,
  sections = article.sections,
}: {
  article: Article;
  sections?: Article["sections"];
}) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="space-y-10">
      {sections.map((section, index) => (
        <section
          id={trendSectionId(section.heading, index)}
          key={section.heading}
        >
          <TrendArticleHeading>{section.heading}</TrendArticleHeading>
          <p className={`mt-[25px] ${articleBodyClass}`}>{section.body}</p>
        </section>
      ))}
    </section>
  );
}

export function TrendSignalBox({ article }: { article: Article }) {
  const signal = article.trendSignalBox;
  if (!signal) {
    return null;
  }

  return (
    <section
      className="border-l-4 border-cyan-500 bg-cyan-50 px-4 py-4"
      id="trend-signal"
    >
      <h2 className="text-lg font-black tracking-normal text-neutral-950">
        {signal.heading}
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-800">{signal.body}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {signal.items.map((item) => (
          <p className="text-sm leading-6 text-neutral-800" key={item.label}>
            <strong className="block text-neutral-950">{item.label}</strong>
            {item.body}
          </p>
        ))}
      </div>
      {signal.sourceNote ? (
        <p className="mt-3 text-xs leading-5 text-neutral-600">
          {signal.sourceNote}
        </p>
      ) : null}
    </section>
  );
}

export function TrendMarketplaceRule({ article }: { article: Article }) {
  const rule = article.marketplaceRule;
  if (!rule) {
    return null;
  }

  return (
    <section className="border-y border-neutral-200 py-6" id="marketplace-rule">
      <TrendArticleHeading>{rule.heading}</TrendArticleHeading>
      <p className={`mt-[25px] ${articleBodyClass}`}>{rule.body}</p>
      <ul className="mt-4 grid gap-3 text-sm leading-6 text-neutral-700 md:grid-cols-3">
        {rule.bullets.map((item) => (
          <li
            className="border-l-4 border-teal-700 bg-teal-50 px-4 py-3"
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TrendCommerceSection({
  article,
  buyerContextSections = [],
  postFinalThoughtSections = [],
  products,
}: {
  article: Article;
  buyerContextSections?: Article["sections"];
  postFinalThoughtSections?: Article["sections"];
  products: Product[];
}) {
  const recommendationModel = buildTrendRecommendationModel(article, products);
  if (
    !recommendationModel.eligible ||
    recommendationModel.recommendations.length === 0
  ) {
    return null;
  }

  const recommendations = recommendationModel.recommendations;

  return (
    <section
      className="space-y-10 border-t border-neutral-200 pt-10"
      id="recommended-gear"
    >
      <section>
        <TrendArticleHeading>
          {article.expertCopy.topPicksHeading}
        </TrendArticleHeading>
        <p className={`mt-[25px] ${articleBodyClass}`}>
          {article.expertCopy.topPicksIntro}
        </p>
        <p className="mt-[25px] border-l-4 border-cyan-500 bg-cyan-50 px-4 py-3 text-[15px] leading-[27px] text-neutral-800 md:text-base md:leading-[28.8px]">
          {article.expertCopy.topPicksRule}
        </p>
      </section>

      <TrendComparisonTable
        article={article}
        recommendations={recommendations}
      />
      <TrendCountryBuyingRoutes article={article} />
      <TrendEditorialSections
        article={article}
        sections={buyerContextSections}
      />

      <section className="space-y-4" id="top-10-reviews">
        <TrendArticleHeading>
          {article.expertCopy.inDepthHeading}
        </TrendArticleHeading>
        {recommendations.map((item) => (
          <TrendRecommendationCard
            article={article}
            item={item}
            key={item.rank}
          />
        ))}
      </section>

      <TrendTopThreeRecommendations
        article={article}
        recommendations={recommendations}
      />
      <TrendFinalThoughts article={article} />
      <TrendAvoidList article={article} />
      <TrendEditorialSections
        article={article}
        sections={postFinalThoughtSections}
      />
      <TrendBuyingChecklist article={article} />
      <TrendFAQ article={article} />
      <TrendUpdateLog article={article} />
    </section>
  );
}

function TrendCountryBuyingRoutes({ article }: { article: Article }) {
  const routes = article.countryBuyingRoutes ?? [];
  if (routes.length === 0) {
    return null;
  }

  return (
    <section id="country-buying-routes">
      <TrendArticleHeading>Where to check by country</TrendArticleHeading>
      <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
        {routes.map((item) => (
          <p
            className="grid gap-2 py-4 text-sm leading-6 text-neutral-700 md:grid-cols-[150px_minmax(0,1fr)]"
            key={item.market}
          >
            <strong className="text-neutral-950">{item.market}</strong>
            <span>{item.route}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

function TrendAvoidList({ article }: { article: Article }) {
  const avoidList = article.avoidList ?? [];
  if (avoidList.length === 0 || !article.avoidListHeading) {
    return null;
  }

  return (
    <section id="cooling-products-to-avoid">
      <TrendArticleHeading>{article.avoidListHeading}</TrendArticleHeading>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {avoidList.map((item) => (
          <article
            className="border-l-4 border-amber-500 bg-amber-50 px-4 py-3"
            key={item.label}
          >
            <h3 className="text-sm font-black text-neutral-950">
              {item.label}
            </h3>
            <p className="mt-1 text-sm leading-6 text-neutral-700">
              {item.reason}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrendTopThreeRecommendations({
  article,
  recommendations,
}: {
  article: Article;
  recommendations: TrendRecommendation[];
}) {
  const topThree = recommendations.slice(0, 3);

  if (topThree.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-neutral-200 pt-8" id="jacob-top-3">
      <TrendArticleHeading>
        {article.expertCopy.topThreeHeading}
      </TrendArticleHeading>
      <div className="mt-[25px] space-y-8">
        {topThree.map((item) => (
          <article key={item.rank}>
            <h3 className="text-base font-black leading-7 tracking-normal text-neutral-950">
              <span
                aria-hidden
                className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f4a949] text-[11px] font-black text-white"
              >
                {item.rank}
              </span>
              #{item.rank} {item.rankLabel} -{" "}
              <a
                className="font-black text-[#2f7cd3] hover:underline"
                href={`#trend-pick-${item.rank}`}
              >
                {item.name}
              </a>
            </h3>
            <p className={`mt-2 ${articleBodyClass}`}>
              {item.expertReviewTake}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrendFinalThoughts({ article }: { article: Article }) {
  return (
    <section className="border-t border-neutral-200 pt-8" id="final-thoughts">
      <TrendArticleHeading>
        {article.expertCopy.finalThoughtsHeading}
      </TrendArticleHeading>
      <div className={`mt-[25px] space-y-[25px] ${articleBodyClass}`}>
        {article.expertCopy.finalThoughts.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function TrendBuyingChecklist({ article }: { article: Article }) {
  return (
    <section className="border-t border-neutral-200 pt-8" id="buying-checklist">
      <h2 className="text-lg font-black tracking-normal text-neutral-950">
        {article.expertCopy.buyingChecklistHeading}
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-neutral-700">
        {article.expertCopy.buyingChecklist.map((item) => (
          <li className="flex gap-2" key={item}>
            <span
              className="mt-1 h-3 w-3 rounded-sm border border-teal-700"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TrendFAQ({ article }: { article: Article }) {
  return (
    <section className="border-t border-neutral-200 pt-8" id="faq">
      <TrendArticleHeading>FAQ</TrendArticleHeading>
      <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
        {article.faqs.map((faq) => (
          <details className="group py-4" key={faq.question}>
            <summary className="cursor-pointer list-none text-base font-black text-neutral-950">
              <span className="mr-3 text-teal-700 group-open:text-orange-600">
                +
              </span>
              {faq.question}
            </summary>
            <p className="mt-3 pl-7 text-sm leading-6 text-neutral-700">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function TrendUpdateLog({ article }: { article: Article }) {
  if (article.expertCopy.updateLog.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-neutral-200 pt-8" id="update-log">
      <h2 className="text-lg font-black tracking-normal text-neutral-950">
        {article.expertCopy.updateLogHeading}
      </h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
        {article.expertCopy.updateLog.map((item) => (
          <li className="flex gap-2" key={item}>
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TrendComparisonTable({
  article,
  recommendations,
}: {
  article: Article;
  recommendations: TrendRecommendation[];
}) {
  const hasCoolingFields = recommendations.every(
    (item) =>
      item.productKind &&
      item.regionFit &&
      item.coolingCapacity &&
      item.hoseType &&
      item.noiseLevel &&
      item.roomSize &&
      item.voltagePlug &&
      item.returnRiskLabel,
  );

  return (
    <section id="top-10-comparison">
      <TrendArticleHeading>
        {article.expertCopy.comparisonHeading}
      </TrendArticleHeading>
      <div className="mt-5">
        <p className="text-sm leading-6 text-neutral-600">
          {article.expertCopy.comparisonIntro}
        </p>
      </div>
      <div className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200 md:hidden">
        {recommendations.map((item) => (
          <article className="py-4" key={item.rank}>
            <div className="flex items-start gap-3">
              <ProductVisual item={item} compact />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 min-[460px]:flex-row min-[460px]:items-start min-[460px]:justify-between min-[460px]:gap-3">
                  <h3 className="font-bold leading-snug text-neutral-950">
                    {item.rank}. {item.name}
                  </h3>
                  <span className="text-sm font-black leading-snug text-neutral-950">
                    {item.price}
                  </span>
                </div>
                <p className="mt-2 text-[11px] font-black uppercase tracking-normal text-teal-800">
                  Best fit
                </p>
                <p className="text-sm leading-5 text-neutral-800">
                  {compactComparisonText(item.bestFor, 96)}
                </p>
                {hasCoolingFields ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="bg-cyan-50 px-2 py-1 text-[11px] font-bold text-teal-900">
                      {compactComparisonText(
                        item.coolingCapacity ?? item.productKind ?? "",
                        32,
                      )}
                    </span>
                    <span className="bg-neutral-100 px-2 py-1 text-[11px] font-bold text-neutral-700">
                      {compactComparisonText(item.regionFit, 46)}
                    </span>
                  </div>
                ) : null}
                <p className="mt-2 text-[11px] font-black uppercase tracking-normal text-rose-700">
                  Check first
                </p>
                <p className="text-sm leading-5 text-neutral-800">
                  {compactComparisonText(comparisonWatchText(item), 92)}
                </p>
                <div className="mt-3">
                  <AffiliateOutboundLink
                    articleId={article.id}
                    href={trackingHrefForRecommendation(article, item)}
                    label={priceCtaLabel()}
                    locale={article.locale}
                    productId={item.sourceProductId}
                    rel={item.rel}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-4 hidden md:block">
        <table className="w-full table-fixed border-y border-neutral-200 text-sm">
          <colgroup>
            <col style={{ width: "7%" }} />
            <col style={{ width: "33%" }} />
            <col style={{ width: "27%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr className="bg-teal-800 text-left text-white">
              <th className="border-teal-700 !text-white">Rank</th>
              <th className="border-teal-700 !text-white">Pick</th>
              <th className="border-teal-700 !text-white">Best fit</th>
              <th className="border-teal-700 !text-white">Check first</th>
              <th className="border-teal-700 !text-white">Price</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((item) => (
              <tr className="odd:bg-white even:bg-neutral-50" key={item.rank}>
                <td>
                  <span className="inline-flex h-8 w-8 items-center justify-center bg-teal-800 text-sm font-black text-white">
                    {item.rank}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <ProductVisual item={item} compact />
                    <span className="min-w-0">
                      <span className="block font-medium text-neutral-900">
                        {item.name}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-neutral-500">
                        {compactComparisonText(item.exactVariant, 72)}
                      </span>
                      {item.badge ? (
                        <span className="mt-1 block text-xs font-bold text-amber-700">
                          {item.badge}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </td>
                <td>
                  <p className="font-medium leading-5 text-neutral-900">
                    {compactComparisonText(item.bestFor, 96)}
                  </p>
                  {hasCoolingFields && item.coolingCapacity ? (
                    <p className="mt-1 text-xs font-bold text-teal-800">
                      {compactComparisonText(item.coolingCapacity, 42)}
                    </p>
                  ) : null}
                </td>
                <td className="text-neutral-700">
                  {compactComparisonText(comparisonWatchText(item), 86)}
                </td>
                <td>
                  <p className="font-black leading-5 text-neutral-950">
                    {item.price}
                  </p>
                  <div className="mt-2">
                    <AffiliateOutboundLink
                      articleId={article.id}
                      href={trackingHrefForRecommendation(article, item)}
                      label={priceCtaLabel()}
                      locale={article.locale}
                      productId={item.sourceProductId}
                      rel={item.rel}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 border-l-4 border-cyan-500 bg-cyan-50 px-4 py-3">
        <p className="text-sm font-semibold leading-6 text-neutral-900">
          {article.expertCopy.comparisonFootnote}
        </p>
      </div>
    </section>
  );
}

function TrendRecommendationCard({
  article,
  item,
}: {
  article: Article;
  item: TrendRecommendation;
}) {
  return (
    <article
      className="border-t border-neutral-200 py-7 first:border-t-0"
      id={`trend-pick-${item.rank}`}
    >
      <div className="grid gap-5 lg:grid-cols-[170px_minmax(0,1fr)_210px]">
        <div className="relative">
          <span
            aria-hidden
            className="absolute left-2 top-2 bg-teal-800 px-2 py-1 text-xs font-bold text-white"
          >
            {item.rank}
          </span>
          <ProductVisual item={item} large />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-normal text-neutral-950">
            {item.rank}. {item.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {item.badge ? (
              <p className="inline-flex bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">
                {item.badge}
              </p>
            ) : null}
          </div>
          <p className={`mt-4 ${articleBodyClass}`}>{item.expertReviewTake}</p>
          <DecisionBlock label="Why I recommend it" value={item.whyRecommend} />
          <DecisionBlock label="Best for" value={item.whoFits} />
          <DecisionBlock
            label="Skip if"
            value={item.whoShouldSkip}
            tone="warning"
          />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SignalList label="Pros" items={item.pros} tone="positive" />
            <SignalList
              label="Repeated complaints to check"
              items={item.repeatedComplaints}
              tone="negative"
            />
          </div>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-neutral-700 md:grid-cols-2">
            <FactNote label="Key check" value={item.keyCheck} />
            {item.productKind ? (
              <FactNote label="Product type" value={item.productKind} />
            ) : null}
            {item.regionFit ? (
              <FactNote label="Region fit" value={item.regionFit} />
            ) : null}
            {item.coolingCapacity ? (
              <FactNote label="Cooling capacity" value={item.coolingCapacity} />
            ) : null}
            {item.hoseType ? (
              <FactNote label="Hose / setup" value={item.hoseType} />
            ) : null}
            {item.noiseLevel ? (
              <FactNote label="Noise" value={item.noiseLevel} />
            ) : null}
            {item.roomSize ? (
              <FactNote label="Room size" value={item.roomSize} />
            ) : null}
            {item.voltagePlug ? (
              <FactNote label="Voltage / plug" value={item.voltagePlug} />
            ) : null}
            <FactNote label="Exact variant" value={item.exactVariant} />
            <FactNote label="Key details" value={item.specSummary} />
            <FactNote label="Review clues" value={item.reviewSummary} />
            <FactNote
              label="Warranty / return"
              value={item.warrantyReturnNote}
            />
            <FactNote label="Marketplace note" value={item.marketplaceNote} />
          </div>
          <SourceStack item={item} />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SignalList label="Cons" items={item.cons} tone="negative" />
          </div>
        </div>
        <div className="self-start border-l-4 border-cyan-500 bg-cyan-50 p-4">
          <p className="text-lg font-black text-neutral-950">{item.price}</p>
          <div className="mt-3">
            <AffiliateOutboundLink
              articleId={article.id}
              href={trackingHrefForRecommendation(article, item)}
              label={priceCtaLabel()}
              locale={article.locale}
              productId={item.sourceProductId}
              rel={item.rel}
            />
          </div>
          <p className="mt-4 text-xs font-bold uppercase text-neutral-600">
            Key Features
          </p>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-neutral-700">
            {item.keyFeatures.map((feature) => (
              <li className="flex gap-2" key={feature}>
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600"
                  aria-hidden
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function SourceStack({ item }: { item: TrendRecommendation }) {
  const priceSource = [item.marketplaceSourceLabel, item.priceCheckedAt]
    .filter(Boolean)
    .join(" - ");
  const rows = [
    ["Product page", item.sourceLabel],
    ["Review reference", item.reviewSourceLabel],
    ["Price checked", priceSource],
  ].filter(([, value]) => value);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border-y border-neutral-200 py-3">
      <p className="text-xs font-black uppercase text-neutral-500">
        Where to verify
      </p>
      <div className="mt-2 grid gap-2 text-xs leading-5 text-neutral-700 md:grid-cols-3">
        {rows.map(([label, value]) => (
          <p key={label}>
            <strong className="block text-neutral-950">{label}</strong>
            {value}
          </p>
        ))}
      </div>
    </div>
  );
}

function DecisionBlock({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warning";
}) {
  const borderClass =
    tone === "warning"
      ? "border-amber-400 bg-amber-50"
      : "border-neutral-200 bg-white";
  return (
    <div className={`mt-4 border-l-4 px-4 py-3 ${borderClass}`}>
      <p className="text-xs font-black uppercase text-neutral-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-neutral-800">{value}</p>
    </div>
  );
}

function FactNote({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <strong className="text-neutral-950">{label}:</strong> {value}
    </p>
  );
}

function SignalList({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "positive" | "negative";
}) {
  const isPositive = tone === "positive";
  const labelClass = isPositive ? "text-[#1565c0]" : "text-[#c62828]";
  const markClass = isPositive ? "text-[#1565c0]" : "text-[#c62828]";

  return (
    <div>
      <p className={`text-xs font-black uppercase ${labelClass}`}>{label}</p>
      <ul className="mt-2 space-y-1 text-sm text-neutral-700">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span className={`font-black ${markClass}`} aria-hidden>
              {isPositive ? "+" : "x"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductVisual({
  item,
  compact = false,
  large = false,
}: {
  item: TrendRecommendation;
  compact?: boolean;
  large?: boolean;
}) {
  const size = compact ? "h-10 w-10" : large ? "h-36 w-full" : "h-24 w-24";
  if (item.imageUrl) {
    return (
      <div
        aria-label={item.imageAlt}
        className={`${size} shrink-0 border border-neutral-200 bg-white bg-contain bg-center bg-no-repeat`}
        role="img"
        style={{
          backgroundImage: `url("${item.imageUrl}")`,
        }}
      />
    );
  }

  // TODO(pipeline): No numeric placeholder. Product images must come from the affiliate/merchant feed later.
  // If this returns null in production, the ingestion/publishing gate should block the article before rendering.
  return null;
}

function TrendArticleHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-end gap-4 border-b-4 border-cyan-500 pb-3">
      <h2 className="min-w-0 flex-1 text-[28px] font-bold leading-[31px] tracking-normal text-[#2b2f33] md:text-[32px] md:leading-[35.2px]">
        {children}
      </h2>
      <SectionSpark />
    </div>
  );
}

function SectionSpark() {
  return (
    <span
      aria-hidden
      className="mb-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-500 bg-white text-cyan-600 shadow-[0_2px_0_rgba(6,182,212,0.18)] min-[360px]:h-8 min-[360px]:w-8"
    >
      <svg
        className="h-3.5 w-3.5 min-[360px]:h-4 min-[360px]:w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 3.8 13.9 9l5.3 1.9-5.3 1.9L12 18l-1.9-5.2-5.3-1.9L10.1 9 12 3.8Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.9"
        />
        <path
          d="M18.8 16.2 19.6 18l1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8.8-1.8Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function trendSectionId(heading: string, index: number) {
  const normalizedHeading = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  if (normalizedHeading === "quick-answer") {
    return "quick-answer";
  }
  return normalizedHeading || `section-${index + 1}`;
}

function trackingHrefForRecommendation(
  article: Article,
  item: TrendRecommendation,
) {
  // Keep the purchase path direct and resilient. Analytics is recorded in AffiliateOutboundLink;
  // production affiliate ingestion should replace placeholder search URLs with validated deep links.
  void article;
  return item.href;
}

function priceCtaLabel() {
  return "Check price";
}

function comparisonWatchText(item: TrendRecommendation) {
  return item.keyCheck || item.whoShouldSkip || item.returnRiskLabel;
}

function compactComparisonText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}
