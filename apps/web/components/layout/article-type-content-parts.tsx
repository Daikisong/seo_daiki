import type { Article, Product } from "@global-import-lab/types";
import type { ReactNode } from "react";
import { AffiliateOutboundLink } from "@/components/seo/AffiliateOutboundLink";
import { EvidenceList } from "@/components/product/EvidenceList";
import { UpdateLog } from "@/components/seo/UpdateLog";
import { affiliateTrackingHrefForArticle } from "@/lib/content/article-page-model";
import {
  buildTrendRecommendationModel,
  type TrendRecommendation
} from "@/lib/content/trend-recommendations";

export function ArticleEvidenceFooter({
  article,
  includeUpdateLog = true,
  variant = "default"
}: {
  article: Article;
  includeUpdateLog?: boolean;
  variant?: "default" | "editorial";
}) {
  if (variant === "editorial") {
    return (
      <section className="border-t border-neutral-200 pt-6">
        <h2 className="text-sm font-black uppercase tracking-normal text-neutral-950">Evidence and update log</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-700">Last evidence refresh: {article.lastUpdated}</p>
        {article.evidenceIds.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-600">
            {article.evidenceIds.map((id) => (
              <li className="border border-neutral-200 px-2 py-1 font-mono" key={id}>
                {id}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    );
  }

  return (
    <>
      <EvidenceList evidenceIds={article.evidenceIds} />
      {includeUpdateLog ? <UpdateLog lastUpdated={article.lastUpdated} /> : null}
    </>
  );
}

export function SectionGrid({ article, startIndex = 0 }: { article: Article; startIndex?: number }) {
  const sections = article.sections.slice(startIndex);
  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {sections.map((section) => (
        <div className="rounded-md border border-neutral-200 bg-white p-4" key={section.heading}>
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
        This page is informational only, not medical advice. Readers should consult a qualified healthcare professional
        before using supplements, especially during pregnancy, medication use, or chronic conditions.
      </p>
    </section>
  );
}

export function TrendEditorialSections({ article }: { article: Article }) {
  const fallbackSections = [
    {
      heading: "Quick answer",
      body: "Start with the practical answer, then explain what changed and what readers should check before buying."
    },
    {
      heading: "Why it is trending",
      body: "Use freshness, search demand, source signals, and repeated SERP patterns to explain why the topic is moving now."
    },
    {
      heading: "What to check now",
      body: "Check official sources, local availability, exact product variants, final price, and return risk before clicking."
    }
  ];
  const sections = article.sections.length > 0 ? article.sections : fallbackSections;

  return (
    <section className="space-y-10">
      {sections.map((section, index) => (
        <section id={trendSectionId(index)} key={`${section.heading}-${index}`}>
          <TrendArticleHeading>{section.heading}</TrendArticleHeading>
          <p className="mt-5 max-w-4xl text-base leading-8 text-neutral-800">{section.body}</p>
        </section>
      ))}
    </section>
  );
}

export function TrendBackdataIntro({ article, products }: { article: Article; products: Product[] }) {
  const verifiedClaims = products.reduce((count, product) => count + product.verifiedClaims.length, 0);
  const priceSnapshots = products.reduce((count, product) => count + product.priceSnapshots.length, 0);
  const reviewSignals = products.reduce((count, product) => count + product.reviewSignals.length, 0);
  const localRiskRows = products.reduce(
    (count, product) => count + product.marketRisks.filter((risk) => risk.locale === article.locale).length,
    0
  );
  const recommendationModel = buildTrendRecommendationModel(article, products);
  const rows = [
    {
      label: "Search intent",
      value: recommendationModel.eligible
        ? recommendationModel.reasons.slice(0, 3).join(", ")
        : "Trend is still treated as informational until purchase intent is clearer."
    },
    {
      label: "Trend evidence",
      value: `${article.evidenceIds.length} source or evidence signals attached to the article draft.`
    },
    {
      label: "Product backing",
      value: `${products.length} product records, ${verifiedClaims} verified claims, ${priceSnapshots} price snapshots, and ${reviewSignals} review-signal rows.`
    },
    {
      label: "Local risk",
      value:
        localRiskRows > 0
          ? `${localRiskRows} ${article.locale} risk rows used for shipping, certification, return, or import checks.`
          : "Local risk should be verified before this page becomes a fully approved buyer guide."
    }
  ];

  return (
    <section id="trend-data">
      <p className="max-w-4xl text-base leading-8 text-neutral-800">
        Before this becomes a recommendation list, Trend Picks checks the live trend against the same signals readers
        expect from high-ranking review blogs: visible selection criteria, freshness, product proof, price context,
        and local risk. The table below is the backdata used for this draft.
      </p>
      <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200 md:hidden">
        {rows.map((row) => (
          <div className="py-3" key={row.label}>
            <p className="text-xs font-black uppercase tracking-normal text-teal-700">{row.label}</p>
            <p className="mt-1 text-sm leading-6 text-neutral-700">{row.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 hidden overflow-x-auto border-y border-neutral-200 md:block">
        <table className="min-w-[680px] text-sm">
          <tbody>
            {rows.map((row) => (
              <tr className="border-b border-neutral-200 last:border-b-0" key={row.label}>
                <th className="w-44 bg-neutral-50 px-3 py-3 text-left text-xs font-black uppercase tracking-normal text-teal-700">
                  {row.label}
                </th>
                <td className="px-3 py-3 leading-6 text-neutral-700">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function TrendCommerceSection({ article, products }: { article: Article; products: Product[] }) {
  const recommendationModel = buildTrendRecommendationModel(article, products);
  if (!recommendationModel.eligible || recommendationModel.recommendations.length === 0) {
    return null;
  }

  const recommendations = recommendationModel.recommendations;

  return (
    <section className="space-y-10 border-t border-neutral-200 pt-10" id="recommended-gear">
      <section>
        <TrendArticleHeading>Top 10 practical picks for this trend</TrendArticleHeading>
        <p className="mt-5 max-w-4xl text-base leading-8 text-neutral-800">
          The trend summary above explains why people are searching now. This buying section keeps the same page
          flow: compare the useful picks, check the evidence, then click only after the exact SKU, final price,
          shipping, and return risk still make sense.
        </p>
        <p className="mt-4 max-w-4xl border-l-4 border-cyan-500 bg-cyan-50 px-4 py-3 text-sm leading-6 text-neutral-800">
          Selection gate passed: {recommendationModel.reasons.slice(0, 3).join(", ")}. Outbound buttons may be
          sponsored affiliate links, so this section stays tied to evidence and local-risk checks instead of acting
          like a generic deal list.
        </p>
      </section>

      <TrendSelectionMethod article={article} reasons={recommendationModel.reasons} />

      <TrendComparisonTable article={article} recommendations={recommendations} />

      <section className="space-y-4" id="top-10-reviews">
        <TrendArticleHeading>My in-depth notes on all 10 picks</TrendArticleHeading>
        {recommendations.map((item) => (
          <TrendRecommendationCard article={article} item={item} key={item.rank} />
        ))}
      </section>

      <section className="grid gap-8 border-t border-neutral-200 pt-8 md:grid-cols-[1fr_0.9fr]" id="buying-checklist">
        <div>
          <h2 className="text-lg font-black tracking-normal text-neutral-950">Affiliate disclosure</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-700">
            Trend Picks may earn a commission when readers buy through outbound links. Recommendations should be
            checked against the exact SKU, final shipped price, seller rating, return path, and local import rules.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-black tracking-normal text-neutral-950">Buying checklist</h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            {[
              "Match the exact variant before clicking.",
              "Check final price, shipping, coupon, and delivery estimate.",
              "Avoid urgent purchases when cross-border shipping is slow.",
              "Read low-star reviews for repeated safety or quality issues.",
              "Prefer products with clear specs, photos, and return terms."
            ].map((item) => (
              <li className="flex gap-2" key={item}>
                <span className="mt-1 h-3 w-3 rounded-sm border border-teal-700" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TrendFinalVerdict recommendations={recommendations} />
      <TrendFAQ article={article} />
      <TrendEditorialMethod article={article} products={products} recommendations={recommendations} />
    </section>
  );
}

function TrendFinalVerdict({ recommendations }: { recommendations: TrendRecommendation[] }) {
  const topPick = recommendations[0];

  return (
    <section className="border-t border-neutral-200 pt-8" id="final-thoughts">
      <TrendArticleHeading>Final thoughts on this trend</TrendArticleHeading>
      <div className="mt-5 max-w-4xl space-y-4 text-base leading-8 text-neutral-800">
        <p>
          This trend is useful only when the reader can connect the search spike to a product that still has the right
          variant, live price, seller record, and local delivery path. If those checks fail, the safer recommendation is
          to keep watching the trend instead of forcing a purchase.
        </p>
        {topPick ? (
          <p>
            The strongest starting point in this draft is <strong>{topPick.name}</strong>, but it should stay a
            recommendation only while the exact SKU, wattage or specification claim, shipped price, and return route
            still match the evidence on this page.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function TrendFAQ({ article }: { article: Article }) {
  const faqs = [
    {
      question: "Should every trend page include affiliate picks?",
      answer:
        "No. A trend should only become a buyer guide when the search intent, product evidence, approved merchant path, and local-risk checks all support recommendations."
    },
    {
      question: "How often should this guide be refreshed?",
      answer: `Refresh it whenever trend signals, seller availability, price snapshots, variant risk, or local rules change. This draft was last updated on ${article.lastUpdated}.`
    },
    {
      question: "What should readers verify before clicking a link?",
      answer:
        "Check the exact SKU or variant, final shipped price, plug or compatibility requirements, seller rating, low-star review patterns, return terms, and any local import or certification rules."
    }
  ];

  return (
    <section className="border-t border-neutral-200 pt-8" id="faq">
      <TrendArticleHeading>FAQ</TrendArticleHeading>
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

function TrendEditorialMethod({
  article,
  products,
  recommendations
}: {
  article: Article;
  products: Product[];
  recommendations: TrendRecommendation[];
}) {
  const verifiedClaims = products.reduce((count, product) => count + product.verifiedClaims.length, 0);
  const priceSnapshots = products.reduce((count, product) => count + product.priceSnapshots.length, 0);
  const reviewSignals = products.reduce((count, product) => count + product.reviewSignals.length, 0);
  const rows = [
    ["Trend signal", `${article.evidenceIds.length} evidence IDs attached to the article model.`],
    ["Product evidence", `${products.length} product records support ${recommendations.length} ranked picks.`],
    ["Backdata", `${verifiedClaims} verified claims, ${priceSnapshots} price snapshots, and ${reviewSignals} review signals.`],
    ["Affiliate rule", "Outbound links stay tied to approved merchants, disclosure, and local-risk checks."]
  ] as const;

  return (
    <section className="border-t border-neutral-200 pt-8" id="editorial-method">
      <TrendArticleHeading>Editorial method</TrendArticleHeading>
      <p className="mt-5 max-w-4xl text-base leading-8 text-neutral-800">
        Trend Picks is built as an editorial trend guide, not a random deal feed. The page starts with search and
        freshness context, then adds product recommendations only when the content model has enough commerce intent,
        evidence, product records, affiliate disclosure, and local-risk coverage.
      </p>
      <div className="mt-5 border-y border-neutral-200">
        {rows.map(([label, value]) => (
          <div className="grid gap-2 border-b border-neutral-200 py-4 last:border-b-0 md:grid-cols-[180px_minmax(0,1fr)]" key={label}>
            <p className="text-sm font-black uppercase tracking-normal text-teal-700">{label}</p>
            <p className="text-sm leading-6 text-neutral-700">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrendSelectionMethod({ article, reasons }: { article: Article; reasons: string[] }) {
  const criteria = [
    {
      label: "Search intent",
      value: reasons.includes("commercial search intent")
        ? "The trend has comparison, price, product, or buying language."
        : "The trend needs clearer purchase language before monetized picks expand."
    },
    {
      label: "Evidence fit",
      value:
        article.evidenceIds.length > 0
          ? `${article.evidenceIds.length} evidence signals are attached before product ranking.`
          : "Evidence should be attached before this becomes an approved buying guide."
    },
    {
      label: "Local risk",
      value: "Recommendations are checked against variant, shipping, returns, certification, and import-risk notes."
    }
  ];

  return (
    <section id="how-we-chose">
      <TrendArticleHeading>How we chose these picks</TrendArticleHeading>
      <p className="mt-5 max-w-4xl text-base leading-8 text-neutral-800">
        This follows the same practical flow as a Top 10 buying guide: first confirm buyer intent, then compare
        exact products, then surface risks before the outbound link.
      </p>
      <div className="mt-5 border-y border-neutral-200">
        {criteria.map((item) => (
          <div className="grid gap-2 border-b border-neutral-200 py-4 last:border-b-0 md:grid-cols-[180px_minmax(0,1fr)]" key={item.label}>
            <p className="text-sm font-black uppercase tracking-normal text-teal-700">{item.label}</p>
            <p className="text-sm leading-6 text-neutral-700">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrendComparisonTable({
  article,
  recommendations
}: {
  article: Article;
  recommendations: TrendRecommendation[];
}) {
  return (
    <section id="top-10-comparison">
      <TrendArticleHeading>Quick comparison table</TrendArticleHeading>
      <div className="mt-5">
        <p className="text-sm leading-6 text-neutral-600">
          Scan rank, fit, risk check, price, and action before reading the detailed notes.
        </p>
      </div>
      <div className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200 md:hidden">
        {recommendations.map((item) => (
          <article className="py-4" key={item.rank}>
            <div className="flex items-start gap-3">
              <ProductVisual label={item.visual} compact />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold leading-snug text-neutral-950">
                    {item.rank}. {item.name}
                  </h3>
                  <span className="shrink-0 text-sm font-black text-neutral-950">{item.price}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-600">{item.bestFor}</p>
                <p className="mt-1 text-xs text-neutral-600">Check: {item.keyCheck}</p>
                {item.badge ? (
                  <p className="mt-2 inline-flex rounded-sm bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">
                    {item.badge}
                  </p>
                ) : null}
                <div className="mt-3">
                  <AffiliateOutboundLink
                    articleId={article.id}
                    href={trackingHrefForRecommendation(article, item)}
                    label="View price"
                    locale={article.locale}
                    productId={article.productId}
                    rel={item.rel}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="min-w-[760px] text-sm">
          <thead>
            <tr className="bg-teal-800 text-left text-white">
              <th className="border-teal-700 text-white">Rank</th>
              <th className="border-teal-700 text-white">Pick</th>
              <th className="border-teal-700 text-white">Best for</th>
              <th className="border-teal-700 text-white">Key check</th>
              <th className="border-teal-700 text-white">Price</th>
              <th className="border-teal-700 text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((item) => (
              <tr key={item.rank}>
                <td className="font-bold text-neutral-950">{item.rank}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <ProductVisual label={item.visual} compact />
                    <span>
                      <span className="block font-medium text-neutral-900">{item.name}</span>
                      {item.badge ? <span className="mt-1 block text-xs font-bold text-amber-700">{item.badge}</span> : null}
                    </span>
                  </div>
                </td>
                <td>{item.bestFor}</td>
                <td>{item.keyCheck}</td>
                <td className="font-semibold text-neutral-950">{item.price}</td>
                <td>
                  <AffiliateOutboundLink
                    articleId={article.id}
                    href={trackingHrefForRecommendation(article, item)}
                    label="View price"
                    locale={article.locale}
                    productId={article.productId}
                    rel={item.rel}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-neutral-200 py-3 text-xs text-neutral-500">
        Prices are directional placeholders from the content model or search-intent fit. Verify live price and variant
        before publishing an approved monetized placement.
      </p>
    </section>
  );
}

function TrendRecommendationCard({ article, item }: { article: Article; item: TrendRecommendation }) {
  return (
    <article className="border-t border-neutral-200 py-7 first:border-t-0" id={`trend-pick-${item.rank}`}>
      <div className="grid gap-5 lg:grid-cols-[170px_minmax(0,1fr)_210px]">
        <div className="relative">
          <span className="absolute left-2 top-2 bg-teal-800 px-2 py-1 text-xs font-bold text-white">
            {item.rank}
          </span>
          <ProductVisual label={item.visual} large />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-normal text-neutral-950">
            {item.rank}. {item.name}
          </h3>
          {item.badge ? (
            <p className="mt-2 inline-flex bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">{item.badge}</p>
          ) : null}
          <p className="mt-2 text-sm text-neutral-700">
            <strong>Best for:</strong> {item.bestFor}
          </p>
          <p className="mt-1 text-sm text-neutral-700">
            <strong>Key check:</strong> {item.keyCheck}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SignalList label="Pros" items={item.pros} tone="positive" />
            <SignalList label="Cons" items={item.cons} tone="negative" />
          </div>
        </div>
        <div className="border-l-4 border-cyan-500 bg-cyan-50 p-4">
          <p className="text-lg font-black text-neutral-950">{item.price}</p>
          <div className="mt-3">
            <AffiliateOutboundLink
              articleId={article.id}
              href={trackingHrefForRecommendation(article, item)}
              label="Check AliExpress price"
              locale={article.locale}
              productId={article.productId}
              rel={item.rel}
            />
          </div>
          <p className="mt-4 text-xs font-bold uppercase text-neutral-500">My take</p>
          <p className="mt-1 text-sm leading-6 text-neutral-700">{item.take}</p>
        </div>
      </div>
    </article>
  );
}

function SignalList({ label, items, tone }: { label: string; items: string[]; tone: "positive" | "negative" }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-neutral-500">{label}</p>
      <ul className="mt-2 space-y-1 text-sm text-neutral-700">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span className={tone === "positive" ? "font-bold text-teal-700" : "font-bold text-neutral-500"} aria-hidden>
              {tone === "positive" ? "+" : "x"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductVisual({ label, compact = false, large = false }: { label: string; compact?: boolean; large?: boolean }) {
  const size = compact ? "h-10 w-10" : large ? "h-36 w-full" : "h-24 w-24";
  const imageIndex = Number(label);
  const hasProductImage = Number.isFinite(imageIndex);
  const column = hasProductImage ? (imageIndex - 1) % 5 : 0;
  const row = hasProductImage ? Math.floor((imageIndex - 1) / 5) : 0;
  const backgroundPosition = `${column * 25}% ${row * 100}%`;

  if (hasProductImage) {
    return (
      <div
        aria-label={`Product thumbnail ${imageIndex}`}
        className={`${size} shrink-0 border border-neutral-200 bg-white bg-[length:500%_200%]`}
        role="img"
        style={{
          backgroundImage: "url('/images/trend-products/trend-product-contact-sheet.png')",
          backgroundPosition
        }}
      />
    );
  }

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center border border-neutral-200 bg-cyan-50 text-center text-xs font-black text-teal-800`}
    >
      {label}
    </div>
  );
}

function TrendArticleHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-end gap-4 border-b-4 border-cyan-500 pb-3">
      <h2 className="flex-1 text-3xl font-black leading-tight tracking-normal text-sky-700 md:text-4xl">{children}</h2>
      <span className="mb-2 h-3 w-3 rotate-45 bg-orange-500" aria-hidden />
    </div>
  );
}

function trendSectionId(index: number) {
  if (index === 0) {
    return "quick-answer";
  }
  if (index === 1) {
    return "why-trending";
  }
  if (index === 2) {
    return "what-to-check";
  }
  return undefined;
}

function trackingHrefForRecommendation(article: Article, item: TrendRecommendation) {
  return affiliateTrackingHrefForArticle(
    {
      label: item.name,
      href: item.href,
      rel: item.rel
    },
    article
  );
}
