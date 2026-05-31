import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMarketHreflangMap, canonicalForMarketPath, marketPath } from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { enabledMarkets, findMarket } from "@/lib/market/config";
import { readMarketBriefs, readMarketKeywords, readMarketPosts, readMarketSerp, readMarketTrends } from "@/lib/market/market-data";
import { labelsForLanguage } from "@/lib/market/ui-labels";
import { shouldNoindexMarketHome } from "@/lib/seo/market-index-policy";

interface MarketHomeProps {
  params: Promise<{ locale: string; language: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().map((market) => ({ locale: market.market, language: market.language }));
}

export async function generateMetadata({ params }: MarketHomeProps) {
  const { locale: marketCode, language } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const labelState = labelsForLanguage(market.language);
  const path = marketPath(market);
  return {
    title: `${market.country} ${market.language} ${labelState.labels.marketTrendDesk}`,
    description: labelState.labels.marketDescription,
    alternates: { canonical: canonicalForMarketPath(path), languages: buildMarketHreflangMap(enabledMarkets(), market) },
    robots: { index: !shouldNoindexMarketHome(market), follow: true }
  };
}

export default async function MarketHomePage({ params }: MarketHomeProps) {
  const { locale: marketCode, language } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }

  const trends = readMarketTrends(market).slice(0, 6);
  const keywords = readMarketKeywords(market).slice(0, 4);
  const serp = readMarketSerp(market).slice(0, 3);
  const briefs = readMarketBriefs(market).slice(0, 3);
  const posts = readMarketPosts(market).slice(0, 3);
  const { labels } = labelsForLanguage(market.language);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm font-semibold uppercase text-teal-700">{labels.marketTrendDesk}</p>
        <h1 className="mt-3 text-4xl font-semibold">{market.country} / {market.language}</h1>
        <p className="mt-3 max-w-3xl text-neutral-700">
          {labels.marketDescription}
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link className="rounded-md border border-neutral-300 px-3 py-2 hover:border-teal-700" href={`${market.pathPrefix}/calendar/`}>{labels.calendar}</Link>
          <Link className="rounded-md border border-neutral-300 px-3 py-2 hover:border-teal-700" href="/global/trend-map/">{labels.globalTrendMap}</Link>
          <Link className="rounded-md border border-neutral-300 px-3 py-2 hover:border-teal-700" href="/global/markets/">{labels.allMarkets}</Link>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <MarketList emptyLabel={labels.emptyRows} title={labels.trends} items={trends.map((trend) => ({ href: `${market.pathPrefix}/trends/${trend.slug}/`, label: trend.title, meta: `${labels.score}: ${trend.score.toFixed(1)} / ${labels.category}: ${trend.category}` }))} />
          <MarketList emptyLabel={labels.emptyRows} title={labels.keywords} items={keywords.map((keyword) => ({ href: `${market.pathPrefix}/keywords/${keyword.slug}/`, label: keyword.keyword, meta: `${labels.intent}: ${keyword.intent} / ${labels.priorityScore}: ${keyword.score.toFixed(1)}` }))} />
          <MarketList emptyLabel={labels.emptyRows} title={labels.serpOpportunities} items={serp.map((item) => ({ href: `${market.pathPrefix}/serp/${item.slug}/`, label: item.keyword, meta: item.recommendedAngle }))} />
          <MarketList emptyLabel={labels.emptyRows} title={labels.briefs} items={briefs.map((brief) => ({ href: `${market.pathPrefix}/briefs/${brief.slug}/`, label: brief.title, meta: brief.angle }))} />
          <MarketList emptyLabel={labels.emptyRows} title={labels.testPosts} items={posts.map((post) => ({ href: `${market.pathPrefix}/posts/${post.slug}/`, label: post.title, meta: post.status }))} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function MarketList({
  emptyLabel,
  items,
  title
}: {
  emptyLabel: string;
  items: Array<{ href: string; label: string; meta: string }>;
  title: string;
}) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-600">{emptyLabel}</p>
      ) : (
        <div className="mt-3 grid gap-2">
          {items.map((item) => (
            <Link className="rounded-md border border-neutral-100 p-3 hover:border-teal-700" href={item.href} key={item.href}>
              <span className="block font-semibold">{item.label}</span>
              <span className="block text-sm text-neutral-600">{item.meta}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
