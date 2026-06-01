import { SiteFooter } from "@/components/layout/SiteFooter";
import { MarketArticleTopbar } from "@/components/market/MarketArticleTopbar";
import type { MarketConfig } from "@global-import-lab/types";
import { estimatedProductPostViews, splitMarketPosts } from "@/lib/market/market-content-branches";
import { readMarketPosts, readMarketTrends } from "@/lib/market/market-data";
import type { MarketPostView, MarketTrendView } from "@/lib/market/market-data-types";
import type { MarketTopbarSection } from "@/lib/market/market-sections";
import { MarketNewsList } from "./MarketNewsSection";
import { ProductRankingList, ProductReviewHome } from "./MarketReviewSections";
import { CommunitySection, MarketSearchPanel, SubscribeSection, TipsSection } from "./MarketUtilitySections";
import { emptyCopy, newsEmptyCopy, sectionCopy } from "./market-section-copy";

export function MarketSectionPageContent({
  market,
  query,
  section
}: {
  market: MarketConfig;
  query: string;
  section: MarketTopbarSection;
}) {
  const posts = readMarketPosts(market);
  const { productPosts, newsPosts } = splitMarketPosts(posts);
  const trends = readMarketTrends(market);
  const copy = sectionCopy(market.language, section);

  return (
    <>
      <MarketArticleTopbar active={section} language={market.language} marketPath={market.pathPrefix} />
      <main className="market-section-page">
        <header className="market-section-hero">
          <p>{copy.kicker}</p>
          <h1>{copy.title}</h1>
          {copy.description ? <span>{copy.description}</span> : null}
        </header>
        {renderSectionContent({
          language: market.language,
          marketPath: market.pathPrefix,
          newsPosts,
          posts,
          productPosts,
          query,
          section,
          trends
        })}
      </main>
      <SiteFooter language={market.language} />
    </>
  );
}

function renderSectionContent({
  language,
  marketPath,
  newsPosts,
  posts,
  productPosts,
  query,
  section,
  trends
}: {
  language: string;
  marketPath: string;
  newsPosts: MarketPostView[];
  posts: MarketPostView[];
  productPosts: MarketPostView[];
  query: string;
  section: MarketTopbarSection;
  trends: MarketTrendView[];
}) {
  if (section === "reviews") {
    return <ProductReviewHome emptyLabel={emptyCopy(language)} language={language} marketPath={marketPath} posts={productPosts} />;
  }
  if (section === "rankings") {
    const ranked = [...productPosts].sort((a, b) => estimatedProductPostViews(b) - estimatedProductPostViews(a));
    return <ProductRankingList emptyLabel={emptyCopy(language)} language={language} marketPath={marketPath} posts={ranked} />;
  }
  if (section === "news") {
    return <MarketNewsList emptyLabel={newsEmptyCopy(language)} language={language} marketPath={marketPath} posts={newsPosts} />;
  }
  if (section === "tips") {
    return <TipsSection language={language} />;
  }
  if (section === "community") {
    return <CommunitySection language={language} marketPath={marketPath} posts={productPosts} />;
  }
  if (section === "search") {
    return <MarketSearchPanel language={language} marketPath={marketPath} posts={posts} query={query} trends={trends} />;
  }
  return <SubscribeSection language={language} marketPath={marketPath} />;
}
