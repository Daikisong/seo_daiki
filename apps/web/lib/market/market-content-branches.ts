import type { MarketPostView } from "./market-data-types";

export interface MarketPostBranches {
  productPosts: MarketPostView[];
  newsPosts: MarketPostView[];
}

export function splitMarketPosts(posts: MarketPostView[]): MarketPostBranches {
  return {
    productPosts: posts.filter(isProductReviewPost),
    newsPosts: posts.filter(isNewsPost)
  };
}

export function isProductReviewPost(post: MarketPostView): boolean {
  return post.contentBranch === "review";
}

export function isNewsPost(post: MarketPostView): boolean {
  return post.contentBranch === "news";
}

export function estimatedProductPostViews(post: MarketPostView): number {
  const base = 800 + post.seoReadinessScore * 27 + post.sourceLinks.length * 140 + post.checklist.length * 85;
  return post.productCandidateState === "allowed_pending" ? base + 900 : base;
}
