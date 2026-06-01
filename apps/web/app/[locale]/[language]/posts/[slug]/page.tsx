import { notFound } from "next/navigation";
import {
  buildExistingMarketContentHreflangMap,
  canonicalForMarketPath,
  hreflangKeyForMarket,
  marketContentPath
} from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MarketArticleTopbar } from "@/components/market/MarketArticleTopbar";
import { MarketNewsPostDetail } from "@/components/market/MarketNewsPostDetail";
import { MarketReviewPostDetail } from "@/components/market/MarketReviewPostDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { enabledMarkets, findMarket } from "@/lib/market/config";
import { isNewsPost, splitMarketPosts } from "@/lib/market/market-content-branches";
import { buildNewsPostJsonLd, buildReviewPostJsonLd, publicNewsPostForClient } from "@/lib/market/market-article-jsonld";
import { marketContentHreflangVariants, readMarketPosts } from "@/lib/market/market-data";
import { routeSlugMatches } from "@/lib/market/route-slugs";
import { marketResearchMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ locale: string; language: string; slug: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().flatMap((market) =>
    readMarketPosts(market).map((post) => ({ locale: market.market, language: market.language, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const post = readMarketPosts(market).find((item) => routeSlugMatches(item.slug, slug));
  const path = marketContentPath(market, "posts", slug);
  const variants = marketContentHreflangVariants(enabledMarkets(), "posts", slug);
  const currentVariant = variants.find((variant) => variant.market === market.market && variant.language === market.language) ?? {
    market: market.market,
    language: market.language,
    path,
    hreflang: hreflangKeyForMarket(market),
    exists: Boolean(post),
    indexable: true
  };
  return marketResearchMetadata({
    title: post ? post.title : `${market.country} Market Guide`,
    description: post?.summary ?? `Market guide for ${market.country}.`,
    canonical: canonicalForMarketPath(path),
    hreflangMap: buildExistingMarketContentHreflangMap(variants, currentVariant),
    image: post?.heroImage?.src,
    index: post?.indexStatus === "index"
  });
}

export default async function MarketPostPage({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }

  const posts = readMarketPosts(market);
  const post = posts.find((item) => routeSlugMatches(item.slug, slug));
  if (!post) {
    notFound();
  }

  const canonical = canonicalForMarketPath(marketContentPath(market, "posts", post.slug));

  if (isNewsPost(post)) {
    const newsPosts = splitMarketPosts(posts).newsPosts;
    const currentIndex = newsPosts.findIndex((item) => item.id === post.id);
    return (
      <>
        <JsonLd data={buildNewsPostJsonLd({ canonical, market, post })} />
        <MarketArticleTopbar active="news" marketPath={market.pathPrefix} language={market.language} />
        <MarketNewsPostDetail
          country={market.country}
          language={market.language}
          marketPath={market.pathPrefix}
          nextPost={currentIndex >= 0 ? newsPosts[currentIndex + 1] : undefined}
          post={publicNewsPostForClient(post)}
          previousPost={currentIndex > 0 ? newsPosts[currentIndex - 1] : undefined}
        />
        <SiteFooter language={market.language} />
      </>
    );
  }

  return (
    <>
      <JsonLd data={buildReviewPostJsonLd({ canonical, market, post })} />
      <MarketArticleTopbar marketPath={market.pathPrefix} language={market.language} />
      <MarketReviewPostDetail market={market} post={post} />
      <SiteFooter language={market.language} />
    </>
  );
}
